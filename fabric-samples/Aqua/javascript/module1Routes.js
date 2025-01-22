// module1Route.js

const express = require('express');
const router = express.Router();
const enrollAdmin = require('./enrollAdmin');
const registerUser = require('./registerUser');

// Route for enrolling admin
router.get('/enrollAdmin', async (req, res) => {
    try {
        console.log("Enrolling as admin...")
        await enrollAdmin();
        console.log("Admin enrollment successful");

        console.log("Registering the user...")
        await registerUser();
        console.log("User registration successful");

        console.log("Wallet made successfully!!!")
        res.status(200).send('Successful');
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
