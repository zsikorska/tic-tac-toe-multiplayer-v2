FROM node:alpine

ENV PORT 80

WORKDIR /app

COPY client/package*.json .

RUN npm install

COPY client/ .

ARG BACKEND_URL
ARG COGNITO_URL
ARG COGNITO_USER_POOL_ID
ARG COGNITO_CLIENT_ID
ARG COGNITO_TOKEN_URL
ARG COGNITO_REDIRECT_URL

RUN echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > .env.local
RUN echo "REACT_APP_COGNITO_URL=$COGNITO_URL" >> .env.local
RUN echo "REACT_APP_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID" >> .env.local
RUN echo "REACT_APP_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID" >> .env.local
RUN echo "REACT_APP_COGNITO_TOKEN_URL=$COGNITO_TOKEN_URL" >> .env.local
RUN echo "REACT_APP_COGNITO_REDIRECT_URL=$COGNITO_REDIRECT_URL" >> .env.local

EXPOSE 80

CMD ["npm", "start"]
