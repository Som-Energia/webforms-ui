import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Typography from '@material-ui/core/Typography'

import StepHeader from '../../components/StepHeader'
import Uploader from '../../components/Uploader'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    marginTop: theme.spacing(3)
  },
  container: {
    width: '100%'
  },
  chooserItem: {
    display: 'block',
    cursor: 'pointer',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    margin: '1px 1px 9px 1px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    '&:not(.Mui-disabled):hover': {
      border: '1px solid rgba(0, 0, 0, 0.87)',
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
  },
  chooserItemSelected: {
    border: '2px solid #96b633',
    backgroundColor: 'rgba(150, 182, 51, 0.08)',
    margin: '0 0 8px 0',
    '&:not(.Mui-disabled):hover': {
      border: '2px solid #96b633',
      backgroundColor: 'rgba(150, 182, 51, 0.08)'
    }
  },
  chooserItemTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  chooserItemDesc: {
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  },
  attachmentTitle: {
    paddingLeft: theme.spacing(1)
  }
}))

const SpecialCases = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue } = props

  const specialHandleChange = (event) => {
    if (event.target.name === 'especial_cases.reason_death') {
      if (values.especial_cases.reason_death === true) {
        setFieldValue('especial_cases.attachments.death', [], false)
      }
      if (values.especial_cases.reason_merge === true) {
        setFieldValue('especial_cases.reason_merge', false, false)
      }
      setFieldValue(
        'especial_cases.reason_death',
        !values.especial_cases.reason_death,
        true
      )
    } else if (event.target.name === 'especial_cases.reason_merge') {
      if (values.especial_cases.reason_death === true) {
        setFieldValue('especial_cases.reason_death', false, false)
        setFieldValue('especial_cases.attachments.death', [], false)
      }
      setFieldValue(
        'especial_cases.reason_merge',
        !values.especial_cases.reason_merge,
        true
      )
    } else if (event.target.name === 'especial_cases.reason_electrodep') {
      if (values.especial_cases.reason_electrodep === true) {
        setFieldValue('especial_cases.attachments.medical', [], false)
        setFieldValue('especial_cases.attachments.resident', [], false)
      }
      setFieldValue(
        'especial_cases.reason_electrodep',
        !values.especial_cases.reason_electrodep,
        true
      )
    }
  }

  return (
    <>
      <StepHeader title={t('SPECIAL_CASES_TITLE')} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: t('SPECIAL_CASES_QUESTION') }}
      />
      <Box mt={3} mb={0}>
        <FormControl component="fieldset" className={classes.container}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.especial_cases?.reason_death}
                  onChange={specialHandleChange}
                  name="especial_cases.reason_death"
                  color="primary"
                />
              }
              label={t('SPECIAL_CASES_REASON_DEATH')}
              className={clsx(
                classes.chooserItem,
                values.especial_cases?.reason_death &&
                  classes.chooserItemSelected
              )}
            />
            {values.especial_cases?.reason_death && (
              <>
                <Typography className={classes.attachmentTitle}>
                  {t('CERT_ATTACH_DEATH')}
                </Typography>
                <Box mt={1} mb={2}>
                  <Uploader
                    fieldError={
                      errors.especial_cases?.attachments &&
                      touched.especial_cases?.attachments &&
                      errors.especial_cases?.attachments
                    }
                    callbackFn={(attachments) =>
                      setFieldValue(
                        'especial_cases.attachments.death',
                        attachments
                      )
                    }
                    values={values.especial_cases.attachments?.death}
                  />
                </Box>
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.especial_cases?.reason_merge}
                  onChange={specialHandleChange}
                  name="especial_cases.reason_merge"
                  color="primary"
                />
              }
              label={t('SPECIAL_CASES_REASON_MERGE')}
              className={clsx(
                classes.chooserItem,
                values.especial_cases?.reason_merge &&
                  classes.chooserItemSelected
              )}
            />
            <FormControlLabel
              disabled={values.especial_cases?.reason_merge}
              control={
                <Checkbox
                  checked={values.especial_cases?.reason_electrodep}
                  onChange={specialHandleChange}
                  name="especial_cases.reason_electrodep"
                  color="primary"
                />
              }
              label={t('SPECIAL_CASES_REASON_ELECTRODEP')}
              className={clsx(
                classes.chooserItem,
                values.especial_cases?.reason_electrodep &&
                  classes.chooserItemSelected
              )}
            />
            {values.especial_cases?.reason_electrodep && (
              <>
                <Typography className={classes.attachmentTitle}>
                  {t('ELECTRODEP_ATTACH_MEDICAL')}
                </Typography>
                <Box mt={1} mb={1}>
                  <Uploader
                    fieldError={
                      errors.attachments &&
                      touched.attachments &&
                      errors.attachments
                    }
                    callbackFn={(attachments) =>
                      setFieldValue(
                        'especial_cases.attachments.medical',
                        attachments
                      )
                    }
                    values={values.especial_cases.attachments?.medical}
                  />
                </Box>
                <Typography className={classes.attachmentTitle}>
                  {t('ELECTRODEP_ATTACH_RESIDENT')}
                </Typography>
                <Box mt={1} mb={0}>
                  <Uploader
                    fieldError={
                      errors.attachments &&
                      touched.attachments &&
                      errors.attachments
                    }
                    callbackFn={(attachments) =>
                      setFieldValue(
                        'especial_cases.attachments.resident',
                        attachments
                      )
                    }
                    values={values.especial_cases.attachments?.resident}
                  />
                </Box>
              </>
            )}
          </FormGroup>
        </FormControl>
      </Box>
    </>
  )
}

export default SpecialCases
