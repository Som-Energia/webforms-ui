import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Typography from '@mui/material/Typography'

import StepHeader from 'components/StepHeader'
import Uploader from 'components/Uploader'

const SpecialCases = (props) => {
  const { t } = useTranslation()
  const { values, errors, touched, setFieldValue } = props

  const getChooserStyles = (selected) => {
    const customChooserStyles = {
      chooserItem: {
        display: 'block',
        cursor: 'pointer',
        pt: 2,
        pb: 2,
        pr: 3,
        pl: 3,
        margin: '1px 1px 9px 1px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        '&:not(.Mui-disabled):hover': {
          border: '1px solid rgba(0, 0, 0, 0.87)',
          backgroundColor: 'rgba(0, 0, 0, 0.03)'
        },
        height: '100%'
      },
      chooserItemSelected: {
        border: '2px solid #96b633',
        backgroundColor: 'rgba(150, 182, 51, 0.08)',
        margin: '0 0 8px 0',
        '&:not(.Mui-disabled):hover': {
          border: '2px solid #96b633',
          backgroundColor: 'rgba(150, 182, 51, 0.08)'
        },
        '& span:last-child': {
          fontWeight: 'bold',
          opacity: '0.75'
        }
      }
    }

    let customChooserStylesArray = []
    customChooserStylesArray.push(customChooserStyles.chooserItem)
    selected &&
      customChooserStylesArray.push(customChooserStyles.chooserItemSelected)
    return customChooserStylesArray
  }

  const specialHandleChange = (event) => {
    if (event.target.name === 'especial_cases.reason_death') {
      setFieldValue('especial_cases.reason_default', false, false)
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
      setFieldValue('especial_cases.reason_default', false, false)
      setFieldValue('especial_cases.reason_electrodep', false, false)
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
      setFieldValue('especial_cases.reason_default', false, false)
      if (values.especial_cases.reason_electrodep === true) {
        setFieldValue('especial_cases.attachments.medical', [], false)
        setFieldValue('especial_cases.attachments.resident', [], false)
      }
      setFieldValue(
        'especial_cases.reason_electrodep',
        !values.especial_cases.reason_electrodep,
        true
      )
    } else {
      setFieldValue('especial_cases', {
        ...values.especial_cases,
        reason_default: true,
        reason_death: false,
        reason_merge: false,
        reason_electrodep: false,
        attachments: {
          death: [],
          merge: [],
          medical: [],
          resident: []
        }
      })
    }
  }

  return (
    <>
      <StepHeader title={t('SPECIAL_CASES_TITLE')} />
      <Box className="step-body">
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.especial_cases?.reason_default}
                  onChange={specialHandleChange}
                  name="especial_cases.reason_default"
                  color="primary"
                />
              }
              label={t('SPECIAL_CASES_REASON_DEFAULT')}
              sx={getChooserStyles(values.especial_cases?.reason_default)}
            />
            <Box mt={1} mb={3}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('SPECIAL_CASES_QUESTION')
                }}
              />
            </Box>
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
              sx={getChooserStyles(values.especial_cases?.reason_death)}
            />
            {values.especial_cases?.reason_death && (
              <>
                <Typography sx={{ pl: 1 }}>{t('CERT_ATTACH_DEATH')}</Typography>
                <Box mt={1} mb={2}>
                  <Uploader
                    fieldError={
                      errors.attachments &&
                      touched.attachments &&
                      errors.attachments
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
              sx={getChooserStyles(values.especial_cases?.reason_merge)}
            />
            {values.especial_cases?.reason_merge && (
              <>
                <Typography sx={{ pl: 1 }}>{t('CERT_ATTACH_MERGE')}</Typography>
                <Box mt={1} mb={2}>
                  <Uploader
                    fieldError={
                      errors.attachments &&
                      touched.attachments &&
                      errors.attachments
                    }
                    callbackFn={(attachments) =>
                      setFieldValue(
                        'especial_cases.attachments.merge',
                        attachments
                      )
                    }
                    values={values.especial_cases.attachments?.merge}
                  />
                </Box>
              </>
            )}
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
              sx={getChooserStyles(values.especial_cases?.reason_electrodep)}
            />
            {values.especial_cases?.reason_electrodep && (
              <>
                <Typography sx={{ pl: 1 }}>
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
                <Typography sx={{ pl: 1 }}>
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
