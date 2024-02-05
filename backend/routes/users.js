const express = require('express');
const router = express.Router();


// GET /api/users (get all users)
router.get('/', (req, res) => {
  // logic for fetching users
  res.json({ message: 'Get all users' });
});


module.exports = router;
