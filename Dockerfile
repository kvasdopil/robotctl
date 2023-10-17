FROM node:20-alpine

WORKDIR /app/

COPY package.* /app/

RUN npm i --omit=dev

COPY index.js /app/
COPY public /app/public

CMD ["node", "/app/index.js"]
