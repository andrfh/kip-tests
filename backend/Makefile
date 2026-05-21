MIGRATION = api/migrations/0001_initial.py

up: migrate
	python manage.py runserver

test: migrate
	python manage.py runscript create_test_data

migrate: $(MIGRATION)
	python manage.py migrate

$(MIGRATION):
	python manage.py makemigrations

clean:
	$(RM) $(MIGRATION)

.PHONY: clean migrate
