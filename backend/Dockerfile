# Use an official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port (use environment variable via docker-compose)
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]
