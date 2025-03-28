#!/bin/bash

# Variables
REPO_URL="https://github.com/nsitapara/stellarcare.git"
CLONE_DIR="stellarcare"
DOMAIN="stellarcare.nsitapara.com"
NODE_VERSION="21"
PYTHON_VERSION="3.13"

# Function to display an error and exit
function error_exit {
    echo "[ERROR] $1" >&2
    exit 1
}

# Update system and install basic dependencies
echo "[INFO] Updating system and installing basic dependencies..."
apt-get update
apt-get install -y curl git nginx certbot python3-certbot-nginx build-essential || error_exit "Failed to install basic dependencies"

# Install PostgreSQL
echo "[INFO] Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib || error_exit "Failed to install PostgreSQL"

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Install Node.js
echo "[INFO] Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs || error_exit "Failed to install Node.js"

# Install pnpm
echo "[INFO] Installing pnpm..."
npm install -g pnpm || error_exit "Failed to install pnpm"

# Install Python 3.13
echo "[INFO] Installing Python ${PYTHON_VERSION}..."
apt-get install -y software-properties-common
add-apt-repository ppa:deadsnakes/ppa
apt-get update
apt-get install -y python${PYTHON_VERSION} python${PYTHON_VERSION}-venv python${PYTHON_VERSION}-dev || error_exit "Failed to install Python"

# Install pip and uv
echo "[INFO] Installing pip and uv..."
curl -sSf https://bootstrap.pypa.io/get-pip.py | python${PYTHON_VERSION}
pip install uv || error_exit "Failed to install uv"

# Clone the repository
if [ -d "$CLONE_DIR" ]; then
    echo "[INFO] Removing existing repository..."
    rm -rf "$CLONE_DIR"
fi

echo "[INFO] Cloning the repository..."
git clone "$REPO_URL" "$CLONE_DIR" || error_exit "Failed to clone the repository"
cd "$CLONE_DIR" || error_exit "Failed to navigate to the repository directory"

# Setup PostgreSQL database
echo "[INFO] Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE stellarcare;" || error_exit "Failed to create database"
sudo -u postgres psql -c "CREATE USER stellarcare WITH PASSWORD 'change-me-in-production';" || error_exit "Failed to create database user"
sudo -u postgres psql -c "ALTER ROLE stellarcare SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE stellarcare SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE stellarcare SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE stellarcare TO stellarcare;"

# Setup backend
echo "[INFO] Setting up backend..."
cd backend || error_exit "Failed to enter backend directory"
python${PYTHON_VERSION} -m venv .venv
source .venv/bin/activate
uv sync || error_exit "Failed to install backend dependencies"

# Setup environment variables
echo "[INFO] Setting up environment variables..."
cp ../.env.backend.template .env
# Update environment variables with production values
sed -i 's/DEBUG=1/DEBUG=0/' .env
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=change-me-in-production/" .env
echo "ALLOWED_HOSTS=$DOMAIN,localhost,127.0.0.1" >> .env

# Run migrations and create superuser
python manage.py migrate || error_exit "Failed to run migrations"
python manage.py collectstatic --noinput || error_exit "Failed to collect static files"
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'change-me-in-production')" | python manage.py shell

# Setup frontend
echo "[INFO] Setting up frontend..."
cd ../frontend || error_exit "Failed to enter frontend directory"
pnpm install || error_exit "Failed to install frontend dependencies"
cp ../.env.frontend.template .env
echo "BUILD_ENV=production" >> .env
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_URL=https://$DOMAIN" >> .env
pnpm build || error_exit "Failed to build frontend"

# Configure Nginx
echo "[INFO] Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << EOL
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /static/ {
        alias /path/to/$CLONE_DIR/backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/$CLONE_DIR/backend/mediafiles/;
    }
}
EOL

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t || error_exit "Nginx configuration test failed"

# Setup SSL
echo "[INFO] Setting up SSL..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect || error_exit "Failed to setup SSL"

# Create systemd services
echo "[INFO] Creating systemd services..."

# Backend service
cat > /etc/systemd/system/stellarcare-backend.service << EOL
[Unit]
Description=StellarCare Backend
After=network.target

[Service]
User=root
WorkingDirectory=/path/to/$CLONE_DIR/backend
Environment="PATH=/path/to/$CLONE_DIR/backend/.venv/bin"
ExecStart=/path/to/$CLONE_DIR/backend/.venv/bin/python manage.py runserver 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# Frontend service
cat > /etc/systemd/system/stellarcare-frontend.service << EOL
[Unit]
Description=StellarCare Frontend
After=network.target

[Service]
User=root
WorkingDirectory=/path/to/$CLONE_DIR/frontend
Environment="NODE_ENV=production"
ExecStart=$(which pnpm) start
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# Start services
systemctl daemon-reload
systemctl enable stellarcare-backend stellarcare-frontend
systemctl start stellarcare-backend stellarcare-frontend
systemctl restart nginx

echo "[SUCCESS] Setup completed successfully!"
echo "Backend running on: https://$DOMAIN/api"
echo "Frontend running on: https://$DOMAIN"
echo "Admin interface: https://$DOMAIN/admin"
echo "Default admin credentials: admin/change-me-in-production"
echo "Please change the admin password and update database credentials in production!"