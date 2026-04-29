#!/usr/bin/env bash
set -euo pipefail

cd /srv/fleetbase/api

cp -n .env.example .env

mysql -uroot -e "CREATE DATABASE IF NOT EXISTS fleetbase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'fleetbase'@'localhost' IDENTIFIED BY 'FleetbaseDB#2026!'; GRANT ALL PRIVILEGES ON fleetbase.* TO 'fleetbase'@'localhost'; FLUSH PRIVILEGES;"

sed -i 's|^APP_NAME=.*|APP_NAME=Fleetbase|' .env
sed -i 's|^APP_ENV=.*|APP_ENV=production|' .env
sed -i 's|^APP_DEBUG=.*|APP_DEBUG=false|' .env
sed -i 's|^APP_URL=.*|APP_URL=http://162.0.231.57:8000|' .env
sed -i 's|^DB_HOST=.*|DB_HOST=127.0.0.1|' .env
sed -i 's|^DB_PORT=.*|DB_PORT=3306|' .env
sed -i 's|^DB_DATABASE=.*|DB_DATABASE=fleetbase|' .env
sed -i 's|^DB_USERNAME=.*|DB_USERNAME=fleetbase|' .env
sed -i 's|^DB_PASSWORD=.*|DB_PASSWORD=FleetbaseDB#2026!|' .env
sed -i 's|^CACHE_DRIVER=.*|CACHE_DRIVER=redis|' .env
sed -i 's|^QUEUE_CONNECTION=.*|QUEUE_CONNECTION=redis|' .env
sed -i 's|^SESSION_DRIVER=.*|SESSION_DRIVER=redis|' .env
sed -i 's|^REDIS_HOST=.*|REDIS_HOST=127.0.0.1|' .env
sed -i 's|^REDIS_PORT=.*|REDIS_PORT=6379|' .env
sed -i 's|^MIX_PUSHER_APP_KEY=.*|MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"|' .env
sed -i 's|^MIX_PUSHER_APP_CLUSTER=.*|MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"|' .env

grep -E '^(APP_NAME|APP_ENV|APP_DEBUG|APP_URL|DB_HOST|DB_PORT|DB_DATABASE|DB_USERNAME|DB_PASSWORD|CACHE_DRIVER|QUEUE_CONNECTION|SESSION_DRIVER|REDIS_HOST|REDIS_PORT)=' .env
