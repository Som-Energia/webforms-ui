import React, { useState } from 'react'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'

import PublishIcon from '@material-ui/icons/Publish'

const handleChange = (event) => {

}

const Uploader = (props) => {
  return (
    <>
      <TextField
        id="phases-attachments-label"
        type="file"
        label=""
        required
        variant="outlined"
        onChange={handleChange}
        fullWidth
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <IconButton>
                <PublishIcon />
              </IconButton>
            </InputAdornment>
        }}
        helperText={t('INSTALL_TYPE_ATTACHMENTS_INFO')}
      />
    </>
  )
}

export default Uploader
