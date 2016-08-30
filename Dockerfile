FROM node:argon

# Create app directory
RUN mkdir /src
WORKDIR /src

# Install app dependencies
COPY package.json /src
RUN npm install
CMD ["npm", "install", "-g", "pm2"]

# Bundle app source
ADD . /src/

CMD [ "npm", "start" ]
