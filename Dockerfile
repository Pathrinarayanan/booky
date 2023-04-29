FROM node:alpine
COPY . /app

WORKDIR /app
COPY . /app/static-files/

CMD node demo.js