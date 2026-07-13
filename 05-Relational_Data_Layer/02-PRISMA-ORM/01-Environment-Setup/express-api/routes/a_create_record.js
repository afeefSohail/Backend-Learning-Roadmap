const express = require('express')
const router = express.Router()

router.post('/category/insert/', async (req, res) => {
    try {
        const { name , slug, parentId, isActive, level } = req.body
        const category = await prismaCLient.category.create({
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