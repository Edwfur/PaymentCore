FROM node:21.1.0
ENV TZ="Europe/Moscow"
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --network-timeout 100000

COPY . .

RUN yarn build
CMD ["yarn", "start"]
