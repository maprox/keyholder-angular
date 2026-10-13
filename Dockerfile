# Build static Angular app, then serve with nginx (no build-at-start).
FROM node:22-bookworm AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/keyholder-angular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
