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

router.get("/count-active-products", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const activeProducts = await prisma.product.count({
      where: { isActive: true },
    });

    res.json({ activeProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to count active products" });
  }
});

router.get("/count-products-by-category/:categoryId", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const categoryId = parseInt(req.params.categoryId);

    const productCount = await prisma.product.count({
      where: { categoryId },
    });

    res.json({ categoryId, productCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count products by category" });
  }
});

router.get("/count-users-with-orders", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const userCount = await prisma.user.count({
      where: {
        orders: { some: {} }, // Checks if the user has at least one order
      },
    });

    res.json({ usersWithOrders: userCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to count users with orders" });
  }
});

router.get(
  "/count-active-products-ordered-at-least-2-times",
  async (req, res) => {
    // #swagger.tags = ['Aggregation Grouping Section']
    try {
      const productCount = await prisma.orderProduct.groupBy({
        by: ["productId"], // Group by the productId to count orders per product
        where: {
          product: { isActive: true }, // Only active products
        },
        _count: { // _ shows its an aggregative field
          productId: true, // Count how many times each product is in an order
        },
        having: {
          productId: {
            _count: {
              gte: 2, // Only include products that are ordered at least 2 times
            },
          },
        },
      });

    // we are getting this json so make better with Alias  
    //   {
    //     "_count": {
    //         productId: 3 // its a count of product
    //     },
    //     "prductId": 9
    //   }

      const result = productCount.map((productCount) => ({
        product_count: productCount._count.productId,// Alias
        product_id: productCount.productId
      }));

      res.json({ activeProductsOrderedAtLeast3Times: result });
    } catch (error) {
      res.status(500).json({
        error: "Failed to count active products ordered at least 2 times",
      });
    }
  },
);

router.get("/sum-total-value-of-products", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const totalValue = await prisma.product.aggregate({
      _sum: {
        price: true, // Sum of the price of all products
      },
    });

    res.json({ totalProductValue: totalValue._sum.price });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate total value of products",
    });
  }
});

router.get("/sum-total-value-of-products-in-stock", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const result = await prisma.$queryRaw`
      SELECT SUM(p.price * s.quantity) AS total_value
      FROM product p
      JOIN stock_management s ON p.id = s."productId"
      WHERE s.quantity > 0;
    `;
    // Extracting the result from the query response
    const totalValue = result[0].total_value;

    res.json({ totalProductValueInStock: totalValue });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate total value of products in stock",
    });
  }
});

router.get("/sum-total-value-of-products-in-stock", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    // Fetch all products with their prices and quantities in stock
    const productsInStock = await prisma.product.findMany({
      where: {
        stock: {
          quantity: {
            gt: 0, // Only include products that have quantity > 0
          },
        },
      },
      select: {
        price: true, // Product price
        stock: {
          select: {
            quantity: true, // Quantity in stock
          },
        },
      },
    });

    // Calculate the total value by multiplying price * quantity for each product
    const totalValue = productsInStock.reduce((sum, product) => {
      return sum + product.price * product.stock.quantity;
    }, 0);

    res.json({ totalProductValueInStock: totalValue });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate total value of products in stock",
    });
  }
});

router.get("/average-product-price", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const avgPrice = await prisma.product.aggregate({
      _avg: {
        price: true, // Calculate the average of the `price` field
      },
    });

    res.json({ averagePrice: avgPrice._avg.price });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate the average product price",
    });
  }
});

router.get("/average-order-quantity", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const avgQuantity = await prisma.orderProduct.aggregate({
      _avg: {
        quantity: true, // Get the average quantity per product in orders
      },
    });

    res.json({ averageOrderQuantity: avgQuantity._avg.quantity });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate average order quantity",
    });
  }
});

router.get("/average-stock-quantity-active-products", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const avgStock = await prisma.stockManagement.aggregate({
      _avg: {
        quantity: true, // Average quantity from stock
      },
      where: {
        product: {
          isActive: true, // Only include active products
        },
      },
    });

    res.json({ averageStockQuantity: avgStock._avg.quantity });
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate average stock quantity for active products",
    });
  }
});

router.get("/count-products-per-category", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const productsPerCategory = await prisma.product.groupBy({
      by: ["categoryId"], // Group by category
      _count: {
        id: true, // Count products in each category
      },
    });

    res.json(productsPerCategory);
  } catch (error) {
    res.status(500).json({
      error: "Failed to count products per category",
    });
  }
});

router.get("/average-price-per-category", async (req, res) => {
  // #swagger.tags = ['Aggregation Grouping Section']
  try {
    const avgPricePerCategory = await prisma.product.groupBy({
      by: ["categoryId"], // Group by category
      _avg: {
        price: true, // Calculate average price per category
      },
      orderBy: {
        categoryId: "asc", // Order results by categoryId in ascending order
      },
    });

    res.json(avgPricePerCategory);
  } catch (error) {
    res.status(500).json({
      error: "Failed to calculate average price per category",
    });
  }
});

module.exports = router;
