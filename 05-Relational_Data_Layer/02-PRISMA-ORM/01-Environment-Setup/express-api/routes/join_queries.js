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
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"], // Enables query logging
});

router.get("/api/product/category/join", async (req, res) => {
  // #swagger.tags = ['Join Queries']
  try {
    const products = await prisma.product.findMany({
      // select: {
      //   name: true, // Select product name
      //   category: {
      //     select: {
      //       name: true, // Select only the category name
      //     },
      //   },
      // },
      select: {
        name: true, // Select product name
        category: {
          include: {
            // This will include the entire category record related to each product
            // It can be modified to include specific fields if desired
          },
        },
      },
    });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving products" });
  }
});

// Endpoint to retrieve all users and their orders
router.get("/api/users/join", async (req, res) => {
  // #swagger.tags = ['Join Queries']
  try {
    // Fetch users and include their orders
    const users = await prisma.user.findMany({
      // include: {
      //   orders: true, // Include all orders for each user
      // },
      select: {
        id: true,
        username: true,
        email: true,
        orders: {
          select: {
            id: true, // Select order ID
            createdAt: true, // Select order creation date
          },
        },
      },
    });

    return res.json(users); // Send the retrieved users and orders as a JSON response
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving users and orders",
    });
  }
});

// Endpoint to retrieve all users and their orders
router.get("/api/users/join/aliases", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  try {
    // Fetch users and include their orders
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        orders: {
          select: {
            id: true, // Select order ID
            createdAt: true, // Select order creation date
          },
        },
      },
    });

    // Map and alias the result
    const result = users.map((user) => ({
      userId: user.id, // Alias for user id
      userUsername: user.username, // Alias for username
      userEmail: user.email, // Alias for email
      userOrders: user.orders.map((order) => ({
        orderId: order.id, // Alias for order id
        orderCreatedAt: order.createdAt, // Alias for order creation date
      })),
    }));

    return res.json(result); // Send the retrieved users and orders as a JSON response
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving users and orders",
    });
  }
});

// Raw SQL
router.get("/api/users/sql", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  try {
    // Get categoryId from query parameters (for example, ?categoryId=1)
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const categoryIdInt = parseInt(categoryId, 10);

    // Execute raw SQL query
    const result = await prisma.$queryRaw`
    SELECT p.name, p.price, c.name AS category_name
    FROM product p
    INNER JOIN "category" c ON p."categoryId" = c.id
    WHERE c.id = ${categoryIdInt}
  `;

    return res.json(result); // Send the result of the query as a JSON response
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong while retrieving products and categories",
    });
  }
});

// Endpoint to get product by ID and its inventory data (ONE TO ONE)
router.get("/product/:id", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    // Fetch product and its stock (inventory) data
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true, // Include Category related to this product
        stock: true, // Include stock management related to this product
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the product data" });
  }
});

// Endpoint to get product by ID and its inventory data (MANY TO MANY)
router.get("/product/promotions/new", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  try {
    const productWithPromotions = await prisma.product.findUnique({
      where: { id: 1 },
      include: {
        productPromotions: {
          include: {
            promotionEvent: true,
          },
        },
      },
    });

    return res.json(productWithPromotions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the product data",
      details: error.message,
    });
  }
});

// Endpoint to get product by ID and its inventory data (MANY TO MANY)
router.get("/user/orders", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  try {
    const userWithOrdersAndProducts = await prisma.user.findUnique({
      where: { id: 1 }, // Replace with dynamic userId
      include: {
        orders: {
          include: {
            orderProducts: {
              include: {
                product: true, // Fetch the product data related to this order product
              },
            },
          },
        },
      },
    });

    return res.json(userWithOrdersAndProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the product data",
      details: error.message,
    });
  }
});

router.get("/product/promotions/left/join", async (req, res) => {
  // #swagger.tags = ['Join Queries']

  try {
    const productWithPromotions = await prisma.product.findMany({
      include: {
        productPromotions: {
          include: {
            promotionEvent: true,
          },
        },
      },
    });

    //   const productWithPromotions = await prisma.product.findMany({
    //     where: {
    //       productPromotions: {
    //         some: {
    //           promotionEvent: {
    //             id: {
    //               not: 0, // Filter out promotions with an invalid ID (i.e. 0 or null)
    //             },
    //           },
    //         },
    //       },
    //     },
    //     include: {
    //       productPromotions: {
    //         include: {
    //           promotionEvent: true, // Include promotion event details
    //         },
    //       },
    //     },
    //   });

    return res.json(productWithPromotions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the product data",
      details: error.message,
    });
  }
});

router.get("/product/promotions/full/join", async (req, res) => {
  // #swagger.tags = ['Join Queries']
  try {
    // Fetch all products with their associated promotions (if any)
    const productsWithPromotions = await prisma.product.findMany({
      include: {
        productPromotions: {
          include: {
            promotionEvent: true, // Include promotion event details if present
          },
        },
      },
    });

    // Fetch all promotion events, even if they aren't connected to any products
    const promotionEvents = await prisma.promotionEvent.findMany();

    // Combine the results manually to simulate a LEFT JOIN behavior
    const fullJoinResults = productsWithPromotions.map((product) => {
      // If there is no promotionEvent, we can add the promotionEvent details as null
      const productPromotions = product.productPromotions.length
        ? product.productPromotions
        : [{ promotionEvent: null }]; // Simulate LEFT JOIN behavior

      return {
        ...product,
        productPromotions,
      };
    });

    // Optionally, include promotion events that are not connected to any product
    promotionEvents.forEach((promotionEvent) => {
      const isPromotionUsed = productsWithPromotions.some((product) =>
        product.productPromotions.some(
          (promotion) => promotion.promotionEvent.id === promotionEvent.id,
        ),
      );

      if (!isPromotionUsed) {
        fullJoinResults.push({
          id: null, // Placeholder or empty product data
          name: null,
          productPromotions: [{ promotionEvent }],
        });
      }
    });

    return res.json(fullJoinResults);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the product data",
      details: error.message,
    });
  }
});

module.exports = router;
