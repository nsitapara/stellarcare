rm -r data
docker compose exec api uv run -- python manage.py makemigrations
docker compose exec api uv run -- python manage.py migrate
docker compose exec web pnpm generate
