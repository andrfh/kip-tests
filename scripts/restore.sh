#!/bin/bash
# scripts/restore.sh
# Восстановление базы данных из зашифрованного бэкапа.
#
# Использование:
#   BACKUP_FILE=backups/kip_tests_20240101_120000.sql.enc ./scripts/restore.sh

set -euo pipefail

BACKUP_FILE="${BACKUP_FILE:-}"
BACKUP_ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"
TEMP_FILE="/tmp/kip_restore_$$.sql"

# ── Проверки ─────────────────────────────────────────────────────────────────

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: укажите BACKUP_FILE=путь/к/файлу.enc"
    exit 1
fi

if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
    echo "ERROR: BACKUP_ENCRYPTION_KEY не задан."
    exit 1
fi

echo "ВНИМАНИЕ: Это действие заменит текущую базу данных!"
read -r -p "Продолжить? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Отменено."
    exit 0
fi

# ── Расшифровать ─────────────────────────────────────────────────────────────

echo "[$(date)] Расшифровка..."
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
    -in "$BACKUP_FILE" \
    -out "$TEMP_FILE" \
    -pass pass:"$BACKUP_ENCRYPTION_KEY"

# ── Восстановить ─────────────────────────────────────────────────────────────

echo "[$(date)] Восстановление базы данных..."
docker-compose exec -T db pg_restore \
    -U "${POSTGRES_USER:-kip_user}" \
    -d "${POSTGRES_DB:-kip_tests}" \
    --no-password \
    --clean \
    --if-exists \
    < "$TEMP_FILE"

rm "$TEMP_FILE"

echo "[$(date)] Восстановление завершено."