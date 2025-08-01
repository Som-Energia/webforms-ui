import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import CadastralReference from '../../components/CadastralReference'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

import TermsDialog from '../../components/TermsDialog'
import DragDrop from '../../components/DragDrop'
import CNAE from '../../components/CNAE'
import AddressField from '../../components/AddressField'
import { useTheme } from '@mui/material/styles'

const NewContractMemberSupplyPointData = (props) => {
  const trackID = 'supply-point-data'
  const {
    values,
    setFieldValue,
    sendTrackEvent
  } = props

  useEffect(() => {
    sendTrackEvent(trackID)
  }, [])

  const theme = useTheme()

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
        <Grid item xs={12}>
          <Typography variant="headline4.regular">
            {t('SUPPLY_POINT_DATA_TITLE')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body.sm.regular" color="secondary.extraDark">
            {t('RECOMMENDATION_SUBTITLE')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <AddressField
          addressFieldName="supply_point_address"
          addressLabel={t('ADDRESS')}
          {...props}
        />
      </Grid>
      <Grid item xs={12}>
        <CNAE {...props} />
      </Grid>
      <Grid item xs={12}>
        <CadastralReference {...props} />
      </Grid>
      <Grid item xs={12}>
        <DragDrop
          fieldName={ values?.has_light === 'light-on'
            ? t('ELECTRIC_BILL_UPLOAD')
            : t('MEMBER_DOCUMENTATION_UPLOAD')
          }
          textStyle={'body.md.regular'}
          required={false}
          values={values.supply_point.attachments}
          onChange={(fileHash) =>
            setFieldValue('supply_point.attachments', fileHash)
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              data-cy="supply_point_accepted"
              color="primary"
              onClick={handleClick}
              checked={values?.supply_point?.supply_point_accepted}
            />
          }
          label={
            <span>
              {t('FAIR_TITLE_LABEL')}
              <span style={{ color: theme.palette.primary2.main, marginLeft: 4 }}>*</span>
            </span>
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
export default NewContractMemberSupplyPointData