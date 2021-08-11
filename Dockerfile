FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY ./src/ ./src/
COPY ./tsconfig.json ./tsconfig.json


RUN npm run build
RUN mkdir ./files
RUN mkdir ./files/to_delete


EXPOSE 3001

CMD [ "node", "./dist/index.js" ]