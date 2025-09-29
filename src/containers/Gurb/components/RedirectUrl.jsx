import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { buttonGurbDark } from '../../../containers/Gurb/gurbTheme'

const RedirectUrl = ({
  title = 'somenergia redirect url component',
  description = 'a naive url redirect component',
  buttonText = 'Ves-hi!',
  url = 'https://somenergia.coop',
}) => {
  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
      </Grid>

      <Grid item>
        <Typography
          component="div"
          variant="body1"
          sx={{
            mt: 2,
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.75,
            textAlign: 'center',
            color: 'secondary.extraDark',
          }}
          {...(description
            ? { dangerouslySetInnerHTML: { __html: description } }
            : {})}
        />
      </Grid>

      <Grid item>
        <Button
          data-cy="redirect-button"
          type="button"
          href={url}
          variant="contained"
          color="primary"
          sx={{
            ...buttonGurbDark,
            boxSizing: 'border-box',
            lineHeight: 1,
            textTransform: 'none'
          }}
        >
          {buttonText}
        </Button>
      </Grid>
    </Grid>
  )
}

RedirectUrl.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  url: PropTypes.string,
}

export default RedirectUrl
