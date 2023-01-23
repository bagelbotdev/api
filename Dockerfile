FROM docker.io/node:16
WORKDIR /app

COPY package.json /app/package.json
RUN yarn --frozen-lockfile

COPY . /app/
CMD ["yarn", "start"]