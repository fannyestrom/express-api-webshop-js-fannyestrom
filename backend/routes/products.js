const express = require('express');
const router = express.Router();


// product array
let products = [
    {
        id: 1,
        name: 'Chocolate Chip Cookie',
        price: 30,
        category: 'May contain traces of nuts'
    },
    {
        id: 2,
        name: 'Caramel Cheesecake',
        price: 40,
        category: 'Vegan'
    },
    {
        id: 3,
        name: 'Chocolate Glazed Brownie',
        price: 40,
        category: 'May contain traces of nuts'
    },
    {
        id: 4,
        name: 'Cinnamon Roll',
        price: 35,
        category: 'Gluten-free'
    }
]

// GET /api/products (get all products)
router.get('/', (req, res, next) => {

    res.json(products);
});

// GET /api/products/:id (get specific product by ID)
router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    const product = products.find(product => product.id === productId)

    if (!product) {
        return res.status(404).json({message: "Product not found"});
    }

    res.json(product);
})

module.exports = router;