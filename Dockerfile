# Use an official Node.js Alpine image as a parent image
FROM node:20-alpine

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g pnpm
# RUN npm install -g nodemon

# Copy package.json and package-lock.json to the working directory
COPY pnpm-lock.yaml package.json ./
# COPY package*.json ./

# Install any needed packages specified in package.json
RUN rm -rf ./node_modules
RUN pnpm install


# Copy the server directory into the container at /usr/src/app/server
COPY . .

RUN npx prisma generate


# Expose the port that your Node.js server listens on
EXPOSE 9230
EXPOSE 3000

# Run the server when the container launches
CMD ["pnpm", "dev"]
