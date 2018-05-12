FROM node:latest

MAINTAINER Alexander Y Lyapko box@sunsay.ru

RUN apt-get update && \
    apt-get -y install nginx

RUN mkdir -p /opt/keyholder
COPY . /opt/keyholder
WORKDIR /opt/keyholder

RUN npm install && \
    npm run-script build

RUN cp dist/keyholder-angular/* /var/www/html && \
    cp nginx-default.conf /etc/nginx/sites-enabled/default

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80