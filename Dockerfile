# Node 22 matches Angular 22 local/Docker toolchain (see README).
FROM node:22

MAINTAINER Alexander Y Lyapko box@sunsay.ru

RUN apt-get update && \
    apt-get -y install nginx

# Create and change to the app directory.
WORKDIR /app/

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json /app/

# Install dependencies
RUN npm ci

# Copy local code to the container image.
COPY . /app/

# Configure nginx
COPY nginx-default.conf /etc/nginx/sites-enabled/default

ENTRYPOINT ["sh", "./start-script.sh"]

CMD ["build"]

EXPOSE 80
