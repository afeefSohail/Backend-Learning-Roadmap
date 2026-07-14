const express = require('express');
const router = express.Router();
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the 
// internal connection engine has been removed — you must pass an adapter, with no fallback. 
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you 
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
const { Pool } = require('pg');
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client")

// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({ adapter });

router.post('/category/insert/', async (req, res) => {
    try {
        
        const { name , slug, parentId, isActive, level } = req.body;

        const category = await prisma.category.create({
            data: {
                name, 
                slug, 
                parentId,
                isActive: isActive || false, 
                level: level || 0,
            },
        });
        
        res.status(200).json(category);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Error creating category"});
    }
});

module.exports = router;