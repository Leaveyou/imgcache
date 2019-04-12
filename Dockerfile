FROM node:8-slim
ENV NPM_CONFIG_LOGLEVEL info
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]