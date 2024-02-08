const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');


// GET /api/products (get all products)
router.get('/', (req, res, next) => {
    req.app.locals.db.collection('products').find().toArray()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal server error" });
        });
});


// GET /api/products/:id (get specific product by ID)
router.get('/:id', (req, res) => {

    const productId = req.params.id;

    console.log("Received product ID:", productId); 

    if (!ObjectID.isValid(productId)) {
        console.log("Invalid product ID:", productId); 
        return res.status(400).json({ message: "Invalid product ID" });
    }

    req.app.locals.db.collection('products').findOne({ _id: ObjectID(productId) }, (err, product) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    });
});


// POST /api/products/add (add product)
router.post('/add', (req, res) => {
    const newProduct = req.body;
    console.log("new product", newProduct);

    req.app.locals.db.collection('products').insertOne(newProduct)
        .then(result => {
            console.log("New product added successfully:", result.insertedId);
            res.status(201).json({ message: "Product added successfully", productId: result.insertedId });
        })
        .catch(error => {
            console.error("Error adding product:", error);
            res.status(500).json({ message: "Internal server error" });
        });
});


module.exports = router;