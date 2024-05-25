FROM node:alpine

ENV PORT 80

WORKDIR /app

COPY client/package*.json .

RUN npm install

COPY client/ .

ARG BACKEND_URL

RUN echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > .env.local

EXPOSE 80

CMD ["npm", "start"]
