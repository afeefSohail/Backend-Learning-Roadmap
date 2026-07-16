const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "ExpressJS Prisma ORM Fundamentals",
    description: "Auto-generated Swagger documentation",
  },
  host: "localhost:3000", // Change if using a different port or domain
  schemes: ["http"],
  // Optional: Define the structural order and descriptions of your sections
  tags: [
    {
      name: "Category Section",
      description:
        "Endpoints relating to e-commerce category trees and bulk deletions.",
    },
    {
      name: "Product Section",
      description:
        "Endpoints managing inventory products, pricing data, and stock counts.",
    },
  ],
};

const outputFile = "./swagger-output.json"; // Where to save the documentation
const endpointsFiles = ["./routes/*.js"]; // Files containing API routes

swaggerAutogen(outputFile, endpointsFiles, doc);
