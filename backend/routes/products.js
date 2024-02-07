const express = require('express');
const router = express.Router();


// product array
let products = [
    {
        name: 'Chocolate Chip Cookie',
        price: 30,
        category: 'May contain traces of nuts'
    },
    {
        name: 'Caramel Cheesecake',
        price: 40,
        category: 'Vegan'
    },
    {
        name: 'Chocolate Glazed Brownie',
        price: 40,
        category: 'May contain traces of nuts'
    },
    {
        name: 'Cinnamon Roll',
        price: 35,
        category: 'Gluten-free'
    }
]

// GET /api/products (get all products)
router.get('/', (req, res, next) => {

    res.json(products);
});

module.exports = router;