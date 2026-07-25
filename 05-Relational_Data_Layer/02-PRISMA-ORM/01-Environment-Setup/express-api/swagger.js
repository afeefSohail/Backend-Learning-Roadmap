const { description } = require("valibot");

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
      name: "Data Relational Operation Section",
      description:
        "Endpoints relating to Data Relational Operations.",
    },
    {
      name: "Query Examples",
      description:
        "Endpoints Examples of Diff Prisma Queries.",
    },
    {
      name: "Filtering Examples",
      description:
        "Endpoints Examples of Diff Prisma Filtering.",
    },
    {
      name: "Join Queries",
      description:
        "Endpoints Examples of Diff Prisma Filtering.",
    },
    {
      name: "Aggregation Grouping Section",
      description: "Apply SQL Aggregation Functions"
    }
  ],
};

const outputFile = "./swagger-output.json"; // Where to save the documentation
const endpointsFiles = ["./routes/*.js"]; // Files containing API routes

swaggerAutogen(outputFile, endpointsFiles, doc);
