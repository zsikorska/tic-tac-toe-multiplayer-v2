FROM node:alpine

WORKDIR /app

COPY node-server/package*.json .

RUN npm install

COPY node-server/ .

ARG FRONTEND_URL
ARG COGNITO_USER_POOL_ID
ARG COGNITO_CLIENT_ID

RUN echo "FRONTEND_URL=$FRONTEND_URL" > .env
RUN echo "COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID" >> .env
RUN echo "COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID" >> .env

EXPOSE 3000

CMD ["node", "server.js"]
