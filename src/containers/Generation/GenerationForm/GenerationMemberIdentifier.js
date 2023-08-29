import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab'
import { Grid, Typography } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import StepHeader from '../../../components/StepHeader'
import Chooser from '../../../components/Chooser'
import GenerationMemberIdFields from './GenerationMemberIdFields'
import VATField from '../../../components/VATField'

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1rem',
    marginTop: '16px',
    fontWeight: 500
  },
  titleWithMargin: {
    marginBottom: theme.spacing(1)
  },
  titleWithMarginPlus: {
    marginBottom: theme.spacing(3)
  }
}))

const GenerationMemberIdentifier = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const {
    values,
    handleBlur,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    resetForm,
    title = t('CONTRIBUTION')
  } = props

  const handleChooser = (event) => {
    resetForm()
    setFieldValue('member.is_member', !!event?.option)
  }

  const onChangeVAT = (params) => {
    const { vat, isPhisical, valid } = params
    setFieldValue('member.isphisical', isPhisical, false)
    setFieldValue('member.vatvalid', valid, false)
    setFieldValue('member.exists', false, false)
    setFieldValue('member.vat', vat)
    if (vat !== '') {
      setFieldTouched('member.vat', true)
    }
  }

  return (
    <>
      <StepHeader title={title} />
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('GENERATION_FORM_CONTRIBUTION_MEMBER_IDENTIFIER_DESC')
        }}
      />
      <Box pt={0} mb={1}>
        <Chooser
          question={t('CONTRIBUTION_MEMBER_QUESTION')}
          onChange={handleChooser}
          condensed={true}
          value={values?.member?.is_member}
          canBeEmpty={false}
          options={[
            {
              value: true,
              label: t('CONTRIBUTION_MEMBER_YES'),
              id: 'member_choose_yes'
            },
            {
              value: false,
              label: t('CONTRIBUTION_MEMBER_NO'),
              id: 'member_choose_no'
            }
          ]}
        />
      </Box>

      {values?.member?.is_member ? (
        <Box id="box_member_identifier" mt={0} mb={2}>
          <Typography
            variant="h6"
            className={`${classes.title} ${classes.titleWithMargin}`}
            dangerouslySetInnerHTML={{
              __html: t('CONTRIBUTION_MEMBER_INDENTIFIER')
            }}
          />

          <GenerationMemberIdFields {...props} />
        </Box>
      ) : (
        <>
          <Box id="box_no_member_identifier" mt={0} mb={2}>
            <Typography
              variant="h6"
              className={`${classes.title} ${classes.titleWithMarginPlus}`}
              dangerouslySetInnerHTML={{
                __html: t('CONTRIBUTION_MEMBER_VAT')
              }}
            />
            <Box id="box_no_member_vat_input" mt={2} mb={1}>
              <VATField
                id="vat"
                name="member.vat"
                label={t('VAT_LABEL')}
                variant="outlined"
                fullWidth
                required
                value={values?.member?.vat}
                onChange={onChangeVAT}
                onBlur={handleBlur}
                error={
                  (errors?.member?.vat && touched?.member?.vat) ||
                  (touched?.member?.vat &&
                    values?.member?.vatvalid === false) ||
                  (touched?.member?.vat && values?.member?.exists === true)
                }
                helperText={
                  (touched?.member?.vat && errors?.member?.vat) ||
                  (touched?.member?.vat && errors?.member?.vatvalid) ||
                  (touched?.member?.vat && errors?.member?.exists)
                }
              />
            </Box>
          </Box>
          <Box mt={0} mb={2}>
            <Alert severity="warning">
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('CONTRIBUTION_MEMBER_WARNING')
                }}
              />
            </Alert>
          </Box>
        </>
      )}
      {!values?.member?.has_generation_enabled_zone ? (
        <Grid id="grid_not_enabled_zone" container style={{ gap: '1rem' }}>
          <Grid item>
            <Alert severity="warning">
              <AlertTitle>
                {t('GENERATION_FORM_INFO_ZONE_NOT_ENABLED_TITLE')}
              </AlertTitle>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_FORM_INFO_ZONE_NOT_ENABLED_TEXT', {
                    url: t('GENERATION_FORM_HELP_CENTER_URL')
                  })
                }}
              />
              {}
            </Alert>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: t('GENERATION_FORM_INFO_NOT_VALID_DATA_OF_PARTNER')
              }}
            />
          </Grid>
        </Grid>
      ) : null}

      {errors?.member?.has_generation_enabled_zone ? (
        <Grid id="grid_error_enabled_zone" container item >
            <Alert severity="warning">
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED')
                }}
              />
            </Alert>
        </Grid>
      ) : null}
    </>
  )
}

export default GenerationMemberIdentifier
