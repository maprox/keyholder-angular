# Explicitly set note 12, since on node:latest (14) it fails
# with "EPERM: operation not permitted, copyfile" error,
# because of an outdated docker version we use on our server,
# see https://support.circleci.com/hc/en-us/articles/360050934711
FROM node:12

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
