import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  title: {
    marginBottom: theme.spacing(3),
    color: '#96b633',
    textTransform: 'uppercase',
    fontWeight: 500
  },
  chooserItem: {
    display: 'block',
    cursor: 'pointer',
    minHeight: '124px',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    border: '2px solid rgba(0, 0, 0, 0.12)',
    '&:hover': {
      border: '2px solid rgba(0, 0, 0, 0.87)'
    }
  }
}))

function BecomeMember (props) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const { validate } = props

  const [value, setValue] = useState('')
  const [isValidated, setValidated] = useState(false)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    validate(isValidated)
  }, [isValidated, validate])

  return (
    <>
      <StepHeader title={t('BECOME_MEMBER_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('BECOME_MEMBER_PRESENTATION') }}
      />
      <Box mt={3} mb={4}>
        <Chooser
          question={t('BECOME_MEMBER_QUESTION')}
          options={[
            {
              value: 'yes',
              label: t('BECOME_MEMBER_YES_LABEL'),
              description: t('BECOME_MEMBER_YES_DESCRIPTION')
            },
            {
              value: 'no',
              label: t('BECOME_MEMBER_NO_LABEL'),
              description: t('BECOME_MEMBER_NO_DESCRIPTION')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default BecomeMember
