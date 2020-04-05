FROM node:10.15-alpine

WORKDIR /app
COPY package.json ./
RUN yarn install

COPY tsconfig.json tslint.json ./
COPY src src/
RUN yarn build
COPY dist dist/

WORKDIR /app/dist
EXPOSE 8080
EXPOSE 8443
CMD ["node", "./index.js"]
