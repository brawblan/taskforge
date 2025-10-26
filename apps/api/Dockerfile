FROM node:lts-alpine3.17

WORKDIR /

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm run db:push && npm run start:dev"]