import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const sectionTitle = {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
    mt: 3,
    mb: 1.2
  }


const ReviewSectField = ({ title, label, value, multipleValues = false }) => {
    return (
        <Grid container>
            <Grid item xs={12} sm={6}>
                <Typography sx={sectionTitle} variant="h6">
                    {title}
                </Typography>

                <Box
                    sx={
                        multipleValues && {
                            alignItems: 'flex-start'
                        }
                    }>
                    {label !== false && (
                        <Box className="field__title">
                            <Typography
                                sx={{
                                    textTransform: 'uppercase',
                                    pr: '12px',
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    color: 'rgba(0, 0, 0, 0.54)'
                                }}
                                variant="subtitle2">
                                {label}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        sx={
                            multipleValues && {
                                ml: 0,
                                mr: 1.6,
                                mt: 0.5,
                                mb: 0.5
                            }
                        }>
                        <Typography sx={{ fontSize: '16px' }} variant="body2">
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default ReviewSectField


