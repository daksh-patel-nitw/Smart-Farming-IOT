import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import axios from 'axios';
import MyTable from './table';
import Main from './main';
import Settings from './settings';
import './style.css';

function Aqua() {
  const [value, setValue] = useState("1");
  const [rows, setRows] = useState([]);
  const [pointBreak, setBreak] = useState(1);
  const[loading, setLoading] = useState(0);
  const [messages, setMessages] = useState({
    temperature: 1,
    ph: 1,
    oxygen: 1,
    turbidity: 1,
    ammonia: 1
  });

  const row2 = [{ ID: "2", time: 1713810736486, temp: 28, ph: 7, oxygen: 4, turbidity: 58, ammonia: 2.3 },
  { ID: "3", time: 1713811036486, temp: 27, ph: 7, oxygen: 5, turbidity: 55, ammonia: 1.1 },
  { ID: "4", time: 1713811336486, temp: 26, ph: 7, oxygen: 2, turbidity: 59, ammonia: 1.4 },
  { ID: "5", time: 1713811636486, temp: 28, ph: 7, oxygen: 3, turbidity: 56, ammonia: 1.3 },
  { ID: "6", time: 1713811936486, temp: 27, ph: 7, oxygen: 4, turbidity: 60, ammonia: 0.8 },
  { ID: "7", time: 1713812236486, temp: 26, ph: 7, oxygen: 5, turbidity: 57, ammonia: 1.5 }]

  const handleChange = (event) => {
    
    setValue(event.currentTarget.dataset.value);
  };

  const checkThresholds = (thresh,data) => {
    console.log(rows)
    const { Temperature, PH, Oxygen, Turbidity, Ammonia } = thresh;
    const { temp, ph, oxygen, turbidity, ammonia } = data[0];
    
    const thresholds = {
      Temperature: { value: temp, range: Temperature, message:0},
      Ph: { value: ph, range: PH, message: 0},
      Oxygen: { value: oxygen, range: Oxygen, message: 0},
      Ammonia: { value: ammonia, range: Ammonia, message:0},
      Turbidity: { value: turbidity, range: Turbidity, message: 0}
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
      const response = await axios.get('http://localhost:3060/get-threshold');
      const thresh=response.data;
      var data=[];
      try {
        
        console.log("In fetch data",thresh.Temperature[0])
        const response2 = await axios.get('http://localhost:3051/getModule1Data');
        const myData=response2.data;
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

export default Aqua;
