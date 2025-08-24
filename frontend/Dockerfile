FROM node:21-bullseye

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY . ./

RUN pnpm install

EXPOSE 3001

CMD [ "pnpm", "run", "dev" ]