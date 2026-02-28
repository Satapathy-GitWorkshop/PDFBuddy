FROM node:20-alpine
RUN apk add --no-cache libreoffice ghostscript
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p uploads outputs
EXPOSE 5000
CMD ["node", "server.js"]
