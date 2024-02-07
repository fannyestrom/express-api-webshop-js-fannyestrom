const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

// POST /api/orders/add (place order for specific user)
router.post('/add', (req, res, next) => {
    const orderData = req.body;

    console.log("Received order data:", orderData);

    req.app.locals.db.collection('orders').insertOne(orderData)
    .then(result => {
        console.log(result);
        res.status(200).send("Order successfully created!");
    })
    .catch(error => {
        console.error("Error creating order:", error)
        res.status(500).send("Error creating order");
    });
});

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