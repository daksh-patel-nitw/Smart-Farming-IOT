const express = require('express');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { getId, enrollAdmin, registerUser, getAllData, addData } = require('./mod1Functions');
const cors = require('cors');
// // Now you can use these functions in your code
// enrollAdmin();
// registerUser();
// getAllData();
// ;

const app = express();
const PORT = process.env.PORT || 3051;
app.use(bodyParser.json());
app.use(cors());
app.get('/enrollAdmin', async (req, res) => {
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


// Middleware to parse JSON bodies


// Define the function to be executed at regular intervals
async function fetchDataFromExternalLink() {
    try {
        const response = await fetch('http://127.0.0.1:12345');
        const data = await response.json();
        
        const id=await getId();
        // console.log('Fetched data with id:', id);
        // console.log('Fetched data with timestamp:', data.temperature, data.ph, data.oxygen, data.turbudity, data.ammonia);
        data.time = new Date().getTime();

        await addData( id, data.time, data.temperature, data.ph, data.oxygen, data.turbudity, data.ammonia);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Set the interval to execute the function every 5 seconds
const interval = setInterval(fetchDataFromExternalLink, 13000);


app.post('/submitTransaction', async (req, res) => {
    try {
        // Extract data from the request body
        const { id, time, temp, ph, oxygen, turbidity, ammonia } = req.body.args;
        
        // Submit the specified transaction
        await addData( id, time, temp, ph, oxygen, turbidity, ammonia);

        res.status(200).send('Transaction submitted successfully');
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.status(500).send('Failed to submit transaction');
    }
});

app.get('/getModule1Data',async(req,res)=>{
    try {
        const result=await getAllData();
        const parsedResult = JSON.parse(result);
        const records = parsedResult.map(entry => entry.Record);
        records.sort((a, b) => b.time - a.time);
        res.status(200).json(records);       
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).send('Internal server error');
        // process.exit(1);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('Interval stopped.');
    process.exit();
});