import glob
import os

MIGRATIONS = glob.glob('api/migrations/0*.py')

for f in MIGRATIONS:
    os.remove(f)

os.system('python manage.py makemigrations')
os.system('python manage.py migrate')
os.system('python manage.py runscript create_test_data')
os.system('python manage.py runserver')
