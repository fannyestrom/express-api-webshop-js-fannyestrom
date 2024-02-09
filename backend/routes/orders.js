const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// POST /api/orders/add (create new order for specific user)
router.post('/add', async (req, res) => {
    const { user, products } = req.body;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized. User not logged in." });
    }

    try {
        // retrieve user from data base
        const userRecord = await req.app.locals.db.collection('users').findOne({ _id: new ObjectId(user) });
        
        // check if the user exists
        if (!userRecord) {
            return res.status(404).json({ error: 'User not found' });
        }

        // validate products
        const validProductIds = await validateProducts(products, req.app.locals.db);

        // return error if products not valid
        if (validProductIds.length !== products.length) {
            return res.status(400).json({ error: 'One or more product IDs are invalid' });
        }

        // create order in the data base
        const order = {
            userId: user,
            products: validProductIds.map(productId => ({ productId, quantity: 1 })),
            createdAt: new Date()
        };

        const result = await req.app.locals.db.collection('orders').insertOne(order);
        res.json({ message: 'Order created successfully', orderId: result.insertedId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating order' });
    }
});

// validate products
async function validateProducts(products, db) {
    const validProductIds = [];

    for (const product of products) {
        const productId = product.productId;

        try {
            // does product exist in data base
            const productRecord = await db.collection('products').findOne({ _id: new ObjectId(productId) });
            
            // add to array if it exists
            if (productRecord) {
                validProductIds.push(productId);
            }
        } catch (error) {
            console.error('Error validating product:', error);
        }
    }

    return validProductIds;
}

// GET /api/orders/all (get all orders)
router.get('/all', (req, res, next) => {

    req.app.locals.db.collection('orders').find({}).toArray()
    .then(orders => {
        res.status(200).json(orders);
    })
    .catch(error => {
        console.error("Error fetching orders:", error);
        res.status(500).send("Error fetching orders");
    });
});

module.exports = router;