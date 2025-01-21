import React, { useState } from "react";
import SensorCard from "../Card";
import { Typography, Button, Chip, Grid, Card, CardContent } from '@mui/material';
import { useEffect } from "react";
import './style.css';
import axios from "axios";
import { useSvgRef } from "@mui/x-charts";
const arr = [["Temperature", "temp"], ["Ph", "ph"], ["Turbidity", "turbidity"], ["Oxygen", "oxygen"], ["Ammonia", "ammonia"]]
export default function Main({ message, point, chngPoint, data }) {
  const latestData = data[0];
  // const handleClick=(index)=>{
  //     return <SensorCard label={arr[index][0]} data={data} variable={arr[index][1]}/>
  // }
  const msgs = {
    temperature: "Turning on Temperature Equilizer.",
    ph: "Releasing PH Equilizer.",
    oxygen: "Releasing Oxygen.",
    ammonia: "Releasing Ammonia Equilizer.",
    turbidity: "Unstable Turbidity"
  }

  const [actions, setAction] = useState({
    temperature: 1,
    ph: 1,
    oxygen: 1,
    ammonia: 1,
    turbidity: 1
  })

  const sendSignal = (z, w) => {
    if (w === 1) {
      setAction(prev => ({ ...prev, [z]: 0 }));
      setTimeout(() => {
        setAction(prev => ({ ...prev, [z]: 1 }));
      }, 10000);
    }

    const data = {
      signal_type: msgs[z],
      duration: "15 seconds"
    };

    // Send the POST request using Axios
    axios.post('http://localhost:12345/sendAccutatorSignal', data)
      .then(response => {
        console.log('Signal sent successfully:', response.data);
        // alert(response)
      })
      .catch(error => {
        console.error('Error sending signal:', error);
        // Handle error here
      });
  }

  useEffect(() => {
    console.log("Message in child", message)
    console.log("Pointbreak in child", point)
    if (!point) {
      console.log("changing value...")
      const timeout = setTimeout(() => {
        chngPoint();
      }, 15000);

      return () => clearTimeout(timeout);
    }

  }, [point]);

  return (
    <>
      <Grid item container spacing={2} xs={6}>

        <Grid xs={12} item>
          <Card className="Bg1">
            <CardContent>


              <Typography align="center" variant="h6" gutterBottom><b>Date:</b> {new Date(latestData["time"]).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} <b>Time Captured:</b> {new Date(latestData["time"]).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</Typography>



            </CardContent>
          </Card>
        </Grid>

        {arr.map((item, index) => (
          <Grid xs={6} item key={index}>
            <Card className="Bg1">
              <CardContent sx={{ bgcolor: message[item[0].toLowerCase()] === 1 && actions[item[0].toLowerCase()] === 1 ? "" : "red" }} align="center">
                {/* Hello {message[item[0].toLowerCase()]} */}
                <Typography align="center" variant="h5" gutterBottom><b>{item[0]} : {latestData[item[1]]}</b></Typography>

                <SensorCard label={item[0]} data={data} variable={item[1]} />
              </CardContent>
            </Card>

          </Grid>
        ))}

      </Grid>

      <Grid item container spacing={2} xs={6}>
        <Grid item xs={12}>
          <Card className="Bg1" style={{ height: '100%' }}>
            <CardContent>
              <Typography align="center" variant="h4" gutterBottom>Actions taken:</Typography>
              <Grid container spacing={2}>
                {Object.entries(message).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    {value !== 1 && actions[key] === 1 && sendSignal(key,0)}
                    <Chip
                      label={value === 1 && actions[key] === 1 ? key.charAt(0).toUpperCase() + key.slice(1) + " Ok" : msgs[key]}
                      color={value === 1 && actions[key] === 1 ? "primary" : "secondary"}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

        </Grid>

        <Grid item container xs={12}>
          <Card className="Bg1" style={{ height: '100%' }}>
            <CardContent>
              <Typography align="center" variant="h4" gutterBottom>
                Manual Actions
              </Typography>
              <Grid item container spacing={2}>
                <Grid item xs={6}>
                  <Button onClick={() => sendSignal("temperature",1)} variant="contained" color="primary" fullWidth>
                    Release Water
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => sendSignal("oxygen",1)} variant="contained" color="primary" fullWidth>
                    Release Oxygen
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => sendSignal("ph",1)} variant="contained" color="primary" fullWidth>
                    PH Stabilizer
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={() => sendSignal("ammonia",1)} variant="contained" color="primary" fullWidth>
                    Ammonia Stabilizer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </>
  );
}

