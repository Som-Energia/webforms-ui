import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import TermsDialog from '../../components/TermsDialog'
import VATField from '../../components/VATField'

const useStyles = makeStyles((theme) => ({
  chooserContainer: {
    '& h6': {
      fontSize: '1rem',
      marginTop: theme.spacing(2)
    }
  }
}))

const HolderIdentifier = (props) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { values, handleBlur, handleChange, errors, touched, setFieldValue, setFieldTouched } = props
  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('holder.legal_person_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('holder.legal_person_accepted', false)
  }

  const onChangeVAT = ({ vat, isPhisical, valid }) => {
    setFieldValue('holder.vat', vat)
    setFieldValue('holder.isphisical', isPhisical)
    setFieldValue('holder.vatvalid', valid)
    setFieldTouched('holder.vat', true)
  }

  const handleChangePreviousHolder = ({ option }) => {
    setFieldValue('holder.previous_holder', option)
  }

  return (
    <>
      <StepHeader title={t('HOLDER_IDENTIFIER_TITLE')} />
      <Typography variant="body1"
        dangerouslySetInnerHTML={{ __html: t('HOLDER_IDENTIFIER_DESC') }}
      />
      <Box mt={3} mb={3}>
        <VATField
          id="vat"
          name="holder.vat"
          label={t('VAT_LABEL')}
          variant="outlined"
          fullWidth
          required
          autoFocus={true}
          value={values?.holder?.vat}
          onChange={onChangeVAT}
          onBlur={handleBlur}
          error={(errors?.holder?.vat && touched?.holder?.vat) ||
            (touched?.holder?.vat && values?.holder?.vatvalid === false)
          }
          helperText={(touched?.holder?.vat && errors?.holder?.vat) ||
            (touched?.holder?.vat && errors?.holder?.vatvalid)
          }
        />
      </Box>

      {
        !values?.holder?.isphisical && values?.holder?.vatvalid && values?.holder.vat[0].toUpperCase().match(/([A-J]|[N-W])/i) &&
        <>
          <Box mt={1} mb={2} mx={1}>
            <FormControlLabel
              // disabled={!isActiveCups()}
              control={
                <Checkbox
                  id="legal_person_accepted"
                  color="primary"
                  name="legal_person_accepted"
                  onClick={handleClick}
                  checked={values?.holder?.legal_person_accepted}
                  value={true}
                />
              }
              label={t('LEGAL_PERSON_TITLE_LABEL')}
            />
          </Box>

          <TermsDialog
            title={t('LEGAL_PERSON_TITLE')}
            open={open}
            onAccept={handleAccept}
            onClose={handleClose}
            maxWidth="sm"
          >
            <span dangerouslySetInnerHTML={{ __html: t('PRIVACY_POLICY_LEGAL_PERSON') }} />
          </TermsDialog>
        </>
      }

      <Box mt={1} mb={1} className={classes.chooserContainer}>
        <Chooser
          question={t('PREVIOUS_HOLDER')}
          onChange={handleChangePreviousHolder}
          value={ values.contract.has_service === false ? false : values.holder.previous_holder}
          disabled={values.holder.vatvalid !== true || values.contract.has_service === false}
          options={[
            {
              value: true,
              label: t('PREVIOUS_HOLDER_YES_LABEL'),
              description: t('PREVIOUS_HOLDER_YES_DESC')
            },
            {
              value: false,
              label: t('PREVIOUS_HOLDER_NO_LABEL'),
              description: t('PREVIOUS_HOLDER_NO_DESC')
            }
          ]}
        />
      </Box>
    </>
  )
}

export default HolderIdentifier
