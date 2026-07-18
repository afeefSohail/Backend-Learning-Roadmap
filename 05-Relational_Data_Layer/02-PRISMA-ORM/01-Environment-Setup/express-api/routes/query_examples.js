const express = require("express");
const router = express.Router();
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the
// internal connection engine has been removed — you must pass an adapter, with no fallback.
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient, Prisma } = require("@prisma/client");
const { splitWhere } = require("effect/Chunk");

// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({ adapter });

const productSelectTemplate = {
  id: true,
  name: true,
  price: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  // Add any other related models you might want to include
};

// Endpoint to retrieve all products using findMany()
router.get("/api/products", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    const products = await prisma.product.findMany({});

    return res.json(products); // Send the retrieved products as a JSON response
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving products" });
  }
});

// Endpoint to retrieve all products using findMany()
router.get("/api/products/detail", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    const productSelectForList = {
      ...productSelectTemplate,
      description: false, // Exclude description
      createdAt: false, // Exclude createdAt
      updatedAt: false, // Exclude updatedAt
      category: false, // Exclude category
    };

    const products = await prisma.product.findMany({
      // select: {
      //   id: true,
      //   name: true,
      //   price: true,
      // },
      select: productSelectForList,
    });

    return res.json(products); // Send the retrieved products as a JSON response
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving products" });
  }
});

// Endpoint to retrieve active products
router.get("/api/products/active", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    // Retrieve active products from the database
    const activeProducts = await prisma.product.findMany({
      where: {
        isActive: true, // Filtering products where 'isActive' is true
        categoryId: 1,
      },
    });

    // Send the active products as a JSON response
    return res.json(activeProducts);
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving active products",
    });
  }
});

// Endpoint to retrieve products with dynamic query parameters
router.get("/api/products/filter/qp/", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    // Get dynamic query parameters from the request
    const { isActive, categoryId } = req.query;

    const whereConditions = {};
    if (categoryId !== undefined)
      whereConditions.categoryId = parseInt(categoryId);
    if (isActive !== undefined) whereConditions.isActive = isActive === "true";

    const products = await prisma.product.findMany({
      where: whereConditions,
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Endpoint to retrieve products with dynamic path parameters
router.get(
  "/api/products/filter/pp/:isActive/:categoryId",
  async (req, res) => {
    // #swagger.tags = ['Query Examples']
    try {
      // Get dynamic path parameters from the request
      const { isActive, categoryId } = req.params;

      const whereConditions = {};

      // Convert categoryId to integer if it's provided in the URL
      if (categoryId !== undefined) {
        whereConditions.categoryId = parseInt(categoryId, 10); // Convert to integer
      }

      // Convert isActive from string ('true' or 'false') to boolean
      if (isActive !== undefined) {
        whereConditions.isActive = isActive === "true"; // 'true' to true, else false
      }

      // Query the database using Prisma to retrieve products based on conditions
      const products = await prisma.product.findMany({
        where: whereConditions,
      });

      return res.json(products); // Return the filtered products as a JSON response
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Something went wrong while retrieving products" });
    }
  },
);

// Endpoint to retrieve products with dynamic filters using request body
router.post("/api/products/filter/rb", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    // Get dynamic filters from the request body
    const { isActive, categoryId, priceMin, priceMax } = req.body;

    const whereConditions = {};

    // Convert categoryId to integer if provided
    if (categoryId !== undefined) {
      whereConditions.categoryId = parseInt(categoryId, 10); // Convert to integer
    }

    // Convert isActive from string ('true'/'false') to boolean if provided
    if (isActive !== undefined) {
      whereConditions.isActive = isActive === "true"; // Convert 'true' to boolean true
    }

    // Add price filters if provided
    if (priceMin !== undefined) {
      whereConditions.price = { gte: new Prisma.Decimal(priceMin) }; // Price greater than or equal to priceMin
    }
    if (priceMax !== undefined) {
      if (whereConditions.price) {
        whereConditions.price.lte = new Prisma.Decimal(priceMax); // Price less than or equal to priceMax
      } else {
        whereConditions.price = { lte: new Prisma.Decimal(priceMax) };
      }
    }

    // Query the database with the dynamic filters
    const products = await prisma.product.findMany({
      where: whereConditions,
    });

    return res.json(products); // Return the filtered products
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving products",
      details: error.message, // Return the specific error message
      stack: error.stack, // Return the stack trace for debugging (optional)
    });
  }
});

// Endpoint with Order by
router.get("/api/products/active/orderby", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    // Retrieve active products from the database
    const activeProducts = await prisma.product.findMany({
      where: {
        isActive: true, // Filtering products where 'isActive' is true
        categoryId: 1,
      },
      orderBy: [
        { categoryId: "asc" }, // First, sort by name in ascending order
        { price: "desc" }, // Then, sort by price in descending order
      ],
    });

    // Send the active products as a JSON response
    return res.json(activeProducts);
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving active products",
    });
  }
});

// Endpoint most expensive product
router.get("/api/products/price", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    const products = await prisma.product.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "desc",
      },
    });

    return res.json(products); // Send the retrieved products as a JSON response
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving products" });
  }
});

// Endpoint to retrieve products with pagination
router.get("/api/products/pagination", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    const { page = 1, pageSize = 10 } = req.query; // Default to page 1, and 10 items per page

    const pageNumber = parseInt(page); // Convert to integer
    const pageSizeNumber = parseInt(pageSize); // Convert to integer

    // Calculate skip and take based on page and pageSize
    const skip = (pageNumber - 1) * pageSizeNumber; // Skip previous pages (OFFSet)
    const take = pageSizeNumber; // Number of records to fetch

    // Query the database to fetch products with pagination
    const products = await prisma.product.findMany({
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc", // Sort products by createdAt, newest first (you can change this to another field)
      },
    });

    // Fetch the total count of products (to calculate total pages)
    const totalProducts = await prisma.product.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / pageSizeNumber);

    return res.json({
      products, // The products retrieved for the current page
      totalProducts, // Total count of products
      totalPages, // Total number of pages
      currentPage: pageNumber, // Current page
      pageSize: pageSizeNumber, // Number of products per page
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving products.",
      details: error.message,
    });
  }
});

// Endpoint to retrieve distinct categories connected to products
router.get("/api/categories/linked-to-products", async (req, res) => {
  // #swagger.tags = ['Query Examples']
  try {
    // Retrieve distinct categoryIds from the products table
    const distinctCategoryIds = await prisma.product.findMany({
      distinct: ["categoryId"], // same category Ids cant repeat
      select: {
        categoryId: true, // Only select categoryId field
      },
    });

    // Extract unique categoryIds
    const uniqueCategoryIds = distinctCategoryIds.map(
      (item) => item.categoryId,
    );

    return res.json({
      uniqueCategoryIds, // The products retrieved for the current page
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
