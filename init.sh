#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'
sudo apt install git
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install --lts
nvm use --lts
npm i -g yarn
git clone https://github.com/lerichardson/injest.git
cd injest
yarn
read -p "Would you like to create an apiKey for this project? (recommended for public usage) [y/n] " apiKeyYN
if [[ $apiKeyYN == "y" ]];
then
    RAND=$(openssl rand -hex 32);
    printf "\nAPIKEY=$RAND" >> .env;
    printf "Your apiKey is ${RED}${RAND}${NC}\n";
    printf "Please make sure that you have saved this and it will also have to be included with any request to the /upload endpoint. Read more at https://github.com/lerichardson/injest/wiki/apiKey.\n"
fi
tsc
