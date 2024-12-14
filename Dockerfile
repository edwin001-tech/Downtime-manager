# Use an official Node.js image to build the React app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code and build the React app
COPY . .
RUN npm run build

# Use an Nginx image to serve the built files
FROM nginx:alpine

# Copy the build output from the previous step to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the backend port (if your Express app runs on port 5000)
EXPOSE 8000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

