FROM node:alpine

WORKDIR /app

COPY node-server/package*.json .

RUN npm install

COPY . .

ARG FRONTEND_URL 

RUN echo "FRONTEND_URL=$FRONTEND_URL" > .env

EXPOSE 3000

CMD ["node", "server.js"]
