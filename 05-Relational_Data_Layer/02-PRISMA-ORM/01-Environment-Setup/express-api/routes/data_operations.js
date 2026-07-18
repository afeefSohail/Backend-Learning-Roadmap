const express = require("express");
const router = express.Router();
// In Prisma v7, new PrismaClient() without arguments throws exactly this error because the
// internal connection engine has been removed — you must pass an adapter, with no fallback.
// The prisma-client generator now connects through a driver adapter, so for PostgreSQL you
// need to install @prisma/adapter-pg and pass it to the constructor as new PrismaClient({ adapter })
// npm install @prisma/adapter-pg pg
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

// Create a native PostgreSQL connection pool targeting the internal Docker network address
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Wrap it inside the mandatory Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);
// Pass the adapter straight into the constructor (Fixes the Prisma 7 validation panic!)
const prisma = new PrismaClient({ adapter });

router.post("/category/insert", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const { name, slug, parentId, isActive, level } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId,
        isActive: isActive || false,
        level: level || 0,
      },
    });

    res
      .status(200)
      .json({ message: "Category inserted successfully", category: category });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error creating category", details: error.message });
  }
});

router.post("/category/bulk-insert", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const categories = req.body.categories;
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const result = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Avoid duplication error
    });

    res.status(201).json({
      message: "Categories inserted successfully",
      categories: result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error inserting categories", details: error.message });
  }
});

router.post("/category/update/:id", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const categoryId = parseInt(req.params.id); // Extract the Category ID from URL Parameter
    const { name, slug, parentId, isActive, level } = req.body;

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const updateCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name, // If provided
        slug, // If provided
        parentId, // If provided
        isActive: isActive, // If provided
        level: level, // If provided
      },
    });

    res.status(200).json({
      message: "Catgeory updated successfully",
      category: updateCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating category", details: error.message });
  }
});

router.post("/category/upsert", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const { name, slug, parentId, isActive, level } = req.body;

    // Upsert operation based on unique fields (name and slug)
    const upsertedCategory = await prisma.category.upsert({
      where: {
        // name_slug : {
        //     name: name,
        //     slug: slug,
        // }, // `name_slug` is a compound unique field (name and slug combined)
        name: name,
      },
      update: {
        name, // this will not update since name and slug are unique
        slug, // this will not update since name and slug are unique
        parentId,
        isActive: isActive,
        level: level,
      },

      create: {
        name,
        slug,
        parentId,
        isActive: isActive,
        level: level,
      },
    });

    res.status(200).json({
      message: "Catgeory upsert successfully",
      category: upsertedCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error upsert category", details: error.message });
  }
});

router.post("/category/update-many", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const { names, parentId, isActive, level } = req.body;

    // Ensure names is an array and has values
    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: "Invalid names input" });
    }

    const updatedCategories = await prisma.category.updateMany({
      where: {
        name: { in: names }, // update all categories where the name is in the provided list
      },
      data: {
        parentId,
        isActive,
        level,
      },
    });

    res.status(200).json({
      message: "Categories updated successfully",
      categories: updatedCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updated categories", details: error.message });
  }
});

// One to Many ... (One Category with Many Products)
router.post("/category", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const { name, parentId, slug, isActive, level, products } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        parentId,
        slug,
        isActive,
        level,
        products: {
          create: products, // Insert related products
        },
      },
      include: { products: true },
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/category/bulk-delete", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    // Extract category IDs from the request body
    const { categoryIds } = req.body;

    // Ensure that categoryIds is an array and not empty
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ error: "categoryIds must be a non-empty array" });
    }

    // Perform bulk deletion using deleteMany
    const deletedCategories = await prisma.category.deleteMany({
      where: {
        id: {
          in: categoryIds, // Delete categories with the provided IDs
        },
      },
    });

    // If no categories were deleted, return 404
    if (deletedCategories.count === 0) {
      return res.status(404).json({ error: "No categories found to delete" });
    }

    // Return the number of deleted categories
    res.status(200).json({
      message: `${deletedCategories.count} categories deleted successfully`,
    });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: error.message });
  }
});

router.delete("/category/:id", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
  try {
    const categoryId = parseInt(req.params.id);

    // Ensure the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Optionally, handle related records (e.g., check for products or child categories)
    // If you want to delete a category along with its associated products, for example, you can cascade delete the related products
    await prisma.category.delete({
      where: { id: categoryId },
      // Optionally, you can add `include` to return the deleted category or related records
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// One to One ... (One Product has One StockManagment row)
router.post("/product/stock", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
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
        categoryId,
        name,
        slug,
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

// Many to Many Insert ... (user create order and order create order product)
router.post("/user/order", async (req, res) => {
  // #swagger.tags = ['Data Relational Operation Section']
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
