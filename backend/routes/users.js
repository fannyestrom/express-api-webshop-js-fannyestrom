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

users = []


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
    // Hämta den specifika användaren från MongoDB
    const user = await req.app.locals.db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    // Kontrollera om användaren finns
    if (!user) {
      return res.status(404).json({ error: 'Användaren hittades inte' });
    }
    
    // Skicka användarobjektet som JSON
    res.json(user);
  } catch (error) {
    console.error('Fel vid hämtning av användare från databasen:', error);
    res.status(500).json({ error: 'Ett fel uppstod vid hämtning av användare' });
  }
});





// POST /api/users/add (create new user)
router.post('/add', (req, res) => {

  // connect to collection
  req.app.locals.db.collection('users').insertOne(req.body)
  .then(result => {
    console.log(result);

    res.json(req.body);
  })

});


module.exports = router;
