import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import CadastralReference from '../../../../components/CadastralReference'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'

import { textCheckbox, textHeader4 } from '../../gurbTheme'

import TermsDialog from '../../components/TermsDialog'
import DragDrop from '../../../../components/DragDrop'
import CNAE from '../../../../components/CNAE'

const SupplyPointData = (props) => {
  const {
    activeStep,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched
  } = props

  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(true)
  }

  const handleAccept = () => {
    setOpen(false)
    setFieldValue('supply_point.supply_point_accepted', true)
  }

  const handleClose = () => {
    setOpen(false)
    setFieldValue('supply_point.supply_point_accepted', false)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CNAE {...props} />
      </Grid>
      <Grid item xs={12}>
        <CadastralReference {...props} />
      </Grid>
      <Grid item xs={12}>
        <DragDrop
          fieldName={t('ELECTRIC_BILL_UPLOAD')}
          textStyle={textHeader4}
          required={false}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          sx={{ ...textCheckbox, marginTop: '2rem' }}
          control={
            <Checkbox
              data-cy="supply_point_accepted"
              color="primary"
              onClick={handleClick}
              checked={values?.supply_point?.supply_point_accepted}
            />
          }
          label={
            <label
              dangerouslySetInnerHTML={{
                __html: t('FAIR_TITLE_LABEL')
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TermsDialog
          title={t('FAIR_TITLE')}
          open={open}
          onAccept={handleAccept}
          onClose={handleClose}
          maxWidth="sm">
          <span
            dangerouslySetInnerHTML={{ __html: t('PRIVACY_POLICY_SUPLYPOINT') }}
          />
        </TermsDialog>
      </Grid>
    </Grid>
  )
}
export default SupplyPointData
