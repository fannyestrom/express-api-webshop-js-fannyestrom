const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

/*
const fs = require('fs');
const csv = require('csv-parser');

const mockUsers = [];

// read users.csv data
fs.createReadStream('./mockdata/users.csv')
  .pipe(csv())
  .on('data', (row) => {
    mockUsers.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });
*/

users = [
  {id: "1", name: "Test", email: "test@mail.com", password: "test"}
]

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

// POST /api/users (get specific user)
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
router.post('/login', (req, res) => {

  let checkEmail = req.body.email;
  let checkPassword = req.body.password;

  let user = users.find(user => user.email == checkEmail && user.password == checkPassword);

  if (user) {
    res.json({user: user.id});
  } else {
    res.status(401).json({message: "Incorrect login"})
  }

})


module.exports = router;
