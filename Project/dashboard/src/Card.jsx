import React, { useState } from 'react';
import { Modal, Typography, Button } from '@mui/material';
import { LineChart } from '@mui/x-charts';

const SensorCard = ({ label, data, variable }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + "\n" + date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  // Filter the data for the specified label
  const filteredData = data.map((item) => ({
    time: formatTimestamp(item.time),
    value: item[variable],
  }));

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" color="primary">
        Open Graph
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
                   
          <div style={{ width: '100%', height: '300px', marginTop: '20px' }}>
            <LineChart
              width={1300}
              height={300}
              series={[{ data: [0, ...filteredData.map((item) => item.value)], xAccessor: 'time', yAccessor: 'value', type: 'line', label: label }]}
              xAxis={[{ scaleType: 'point', data: [0, ...filteredData.map((item) => item.time)] }]}
              yAxis={[{ scaleType: 'linear', domain: [2, 20] }]}
              margin={{ top: 50, bottom: 40 }}
            />
          </div>
          <Button onClick={handleClose} variant="outlined" color="secondary" style={{ marginTop: '20px' }}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SensorCard;
