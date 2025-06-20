# Use an official Node.js runtime as the base image
FROM node:lts-slim
# Set the working directory within the container
#WORKDIR ./client:/usr/src/app
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Add environment variable handling
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install app dependencies
RUN npm install
# Copy the entire app to the working directory
COPY . .

# Build the React app
RUN npm run build
# Expose the port on which the app will run
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]