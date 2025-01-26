FROM node:20-alpine3.20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

RUN npm run docs

FROM nginx:stable-alpine AS production

COPY ./nginx /etc/nginx/conf.d

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY --from=build /usr/src/app/docs /usr/share/nginx/html/docs

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
