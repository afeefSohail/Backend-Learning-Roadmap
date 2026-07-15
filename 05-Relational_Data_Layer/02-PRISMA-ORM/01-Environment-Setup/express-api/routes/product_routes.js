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

// One to One ... (One Product has One StockManagment row) 
router.post("/product/stock", async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      isDigital,
      isActive,
      price,
      stockQuantity,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        categoryId, name, slug,
        description,
        isDigital,
        isActive,
        price,
        stock: {
          create: {
            quantity: stockQuantity || 0,
            lastCheckedAt: new Date(),
          },
        },
      },
      include: { stock: true },
    });

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;