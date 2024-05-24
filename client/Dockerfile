FROM node:alpine

ENV PORT 80

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ARG BACKEND_URL

ENV REACT_APP_BACKEND_URL=$BACKEND_URL

EXPOSE 80

CMD ["npm", "start"]
