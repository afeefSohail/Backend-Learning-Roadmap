const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "User Auth API",
    description: "Auto-generated Swagger documentation for phone/email auth, user profiles, and photo uploads.",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    {
      name: "Auth",
      description: "Register, login, and token issuance endpoints.",
    },
    {
      name: "User",
      description: "User profile retrieval and editing.",
    },
    {
      name: "Photos",
      description: "Upload, list, and delete user photos.",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
      description: "Enter your JWT as: Bearer <token>",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/*.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);