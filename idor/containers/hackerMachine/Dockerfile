# Dockerfile

FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Command to run the exploit script
CMD ["node", "exploit.js"]
