import React, { useState } from 'react'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from 'react-i18next'

export default function SelectedListItem({
  data,
  title,
  acceptFunction,
  acceptButtonText,
  cancelFunction,
  cancelButtonText
}) {
  const [checked, setChecked] = useState([])
  const { t } = useTranslation()

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const ListItemsSelect = ({ data }) => {
    return (
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '15px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}>
          <Typography sx={{ fontSize: '16px' }} variant="h6">
            {title}
          </Typography>
        </Grid>
        <Grid container item>
          <List>
            {data.map((value) => {
              return (
                <ListItem
                  key={value.id}
                  role={undefined}
                  dense
                  onClick={() => handleToggle(value.id)}>
                  <ListItemIcon>
                    <Checkbox
                      data-testid={'checkbox-' + value.id}
                      edge="start"
                      checked={checked.indexOf(value.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={value.id}
                    primary={value.primary}
                    secondary={value.secondary}
                  />
                </ListItem>
              )
            })}
          </List>
        </Grid>
        <Grid>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: t('GENERATION_ADD_ASSIGNMENTS_INFO_MSG')
            }}
          />
        </Grid>
        <Grid
          item
          container
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
          {acceptFunction ? (
            <Button
              color="primary"
              data-testid={'list-accept-button'}
              disabled={checked.length === 0}
              onClick={() => acceptFunction(checked)}>
              {acceptButtonText}
            </Button>
          ) : null}
          {cancelFunction ? (
            <Button
              color="primary"
              data-testid={'list-cancel-button'}
              onClick={cancelFunction}>
              {cancelButtonText}
            </Button>
          ) : null}
        </Grid>
      </Grid>
    )
  }

  return (
    <Box>
      <ListItemsSelect data={data} />
    </Box>
  )
}
