docker compose down
docker-compose down --volumes
docker-compose down --rmi all --volumes
docker volume rm stellarcare_postgres_data
# docker system prune
docker compose up --build -d
