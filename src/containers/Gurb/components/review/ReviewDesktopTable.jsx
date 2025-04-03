import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import ReviewField from './ReviewField'
import { textBody1, textHeader4, textSubtitle2 } from '../../gurbTheme'

const ReviewDesktopTable = ({tableFields}) => {
  return tableFields.map((rows, index) => {
    return (
      <React.Fragment key={index}>
        <Grid container rowSpacing={4}>
          {rows.map((details, rowIndex) => {
            return (
              <Grid key={rowIndex} item xs={12} sm={6}>
                <Grid container spacing={0}>
                  <Grid item xs={2}>
                    {details.icon}
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container spacing={1}>
                      <Grid item xs={10}>
                        <Typography sx={textHeader4}>
                          {details.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          {details.subtitle && (
                            <Grid item xs={10}>
                              <Typography sx={textBody1}>
                                {details.subtitle}
                              </Typography>
                            </Grid>
                          )}
                          {details.field && (
                            <Grid item xs={12}>
                              <Grid container>
                                {details.field.map((detail, fieldIndex) => {
                                  return (
                                    <Grid item key={fieldIndex} xs={12}>
                                      <ReviewField
                                        label={detail.reviewLabel}
                                        value={detail.reviewValue}
                                        step={detail.step}
                                      />
                                    </Grid>
                                  )
                                })}
                              </Grid>
                            </Grid>
                          )}
                          {details.footer && (
                            <Grid item xs={10}>
                              <Typography sx={textSubtitle2}>
                                {details.footer}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
        <Box sx={{ marginY: '2rem' }}>
          <Divider />
        </Box>
      </React.Fragment>
    )
  })
}
export default ReviewDesktopTable
