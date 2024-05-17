# syntax=docker/dockerfile:1

FROM node:18
ENV NODE_EVN=production
WORKDIR /app

COPY . .

RUN npm install -g nodemon
RUN yarn install

EXPOSE 8000:8000

CMD ["yarn", "start"]