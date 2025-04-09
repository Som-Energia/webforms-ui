import React from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import ReviewField from './ReviewField'

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
                        <Typography variant="body.md.bold">
                          {details.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          {details.subtitle && (
                            <Grid item xs={10}>
                              <Typography variant="body.md.regular">
                                {details.subtitle}
                              </Typography>
                            </Grid>
                          )}
                          {details.field && (
                            <Grid item xs={12}>
                              <Grid container>
                                {details.field.map((detail, fieldIndex) => {
                                  return !detail.hide && (
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
                              <Typography variant="body.md.regular">
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
