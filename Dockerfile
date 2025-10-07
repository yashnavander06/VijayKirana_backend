# Use Node.js base image
FROM node:18.18.0

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 4000

# Start the server
CMD ["npm", "start"]