FROM node:12.10.0

COPY index.js package.json package-lock.json ./

RUN npm ci

CMD ["nodejs", "index.js"]
