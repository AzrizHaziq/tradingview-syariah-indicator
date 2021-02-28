FROM node:15.3.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    apt-utils \
    build-essential \
    git \
    curl

RUN apt-get -y install \
 ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0    \
 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0       \
 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1   \
 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
 libxss1 libxtst6 lsb-release wget xdg-utils

RUN npm ci

COPY . .

ENTRYPOINT PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm run ghAction:update-data

# docker build -t tsi .
# docker run -it  \
# -v $PWD/contents/:/usr/src/app/contents \
# -v $PWD/stock-list.json/:/usr/src/app/stock-list.json \
# tsi
# docker exec -it tsi /bin/bash
