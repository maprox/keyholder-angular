FROM node:latest

MAINTAINER Alexander Y Lyapko box@sunsay.ru

RUN apt-get update && \
    apt-get -y install nginx

RUN mkdir -p /opt/keyholder
COPY . /opt/keyholder
WORKDIR /opt/keyholder

RUN npm install

CMD ["./start-script.sh"]

EXPOSE 80