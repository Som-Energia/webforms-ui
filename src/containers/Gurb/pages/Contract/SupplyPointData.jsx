import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import Box from '@mui/material/Box'
import TextRecomendation from '../../components/TextRecomendation'
import SomStepper from '../../components/SomStepper'
import CadastralReference from '../../components/CadastralReference'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { textCheckbox, textHeader4 } from '../../gurbTheme'

import TermsDialog from '../../components/TermsDialog'
import DragDrop from '../../components/DragDrop'

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
    <>
      <Box sx={{ marginTop: '2rem', marginBottom: '-2rem' }}>
        <TextRecomendation
          title={t('GURB_SUPPLY_POINT_DATA_TITLE')}
          text={t('GURB_SUPPLY_POINT_DATA_SUBTITLE')}
        />
        <SomStepper step={activeStep} connectors={7 + 1} />
      </Box>
      <CadastralReference {...props} />
      <DragDrop
        fieldName={t('GURB_ELECTRIC_BILL_UPLOAD')}
        textStyle={textHeader4}
        required={false}
      />
      <FormControlLabel
        sx={{ ...textCheckbox, marginTop: '2rem' }}
        control={
          <Checkbox
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
    </>
  )
}
export default SupplyPointData
