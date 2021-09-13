#!/bin/sh

npm run-script ${1:-build}

cp dist/keyholder-angular/* /var/www/html

nginx -g "daemon off;"
