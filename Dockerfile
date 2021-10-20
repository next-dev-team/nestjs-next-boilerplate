FROM node:16-alpine3.11 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN yarn install

COPY . .

RUN yarn build

########################
### Production #########
########################

FROM node:16-alpine3.11 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]