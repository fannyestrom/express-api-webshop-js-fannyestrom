const express = require('express');
const router = express.Router();
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

function formatUser(user) {
  const { id, first_name, email } = user;
  return {
    id, 
    name: `${first_name}`,
    email,
  }; 
}

// GET /api/users (get all users)
router.get('/', (req, res) => {

  // connect to collection "users"
  req.app.locals.db.collection('users').find().toArray()
  .then(results => {
    console.log(results);

    let printUsers = "<div><h2>User list</h2>"

    for (user in results) {
      printUsers += "<div>" + results[user].name + "</div>"
    }

    printUsers += "</div>"

    res.send(printUsers);
  })
});

// POST /api/users/userID (get specific user)


// POST /api/users/add (create new user)
router.post('/add', (req, res) => {

  // connect to collection
  req.app.locals.db.collection('users').insertOne(req.body)
  .then(result => {
    console.log(result);
    res.redirect('/show');
  })

})

module.exports = router;
