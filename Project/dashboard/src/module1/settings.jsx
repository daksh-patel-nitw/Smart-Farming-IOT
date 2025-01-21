import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import thresholdData from './thresholdData.json';
import axios from 'axios';

function Settings() {
  const [threshold, setThreshold] = useState(thresholdData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3060/get-threshold');
        console.log("in settings", response.data);
        setThreshold(response.data);
      } catch (error) {
        console.error('Error fetching threshold data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, key, type) => {
    const { value } = event.target;
    const updatedThreshold = { ...threshold };
    updatedThreshold[key][type] = parseFloat(value);
    setThreshold(updatedThreshold);
  };

  const handleSave = () => {
    // Save threshold data to the JSON file (if needed)
    fetch('http://localhost:3060/save-threshold', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(threshold)
    })
      .then(response => {
        if (response.ok) {
          console.log('Threshold data saved successfully.');
        } else {
          console.error('Error saving threshold data:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error saving threshold data:', error);
      });

    console.log("Threshold data saved:", threshold);
  };

  return (
    <Grid container spacing={2}>
      {Object.keys(threshold).map((key) => (
        <Grid container item xs={12} spacing={4} key={key}>
          <Grid item xs={4}>
            <h2 style={{ textAlign: 'right' }}>{key}</h2>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id={`${key}-min`}
              label="Min"
              type="number"
              value={threshold[key][0]}
              onChange={(event) => handleChange(event, key, 0)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              id={`${key}-max`}
              label="Max"
              type="number"
              value={threshold[key][1]}
              onChange={(event) => handleChange(event, key, 1)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid container item xs={12} justifyContent="center">
        <Button style={{ width: '50%' }} variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
}

export default Settings;
