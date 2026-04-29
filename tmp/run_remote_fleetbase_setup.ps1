$ssh = "C:\Program Files\PuTTY\plink.exe"
$sshHost = "root@162.0.231.57"
$pw = "c4tFSpg6OE9jb489QV"
$hostKey = "ssh-ed25519 255 SHA256:hSAXUk4Ooz+qVvJwApWRTQep00EI2HA1Xyw7EaSeri4"

$remote = @'
set -euo pipefail

cd /srv/fleetbase/api

cp -n .env.example .env

mysql -uroot -e "CREATE DATABASE IF NOT EXISTS fleetbase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

sed -i 's|^APP_NAME=.*|APP_NAME=Fleetbase|' .env
sed -i 's|^APP_ENV=.*|APP_ENV=production|' .env
sed -i 's|^APP_DEBUG=.*|APP_DEBUG=false|' .env
sed -i 's|^APP_URL=.*|APP_URL=http://162.0.231.57:8000|' .env
sed -i 's|^DB_HOST=.*|DB_HOST=localhost|' .env
sed -i 's|^DB_PORT=.*|DB_PORT=3306|' .env
sed -i 's|^DB_DATABASE=.*|DB_DATABASE=fleetbase|' .env
sed -i 's|^DB_USERNAME=.*|DB_USERNAME=root|' .env
sed -i 's|^DB_PASSWORD=.*|DB_PASSWORD=|' .env
sed -i 's|^CACHE_DRIVER=.*|CACHE_DRIVER=redis|' .env
sed -i 's|^QUEUE_CONNECTION=.*|QUEUE_CONNECTION=redis|' .env
sed -i 's|^SESSION_DRIVER=.*|SESSION_DRIVER=redis|' .env
sed -i 's|^REDIS_HOST=.*|REDIS_HOST=127.0.0.1|' .env
sed -i 's|^REDIS_PORT=.*|REDIS_PORT=6379|' .env

echo "remote setup complete"
'@

$remote = $remote -replace "`r`n", "`n"
$remote | & $ssh -ssh $sshHost -pw $pw -hostkey $hostKey -batch "bash -s"
