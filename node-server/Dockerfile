FROM node:alpine

WORKDIR /app

COPY node-server/package*.json .

RUN npm install

COPY . .

ARG FRONTEND_URL 

ENV FRONTEND_URL=$FRONTEND_URL

EXPOSE 3000

CMD ["node", "server.js"]
