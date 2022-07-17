FROM docker.io/node:16
WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY tsconfig.json /app/tsconfig.json

COPY ./src /app/src
COPY ./gql /app/gql
COPY ./@types /app/@types

CMD ["npm", "start"]
