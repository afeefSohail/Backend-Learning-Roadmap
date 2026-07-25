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


// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({ adapter });

// Example: Using AND Operator
router.get("/api/products/and", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    const { isActive } = req.query;

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: isActive === "true" }, // isActive should be true
          { categoryId: 1 },
        ],
      },
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Example: Using OR Operator
router.get("/api/products/or", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    const { isActive } = req.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { isActive: isActive === "true" }, // Either isActive is true
          { categoryId: 1 }, // Or categoryId matches
        ],
      },
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Example: Using NOT Operator
router.get("/api/products/not", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    const { isActive } = req.query;

    const products = await prisma.product.findMany({
      where: {
        NOT: {
          isActive: isActive === "true", // where isActive is not true in product
        },
      },
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Example: Using AND, OR, and NOT together
router.get("/api/products/complex", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    const { isActive } = req.query;

    const products = await prisma.product.findMany({
      where: {
        AND: [
          { isActive: isActive === "true" },
          {
            OR: [{ categoryId: 1 }, { categoryId: 2 }],
          },
          {
            NOT: {
              name: "iPhone",
            },
          },
        ],
      },
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

// Endpoint to retrieve products with dynamic filters using request body
router.post("/api/products/filters/rb", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    // Get dynamic filters from the request body
    const { categoryId, priceMin, priceMax } = req.body;

    const whereConditions = {};

    whereConditions.isActive = true;

    // Convert categoryId to integer if provided
    if (categoryId !== undefined) {
      whereConditions.categoryId = parseInt(categoryId, 10); // Convert to integer
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
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Endpoint to search for products using pattern matching
router.get("/api/products/search/pattern", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {
    // Get Search query from request query params
    const { searchTerm, searchType } = req.query;

    if (!searchTerm || !searchType) {
      return res
        .status(400)
        .json({ error: "Search Term and Type are required" });
    }

    let filter = {};

    switch (searchType) {
      case "contains":
        filter = { contains: searchTerm };
        break;
      case "startsWith":
        filter = { startsWith: searchTerm };
        break;
      case "endsWith":
        filter = { endsWith: searchTerm };
        break;
      default:
        return res.status(400).json({
          error:
            "Invalid search type. Use 'conatains', 'startsWith', or 'endsWith' ",
        });

        break;
    }

    // Perform the search with the selected pattern matching
    const products = await prisma.product.findMany({
      where: {
        name: {
          ...filter,
          mode: "insensitive", // case insensitive search
        },
      },
    });

    res.json(products); // Return the search results
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Something went wrong while retrieving the product.",
        detail: error.message,
      });
  }
});

// Endpoint to retrieve products filtered by a list of category IDs
router.get("/api/products/filter/categories", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']

  try {
    // Get category ID's from the query parameters (e.g., ?categoryIds=1,2,3)
    const { categoryIds } = req.query;

    // Convert the catgoryIds to an array of integers
    const categoryArray = categoryIds.split(",").map((id) => parseInt(id, 10));

    // Retrieve products where the categoryId is in the list of provided category IDs
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryArray },
      },
    });

    res.json(products); // Return the filtered products
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Something went wrong while retrieving products",
        detail: error.message,
      });
  }
});

// Endpoint to retrieve products filtered by a list of category IDs
router.get("/api/products/between", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  const { priceMin, priceMax } = req.query;

  if (priceMin === undefined || priceMax === undefined) {
    res
      .status(400)
      .json({
        error: "Min or Max Undefined.",
      });
  }

  const min = parseInt(priceMin);
  const max = parseInt(priceMax);

  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: min, // Gtreater then or equal to 100
          lte: max, // less then or equal to 500
        },
      },
    });

    res.json(products); // Return filtered products
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Something went wrong while retrieving products",
        detail: error.message,
      });
  }
});

// Endpoint to retrieve products filtered by a list of category IDs
router.get("/api/products/slicing", async (req, res) => {
  // #swagger.tags = ['Filtering Examples']
  try {

    // He will SKIP the First one and then pick next 5 products
    const products = await prisma.product.findMany({
      take: 5,
      skip: 1,
    });

    res.json(products); // Return filtered products
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Something went wrong while retrieving products",
        detail: error.message,
      });
  }
});

module.exports = router;
