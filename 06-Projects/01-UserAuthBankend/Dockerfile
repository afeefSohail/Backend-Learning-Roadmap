FROM node:24-alpine

WORKDIR /app

RUN if [ ! -f package.json ]; then npm init -y; fi

# TypeScript tooling — tsx compiles + runs .ts directly, with watch mode replacing nodemon
RUN npm install -D typescript tsx @types/node

# Core server
RUN npm install express dotenv
RUN npm install -D @types/express

# Prisma + Postgres driver adapter (Prisma 7 requires this)
RUN npm install -D prisma
RUN npm install @prisma/client @prisma/adapter-pg pg

# Auth: password hashing + JWT (bcryptjs avoids native-compile issues on Alpine)
RUN npm install bcryptjs jsonwebtoken
RUN npm install -D @types/jsonwebtoken @types/bcryptjs

# Validation
RUN npm install zod

# File uploads
RUN npm install multer
RUN npm install -D @types/multer

# API docs
RUN npm install swagger-jsdoc swagger-ui-express swagger-autogen
RUN npm install -D @types/swagger-jsdoc @types/swagger-ui-express