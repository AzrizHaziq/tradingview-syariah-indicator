FROM ubuntu:18.04

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    build-essential \
    apt-utils \
    git \
    curl

RUN apt-get -y install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.0/install.sh | bash

RUN /bin/bash -c "source ~/.nvm/nvm.sh && nvm install 15.3.0 && nvm alias default 15.3.0 && node -v && npm -v && npm ci"

COPY . .

CMD ["npm", "run", "ghAction:update-data"]
