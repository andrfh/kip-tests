from python:alpine

env PYTHONDONTWRITEBYTECODE=1
env PYTHONUNBUFFERED=1

ENV PRODUCTION=1

workdir /app

copy ./api/ ./api
copy ./tickets/ ./tickets
copy ./manage.py ./requirements.txt .

run pip install -r ./requirements.txt

cmd ["python", "manage.py", "runserver", "0.0.0.0:8000"]
