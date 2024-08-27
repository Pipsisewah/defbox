# Dockerfile

# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install Mocha globally (not recommended, but an option)
RUN npm install -g mocha

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Run mocha directly (since it's globally installed)
CMD ["mocha", "test/ac.test.js"]
