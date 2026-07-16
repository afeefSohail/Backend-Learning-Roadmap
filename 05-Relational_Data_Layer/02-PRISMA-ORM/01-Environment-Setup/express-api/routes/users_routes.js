const express = require('express');
const router = express.Router();
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the 
// internal connection engine has been removed — you must pass an adapter, with no fallback. 
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you 
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
const { Pool } = require('pg');
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({ adapter });

// Many to Many Insert ... (user create order and order create order product)
router.post("/user/order", async (req, res) => {
  // #swagger.tags = ['Product Section']
  try {
    // Destructuring the request body to extract the necessary fields
    const { username, email, password, products } = req.body;

    // Step 1: Create a new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // Be sure to hash the password before storing it in production
      },
    });

    // Step 2: Create the order for the user
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderProducts: {
          create: products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: { orderProducts: true }, // Include the created order products in the response
    });

    // Step 3: Send back the response with user and order details
    res.json({
      user,
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;