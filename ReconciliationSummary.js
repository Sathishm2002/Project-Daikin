import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const reconciliationData = [
  { name: 'Reconciled', value: '60%', color: '#16DBCC' },
  { name: 'Mismatch', value: 13, color: '#FFC107' },
  { name: 'Pending', value: '10%', color: '#FF5B5B' },
];

export const ReconciliationSummary = () => {
  return (
    <>
      <Typography
        variant="h5"
        color="#343c69"
        fontWeight="bold"
        paddingBottom="10px"
        marginTop="15px"
        fontSize="22px">
        Reconciliation Summary
      </Typography>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          //boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          boxShadow: '6px 6px 55px rgba(0, 0, 0, 0.05)'
        }}>
        <ResponsiveContainer width="100%" height={250} spacing={4}>
          <PieChart>
            <Pie
              margin-left="300px"
              data={reconciliationData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={80}
              dataKey="value"
              label>
              {reconciliationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Grid container spacing={2}>
          {reconciliationData.map((item, index) => (
            <Grid item key={index} xs={4}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: item.color,
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                {item.name}
              </Typography>
              {/* <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#606060',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                {item.value}%
              </Typography> */}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
};
