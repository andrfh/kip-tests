FROM python:3.12-slim

# Отключить буферизацию stdout/stderr для корректного логирования
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Системные зависимости для psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Зависимости Python — отдельный слой для кэша Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Исходный код приложения
COPY ./api/ ./api/
COPY ./tickets/ ./tickets/
COPY manage.py .

# Пользователь без root-привилегий
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Gunicorn — production WSGI сервер
EXPOSE 8000
CMD ["gunicorn", "tickets.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--timeout", "30", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]