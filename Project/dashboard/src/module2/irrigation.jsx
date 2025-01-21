import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import axios from 'axios';
import MyTable from './table';
import Main from './main';
import Settings from './settings';
import './style.css';

function Irrigation() {
  const [value, setValue] = useState("1");
  const [rows, setRows] = useState([]);
  const [pointBreak, setBreak] = useState(1);
  const[loading, setLoading] = useState(0);
  const [messages, setMessages] = useState({
    temperature: 1,
    ph: 1,
    moisture: 1,
    humidity:1
  });

  const row2 = [{id:"abc123",time:1713810436486,temperature:26,ph:7,moisture:35,humidity:50},
  {id:"def456",time:1713810436487,temperature:25,ph:6,moisture:40,humidity:55},
  {id:"ghi789",time:1713810436488,temperature:27,ph:7,moisture:38,humidity:60},
  {id:"jkl012",time:1713810436489,temperature:24,ph:6,moisture:42,humidity:52},
  {id:"mno345",time:1713810436490,temperature:28,ph:7,moisture:36,humidity:58},
  {id:"pqr678",time:1713810436491,temperature:23,ph:6,moisture:39,humidity:54}]

  const handleChange = (event) => {
    
    setValue(event.currentTarget.dataset.value);
  };

  const checkThresholds = (thresh, row2) => {
    const { Temperature, PH, Moisture, Humidity } = thresh;
    const { temperature, ph, moisture, humidity } = row2[0];
    
    const thresholds = {
      Temperature: { value: temperature, range: Temperature, message:0},
      PH: { value: ph, range: PH, message: 0},
      Moisture: { value: moisture, range: Moisture, message: 0},
      Humidity: { value: humidity, range: Humidity, message:0},
    };
  
  
    for (const key in thresholds) {
      const { value, range, message } = thresholds[key];
      if (value < range[0] || value > range[1]) {
        
        setMessages(prevMessages => ({ ...prevMessages, [key.toLowerCase()]: 0 }));
        setBreak(0);
      }
    }
  };
  

  const makeChangePoint=()=>{
      
      Object.entries(messages).forEach(([key, value]) => {
        setMessages(prevMessages => ({ ...prevMessages, [key]: 1 }));
      });
      setBreak(1);
    }
  
  

  const fetchData = async () => {
    console.log("PointBreak in main",pointBreak)
    if (pointBreak===1) {
      const response = await axios.get('http://localhost:3060/get-threshold2');
      const thresh=response.data;
      console.log(thresh)
      var data=[];
      try {
        
        console.log("In fetch data",thresh.Temperature[0])
        const response2 = await axios.get('http://localhost:3051/getModule2Data');
        const myData=response2.data;
        console.log(myData)
        data=response2.data;
        setRows(myData);
      } catch (error) {
        data=row2
        console.log(rows)
        console.error('Error fetching data', error);
      }
      setRows(data);
      checkThresholds(thresh,data);
      setLoading(1);
    }
  };

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000); // Fetch data every 10 seconds
    return () => clearInterval(interval); // Cleanup function to clear interval
  }, []);

  return (
    <Grid p={2} container spacing={2}>
      <Grid item container spacing={2} xs={2} style={{ height: '90vh' }} >
        <Grid item xs={12} style={{ height: '30%', display: 'flex', alignItems: 'center' }}>
          <Button className='Bg2' onClick={handleChange} data-value="1" fullWidth style={{ height: '100%' }}>
            <Typography variant="h5" component="h3">
              Home
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} style={{ height: '30%', display: 'flex', alignItems: 'center' }}>
          <Button className='Bg2' onClick={handleChange} data-value="2" fullWidth style={{ height: '100%' }}>
            <Typography variant="h5" component="h3">
              History
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} style={{ height: '30%', display: 'flex', alignItems: 'center' }}>
          <Button className='Bg2' onClick={handleChange} data-value="3" fullWidth style={{ height: '100%' }}>
            <Typography variant="h5" component="h3">
              Settings
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid item container spacing={2} p={4} xs={10}>
        {loading===1?value === "1" ? <Main message={messages} point={pointBreak} chngPoint={makeChangePoint} data={rows} /> : value === "2" ? <MyTable rows={rows } /> : <Settings/>: "Loading Data..."}
      </Grid>
    </Grid>
  );
}

export default Irrigation;
