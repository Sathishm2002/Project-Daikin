import React from 'react'
import { Card, CardContent, Typography, Grid, Box, useMediaQuery } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { submitInvoice, uploadSOA, request, enquiry } from 'constants/imageConstants'

const CardWithArrow = () => {
  const isMediumScreen = useMediaQuery('(max-width: 1279px)')
  const isSmallScreen = useMediaQuery('(max-width: 919px)')

  const cardData = [
    { img: submitInvoice, text: 'Submit New Invoice' },
    { img: enquiry, text: 'Upload SOA' },
    { img: uploadSOA, text: 'Raise an Enquiry' },
    { img: request, text: 'Request Advance Payment' }
  ]

  return (
    <>
      <Typography
        variant="h5"
        color="#333B69"
        fontWeight="bold"
        fontSize="22.48px"
        paddingBottom="5px"
        marginTop="30px">
        Quick Links
      </Typography>

      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {cardData.map((item, index) => (
          <Grid item xs={12} sm={isSmallScreen ? 12 : isMediumScreen ? 6 : 3} key={index}>
            <Card
              sx={{
                minWidth: 200,
                textAlign: 'center',
                borderRadius: 5,
                backgroundColor: 'white',
                transition: 'background-color 0.3s ease-in-out',
                boxShadow: '6px 6px 55px rgba(0, 0, 0, 0.05)',
                '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' }
              }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography
                    sx={{
                      display: 'flex',
                      fontSize: '16.35px',
                      color: '2C2C2C',
                      fontWeight: 'bold',
                      alignItems: 'center'
                    }}>
                    <img src={item.img} style={{ paddingInlineEnd: '8px'}} alt={item.text} />
                    {item.text}
                  </Typography>
                  <ArrowForwardIosIcon className="rtl:rotate-180" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default CardWithArrow
