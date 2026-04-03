MIGRATION = api/migrations/0001_initial.py

up: db.sqlite3
	python manage.py runserver

test: db.sqlite3
	python manage.py runscript create_test_data

db.sqlite3: $(MIGRATION)
	python manage.py migrate

$(MIGRATION):
	python manage.py makemigrations

clean:
	$(RM) db.sqlite3 $(MIGRATION)

.PHONY: clean
