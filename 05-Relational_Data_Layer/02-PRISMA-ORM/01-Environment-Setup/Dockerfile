# Use the official Node.js image as a base
FROM node:24-alpine

# SET the working directory inside the container
WORKDIR /app

# If package.json does not exist, create it with npm init -y
RUN if [ ! -f package.json ]; then npm init -y; fi

# Install dependencies if packge.json exists or was created
RUN npm install express prisma @prisma/client

