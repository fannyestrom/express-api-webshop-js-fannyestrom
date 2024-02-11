const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


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
    console.log("Received productId:", productId);

    let objectId;
    try {
        objectId = new ObjectId(productId);
        console.log("Converted to ObjectId:", objectId);
    } catch (error) {
        console.error("Error converting to ObjectId:", error);
        return res.status(400).json({ message: "Invalid product ID" });
    }

    req.app.locals.db.collection('products').findOne({ _id: objectId })
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Internal server error" });
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