# Use the official Node.js image from the Docker Hub
FROM node:20-alpine3.19

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files into the container
COPY . .

# Build the project
RUN npm run build

# Expose port 3000 and start the application
EXPOSE 3000
CMD ["node", "dist/main"]
