FROM node:18-alpine
LABEL authors="hzky" \
version="1.0.0"

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npx", "ts-node", "src/index.ts"]