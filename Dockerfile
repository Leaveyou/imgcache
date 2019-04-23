FROM node:10-stretch
ENV NPM_CONFIG_LOGLEVEL info
WORKDIR /var/www/imgcache
COPY package*.json ./
RUN npm install
COPY . .
RUN apt-get update
RUN apt install -y graphicsmagick
RUN npm run tsc
EXPOSE 80
CMD [ "npm", "start" ]