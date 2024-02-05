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
  const { id, first_name, last_name, email } = user;
  return {
    id, 
    name: `${first_name} ${last_name}`,
    email,
  };
}

// GET /api/users (get all users)
router.get('/', (req, res) => {
  try {
    // format users without password
    const formattedUser = mockUsers.map(formatUser);

    // respond with formatted users
    res.json({ users: formattedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/users/userID (get specific user)
router.get('/:userID', (req, res) => {
  try {
    const userId = req.params.userID;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      // format user
      const formattedUser = formatUser(user);

      res.json({ user: formattedUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
