#!/bin/sh

npm run-script ${1:-build}

cp dist/keyholder-angular/* /var/www/html
cp nginx-default.conf /etc/nginx/sites-enabled/default

nginx -g "daemon off;"