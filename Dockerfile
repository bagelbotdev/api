FROM docker.io/node:16
WORKDIR /app

COPY package.json /app/package.json
COPY node_modules/ /app/node_modules
COPY dist/ /app/dist


CMD ["node", "dist/src/index.js"]
