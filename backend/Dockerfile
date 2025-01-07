FROM python:3.13-slim-bookworm

ENV PYTHONUNBUFFERED=1
ENV UV_PROJECT_ENVIRONMENT=/.venv

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN pip install uv && \
    uv venv && \
    uv sync

# Copy the rest of the application
COPY . .

EXPOSE 8080

CMD ["uv", "run", "--", "python", "manage.py", "runserver", "0.0.0.0:8080"]
