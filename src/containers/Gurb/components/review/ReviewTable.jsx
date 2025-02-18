import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import ReviewField from './ReviewField'
import { textBody1, textHeader4, textSubtitle2 } from '../../gurbTheme'


const ReviewTable = ({ tableFields }) => {
  return tableFields.map((rows, index) => {
    return (
      <React.Fragment key={index}>
        <Grid container columnSpacing={2} sx={{ marginY: '2rem' }}>
          {rows.map((details, rowIndex) => {
            return (
              <Grid
                key={rowIndex}
                item
                xs={12}
                sm={6}
                sx={{
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                {details.icon}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    marginLeft: '2rem'
                  }}>
                  <Typography sx={textHeader4}>{details.title}</Typography>
                  {details.subtitle && (
                    <Typography sx={textBody1}>{details.subtitle}</Typography>
                  )}
                  {details.field && (
                    <Grid
                      container
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                      {details.field.map((detail, fieldIndex) => {
                        return (
                          <Grid item key={fieldIndex}>
                            <ReviewField
                              label={detail.reviewLabel}
                              value={detail.reviewValue}
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  )}
                  {details.footer && (
                    <Typography sx={textSubtitle2}>{details.footer}</Typography>
                  )}
                </Box>
              </Grid>
            )
          })}
        </Grid>
        <Divider />
      </React.Fragment>
    )
  })
}

export default ReviewTable