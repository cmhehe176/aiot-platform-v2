FROM node:20.17.0-alpine AS base

WORKDIR /app

RUN set -eux; \
	apk add --update --no-cache git build-base; \
	corepack enable

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN cp .env.example .env

RUN yarn build

# ======================= Production ===============================

FROM node:20.17.0-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=base /app/dist /app/dist

CMD [ "serve", "-s" , "dist" ]