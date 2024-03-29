const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET /api/users (get all users)
router.get('/', (req, res, next) => {

  // connect to collection "users"
  req.app.locals.db.collection('users').find().toArray()
  .then(results => {
    console.log(results);

    if (results.length === 0) {
      return res.status(404).send("No users found");
    }

    let printUsers = "<div><h2>User list</h2>"

    for (user in results) {
      printUsers += "<div>" + "id: " + results[user]._id + " " + "name: " + results[user].name + " " + "email: " + results[user].email + "</div>"
    }

    printUsers += "</div>"

    res.send(printUsers);
  })
});

// POST /api/users/:id (get specific user)
router.post('/', async (req, res) => {
  const userId = req.body.id;

  try {
    // retrieve the specific user from MongoDB
    const user = await req.app.locals.db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    // check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // send the user object as JSON
    res.json(user);
  } catch (error) {
    console.error('Error fetching user from the database:', error);
    res.status(500).json({ error: 'An error occurred while fetching user' });
  }
});

// POST /users/add (create new user)
router.post('/add', (req, res) => {

  // connect to collection
  req.app.locals.db.collection('users').insertOne(req.body)
  .then(result => {
    console.log(result);

    res.json(req.body);
  })

});

// POST /users/login (login user)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await req.app.locals.db.collection('users').findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Incorrect login" });
    }

    const { _id, name, email: userEmail } = user; 
    res.json({ user: { id: _id, name, email: userEmail } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});


module.exports = router;
