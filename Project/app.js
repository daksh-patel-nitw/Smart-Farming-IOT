const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3060;
const cors = require('cors');
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to save threshold data
app.post('/save-threshold', (req, res) => {
  const thresholdData = req.body;
  try {
    // Write the threshold data to a JSON file
    fs.writeFileSync('thresholdData.json', JSON.stringify(thresholdData, null, 2));
    res.status(200).send('Threshold data saved successfully.');
  } catch (error) {
    console.error('Error saving threshold data:', error);
    res.status(500).send('Error saving threshold data.');
  }
});
app.post('/save-threshold2', (req, res) => {
  const thresholdData = req.body;
  try {
    // Write the threshold data to a JSON file
    fs.writeFileSync('thresholdData2.json', JSON.stringify(thresholdData, null, 2));
    res.status(200).send('Threshold data saved successfully.');
  } catch (error) {
    console.error('Error saving threshold data:', error);
    res.status(500).send('Error saving threshold data.');
  }
});

app.get('/get-threshold', (req, res) => {
  try {
    // Read threshold data from the JSON file
    const thresholdData = JSON.parse(fs.readFileSync('thresholdData.json', 'utf8'));
    res.status(200).json(thresholdData);
  } catch (error) {
    console.error('Error reading threshold data:', error);
    res.status(500).send('Error reading threshold data.');
  }
});

app.get('/get-threshold2', (req, res) => {
  try {
    // Read threshold data from the JSON file
    const thresholdData = JSON.parse(fs.readFileSync('thresholdData2.json', 'utf8'));
    res.status(200).json(thresholdData);
  } catch (error) {
    console.error('Error reading threshold data:', error);
    res.status(500).send('Error reading threshold data.');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
