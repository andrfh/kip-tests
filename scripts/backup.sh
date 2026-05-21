#!/bin/bash
# scripts/backup.sh
# Скрипт резервного копирования базы данных PostgreSQL.
# Создаёт зашифрованный дамп БД и сохраняет в директорию backups/.
#
# Использование:
#   ./scripts/backup.sh                  — создать бэкап
#   BACKUP_FILE=... ./scripts/restore.sh — восстановить
#
# Зависимости: pg_dump, openssl, docker-compose

set -euo pipefail  # строгий режим: ошибка — выход

# ── Конфигурация ─────────────────────────────────────────────────────────────

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/kip_tests_${TIMESTAMP}.sql"
ENCRYPTED_FILE="${BACKUP_FILE}.enc"
RETENTION_DAYS=30  # хранить бэкапы N дней

# Ключ шифрования — должен быть в .env или передан как переменная окружения
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"

# ── Проверки ─────────────────────────────────────────────────────────────────

if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
    echo "ERROR: BACKUP_ENCRYPTION_KEY не задан."
    echo "Добавьте в .env: BACKUP_ENCRYPTION_KEY=ваш-секретный-ключ"
    exit 1
fi

mkdir -p "$BACKUP_DIR"

# ── Создать дамп ─────────────────────────────────────────────────────────────

echo "[$(date)] Начало резервного копирования..."

# Используем docker-compose exec для подключения к контейнеру PostgreSQL
docker-compose exec -T db pg_dump \
    -U "${POSTGRES_USER:-kip_user}" \
    -d "${POSTGRES_DB:-kip_tests}" \
    --no-password \
    --format=custom \
    --compress=9 \
    > "$BACKUP_FILE"

echo "[$(date)] Дамп создан: ${BACKUP_FILE} ($(du -h "$BACKUP_FILE" | cut -f1))"

# ── Шифрование ───────────────────────────────────────────────────────────────

openssl enc -aes-256-cbc -pbkdf2 -iter 100000 \
    -in "$BACKUP_FILE" \
    -out "$ENCRYPTED_FILE" \
    -pass pass:"$BACKUP_ENCRYPTION_KEY"

# Удалить незашифрованный дамп
rm "$BACKUP_FILE"

echo "[$(date)] Зашифровано: ${ENCRYPTED_FILE} ($(du -h "$ENCRYPTED_FILE" | cut -f1))"

# ── Ротация старых бэкапов ───────────────────────────────────────────────────

echo "[$(date)] Удаление бэкапов старше ${RETENTION_DAYS} дней..."
find "$BACKUP_DIR" -name "*.enc" -mtime "+${RETENTION_DAYS}" -delete

echo "[$(date)] Резервное копирование завершено успешно."
echo "Файл: ${ENCRYPTED_FILE}"