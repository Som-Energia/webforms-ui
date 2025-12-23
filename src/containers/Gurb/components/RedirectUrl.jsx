import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { buttonGurbDark } from '../../../themes/gurbTheme'
import {
  redirectUrlDescription,
  redirectUrlTitle,
  redirectUrlButton
} from '../../../themes/commonStyles'

const RedirectUrl = ({
  title = 'somenergia redirect url component',
  description = 'a naive url redirect component',
  buttonText = 'Ves-hi!',
  url = 'https://somenergia.coop'
}) => {
  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h5" sx={redirectUrlTitle}>
          {title}
        </Typography>
      </Grid>

      <Grid item>
        <Typography
          component="div"
          variant="body1"
          sx={redirectUrlDescription}
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
            ...redirectUrlButton
          }}>
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
  url: PropTypes.string
}

export default RedirectUrl
