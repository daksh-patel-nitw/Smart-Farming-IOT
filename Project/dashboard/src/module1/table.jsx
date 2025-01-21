import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
export default function MyTable({rows}) {
  return (
    <Grid item xs={12}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth:200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Temperature (&#8451;)</TableCell>
            <TableCell align="right">PH</TableCell>
            <TableCell align="right">Oxygen(mg/L)</TableCell>
            <TableCell align="right">Turbidity(g)</TableCell>
            <TableCell align="right">Ammonia(mg/L)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.time}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{new Date(row.time).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</TableCell>
              <TableCell component="th" scope="row">{new Date(row.time).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</TableCell>
              <TableCell component="th" scope="row">{row.temp}</TableCell>
              <TableCell align="right">{row.ph}</TableCell>
              <TableCell align="right">{row.oxygen}</TableCell>
              <TableCell align="right">{row.turbidity}</TableCell>
              <TableCell align="right">{row.ammonia}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
  );
}
