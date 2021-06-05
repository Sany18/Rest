FROM node:12-alpine

WORKDIR /app
COPY . /app
RUN npm i
RUN npm i -g serve
RUN npm run build

CMD [ "serve", "-s", "build" ]
