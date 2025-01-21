import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function SI() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" component="h3">
            Smart Irrigation 1
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography variant="h5" component="h3">
            GSI 2
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Typography variant="h5" component="h3">
            SI 3
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper>
          <Typography variant="h5" component="h3">
            Grid item 4
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper>
          <Typography variant="h5" component="h3">
            Grid item 5
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper>
          <Typography variant="h5" component="h3">
            Grid item 6
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <Paper>
          <Typography variant="h5" component="h3">
            Grid item 7
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SI;
