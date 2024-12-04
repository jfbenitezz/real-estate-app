# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the React app using a lightweight web server
FROM nginx:alpine

# Copy the custom nginx.conf file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build files from the build step
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port that Nginx will listen on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
