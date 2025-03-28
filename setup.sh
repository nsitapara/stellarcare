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

# Function to safely execute PostgreSQL commands
function psql_execute() {
    PGPASSWORD="postgres" psql -U postgres -h localhost -c "$1"
}

# Function to wait for PostgreSQL
function wait_for_postgres() {
    echo "[INFO] Waiting for PostgreSQL..."
    while ! PGPASSWORD="postgres" psql -U postgres -h localhost -c '\l' >/dev/null 2>&1; do
        echo "Waiting for PostgreSQL to start..."
        sleep 1
    done
}

# Check if Git is installed
if ! command -v git &>/dev/null; then
    echo "[INFO] Installing Git..."
    apt-get update
    apt-get install -y git || error_exit "Failed to install Git."
fi

# Install Docker if not installed
if ! command -v docker &>/dev/null; then
    echo "[INFO] Docker not found. Installing Docker..."
    # Install dependencies
    apt-get update
    apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release || error_exit "Failed to install Docker dependencies."

    # Add Docker's official GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # Set up the repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker Engine
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin || error_exit "Failed to install Docker."

    # Start Docker service
    systemctl start docker || error_exit "Failed to start Docker service."
    systemctl enable docker || error_exit "Failed to enable Docker service."
fi

# Check if Docker is running
if ! docker info &>/dev/null; then
    systemctl start docker || error_exit "Failed to start Docker service."
fi

# Check if Docker Compose is installed
if ! command -v docker compose &>/dev/null; then
    error_exit "Docker Compose is not available. Please check Docker installation."
fi

# Install standalone docker-compose for compatibility
if ! command -v docker-compose &>/dev/null; then
    echo "[INFO] Installing standalone docker-compose for compatibility..."
    curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose || error_exit "Failed to set permissions on docker-compose."
fi

# Install and configure Nginx
if ! command -v nginx &>/dev/null; then
    echo "[INFO] Installing Nginx..."
    apt-get update
    apt-get install -y nginx || error_exit "Failed to install Nginx."
fi

# Configure Nginx to run as root user
echo "[INFO] Configuring Nginx user..."
sed -i 's/user www-data/user root/' /etc/nginx/nginx.conf

# Create Nginx configuration
echo "[INFO] Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOL'
server {
    listen 80;
    listen [::]:80;
    server_name stellarcare.nsitapara.com;

    # Next.js frontend and its API routes
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin and backend API
    location ~ ^/(admin|backend/api) {
        rewrite ^/backend/(.*) /$1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django static files
    location /static/ {
        alias /root/stellarcare/backend/staticfiles/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        gzip_static on;
        gzip_types
            text/css
            text/javascript
            application/javascript
            application/x-javascript;
    }

    # Django media files
    location /media/ {
        alias /root/stellarcare/backend/mediafiles/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header X-Content-Type-Options nosniff;
        gzip_static on;
    }
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t || error_exit "Nginx configuration test failed"

# Install certbot for SSL
if ! command -v certbot &>/dev/null; then
    echo "[INFO] Installing Certbot..."
    apt-get install -y certbot python3-certbot-nginx || error_exit "Failed to install Certbot."
fi

# Obtain SSL certificate
echo "[INFO] Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect || error_exit "Failed to obtain SSL certificate."

# Clone the repository
if [ -d "$CLONE_DIR" ]; then
    echo "[INFO] Removing existing repository..."
    rm -rf "$CLONE_DIR" || error_exit "Failed to remove existing repository."
fi

echo "[INFO] Cloning the repository..."
git clone "$REPO_URL" "$CLONE_DIR" || error_exit "Failed to clone the repository."
cd "$CLONE_DIR" || error_exit "Failed to navigate to the repository directory."

# Copy environment files
echo "[INFO] Setting up environment files..."
PARENT_DIR="$(cd .. && pwd)"

# Copy environment files from parent directory
echo "[INFO] Copying environment files from $PARENT_DIR..."
cp "$PARENT_DIR/.env.backend" ".env.backend" || error_exit "Failed to copy .env.backend"
cp "$PARENT_DIR/.env.frontend" ".env.frontend" || error_exit "Failed to copy .env.frontend"

# Create static and media directories
echo "[INFO] Creating static and media directories..."
mkdir -p backend/staticfiles backend/mediafiles
chown -R root:root backend/staticfiles backend/mediafiles
chmod -R 755 backend/staticfiles backend/mediafiles

# Modify docker-compose.yaml for production
echo "[INFO] Updating docker-compose.yaml for production..."
sed -i 's/command: bash -c "pnpm install -r && if.*$/command: bash -c "pnpm install -r \&\& pnpm build \&\& pnpm start"/' docker-compose.yaml
sed -i 's/BUILD_ENV=development/BUILD_ENV=production/' docker-compose.yaml

# Run Docker Compose
echo "[INFO] Starting Docker Compose..."
# Stop and remove existing containers
docker-compose down --volumes --remove-orphans || true

# Start services with setup profile
echo "[INFO] Running setup profile..."
docker-compose --profile setup up -d

# Wait for setup to complete
echo "[INFO] Waiting for setup to complete..."
while docker-compose ps setup | grep -q "running"; do
    echo "Setup still running..."
    sleep 5
done

# Start regular services
echo "[INFO] Starting regular services..."
docker-compose up -d

# Wait for containers to be ready
echo "[INFO] Waiting for containers to be ready..."
attempt=1
max_attempts=30
until docker-compose ps | grep api | grep -q "Up" || [ $attempt -gt $max_attempts ]; do
    echo "Waiting for containers to be ready... (Attempt $attempt/$max_attempts)"
    sleep 5
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    error_exit "Containers failed to start after $max_attempts attempts"
fi

# Additional wait to ensure Django is fully initialized
sleep 10

# Collect static files
echo "[INFO] Collecting static files..."
if docker-compose ps | grep -q "api.*Up"; then
    docker-compose exec -T api bash -c "
        uv sync && \
        rm -rf /app/staticfiles/* && \
        uv run -- python -m compileall . && \
        uv run -- python manage.py collectstatic --noinput -v 2 && \
        uv run -- python manage.py collectstatic --noinput -v 2 --clear
    " || error_exit "Failed to collect static files."
else
    error_exit "API container is not running"
fi

# Fix permissions after collecting static files
echo "[INFO] Fixing static files permissions..."
chown -R root:root backend/staticfiles backend/mediafiles
chmod -R 755 backend/staticfiles backend/mediafiles
find backend/staticfiles/ -type f -exec chmod 644 {} \;

# Restart Nginx to apply changes
echo "[INFO] Restarting Nginx..."
systemctl restart nginx || error_exit "Failed to restart Nginx."

echo "[SUCCESS] Project deployed successfully!"
echo "Backend running on: https://$DOMAIN/api"
echo "Frontend running on: https://$DOMAIN"
echo "Admin interface: https://$DOMAIN/admin"
echo "Default admin credentials: admin/change-me-in-production"
echo "Please change the admin password and update database credentials in production!"
