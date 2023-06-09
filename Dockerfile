# Stage 0, based on Node.js, to build and compile Angular
FROM node:16 as node

WORKDIR /code
COPY /package.json /code/
COPY /package-lock.json /code/

RUN npm install

# npm not appreciating our package file and will not run audit
# TODO: fix package files so audit works
# RUN npm audit fix

COPY / /code/

RUN npm run-script build
RUN cp -r dist/ innovate_dist/

RUN npm run-script build:snoq



# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY /template.nginx /etc/nginx/conf.d/snoqualmie.template
COPY --from=node /code/innovate_dist/ /usr/share/nginx/html/innovate
COPY --from=node /code/dist/ /usr/share/nginx/html/snoqualmie
