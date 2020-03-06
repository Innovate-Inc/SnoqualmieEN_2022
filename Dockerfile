# Stage 0, based on Node.js, to build and compile Angular
FROM node:lts-alpine as node

WORKDIR /code
COPY /package.json /code/

RUN npm install
RUN npm audit fix

COPY / /code/

RUN npm run-script build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY /template.nginx /etc/nginx/conf.d/snoqualmie.template
COPY --from=node /code/dist/ /usr/share/nginx/html/
