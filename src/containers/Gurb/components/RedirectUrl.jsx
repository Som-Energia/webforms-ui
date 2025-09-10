import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'


const RedirectUrl = ({
    title = 'somenergia redirect url component',
    description = 'a naive url redirect component',
    buttonText = 'Ves-hi!',
    url = 'https://somenergia.coop'
}) => {
    const handleRedirect = () => {
        if (url) {
            window.location.href = url
        }
    }

    return (
      <Grid container spacing={2} direction="column" alignItems="center">

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
              {title}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography
            sx={{
              mt: 2,
              fontWeight: '400',
              fontSize: '1rem',
              lineHeight: '1.75',
              textAlign: 'center',
              color: 'secondary.extraDark'
            }}
            variant="body1"
            dangerouslySetInnerHTML={{
                __html: description
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedirect}
            sx={{ borderRadius: '2rem', paddingX: '2rem' }}
          >
            {buttonText}
          </Button>
        </Grid>

      </Grid>
    )
}

export default RedirectUrl
