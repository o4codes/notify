FROM node:lts

WORKDIR /app
COPY ./package*.json ./
COPY . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
