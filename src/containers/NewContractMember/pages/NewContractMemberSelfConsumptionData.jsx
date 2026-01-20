import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import {
  BatteryIcon,
  CommunityIcon,
  PersonalIcon
} from '../../../data/icons/Icons'
import CAUField from '../../../components/CAUField'
import Chooser from '../../../components/Chooser/Chooser'
import InputField from '../../../components/InputField/InputField'
import SelectField from '../../../components/SelectField/SelectField'
import InputTitle from '../../../components/InputTitle'
import AlertBox from '../../../components/AlertBox/AlertBox'
import { HelperText } from '../../../components/InputField/InputField'

import {
  getSelfConsumptionSituations,
  getSelfConsumptionTechnologies
} from '../../../services/api'

const INDIVIDUAL_INSTALLATION = '01'

const NewContractMemberSelfConsumptionData = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
  } = props

  const { t } = useTranslation()

  const handleCollectiveInstallation = (value) => {
    setFieldValue('self_consumption.collective_installation', value)
  }

  const handleAuxiliaryService = (value) => {
    setFieldValue('self_consumption.aux_services', value)
  }

  const handleChangeInstallPower = (event) => {
    const regex = /^\d*([.,'])?\d{0,3}/g

    const match = regex.exec(event.target.value)
    let result = match[0].replace(',', '.')
    result = result.replace("'", '.')

    setFieldValue(event.target.name, result)
  }

  const [situations, setSituations] = useState([])
  const [technologies, setTechnologies] = useState([])

  useEffect(() => {
    if (values?.self_consumption?.collective_installation == 'individual') {
      setFieldValue(
        'self_consumption.installation_type',
        INDIVIDUAL_INSTALLATION
      )
    } else {
      setFieldValue('self_consumption.installation_type', '')
    }
  }, [values?.self_consumption?.collective_installation])

  useEffect(() => {
    getSelfConsumptionTechnologies()
      .then((response) => {
        let technologies = {}
        response?.data.forEach((e) => (technologies[e.id] = t(e.name)))
        setTechnologies(technologies)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  useEffect(() => {
    getSelfConsumptionSituations()
      .then((response) => {
        let situations = {}
        response?.data.forEach((e) => (situations[e.id] = e.name))
        setSituations(situations)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const installation_type_options = [
    {
      id: 'individual',
      icon: <PersonalIcon />,
      textHeader: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_LABEL'),
      textBody: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_HELP')
    },
    {
      id: 'collective',
      icon: <CommunityIcon />,
      textHeader: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_LABEL'),
      textBody: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_HELP')
    }
  ]

  const aux_services_options = [
    {
      id: 'auxiliary-service-yes',
      icon: <BatteryIcon />,
      textHeader: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_YES_LABEL')
    },
    {
      id: 'auxiliary-service-no',
      icon: <BatteryIcon on={false} />,
      textHeader: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_NO_LABEL')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <AlertBox
              id="percent_value_error"
              description={t('SELFCONSUMPTION_RECOMMENDATION_TEXT')}
              severity={'warning'}
              variant={'body.md.regular'}
            />
            <Grid item xs={12}>
              <Typography variant="headline4.regular">
                {t('SELFCONSUMPTION_DETAILS_TITLE')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CAUField
          required
          id="self_consumption_cau"
          label={t('SELFCONSUMPTION_CAU_CODE')}
          name="self_consumption.cau"
          variant="outlined"
          fullWidth
          value={values?.self_consumption?.cau}
          setFieldValue={setFieldValue}
          values={values}
          onBlur={handleBlur}
          touched={touched?.self_consumption?.cau}
          error={errors?.self_consumption?.cau_valid || errors?.self_consumption?.cau}
          helperText={
            <a
              href={t('SELFCONSUMPTION_CAU_HELP_URL')}
              target="_blank"
              style={{ color: '#8C8C8C', textDecoration: 'underline' }}
              rel="noopener noreferrer">
              {t('SELFCONSUMPTION_CAU_HELP')}
            </a>
          }
        />
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_QUESTION')}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="collective_installation_question"
          options={installation_type_options}
          value={values?.self_consumption?.collective_installation}
          handleChange={handleCollectiveInstallation}
        />
      </Grid>
      <Grid item xs={12}>
        <InputField
          required={true}
          name={'self_consumption.installation_power'}
          textFieldName={t('SELFCONSUMPTION_INSTALL_POWER_QUESTION')}
          endAdornmentText={'kW'}
          handleChange={handleChangeInstallPower}
          handleBlur={handleBlur}
          touched={touched?.self_consumption?.installation_power}
          value={values?.self_consumption?.installation_power}
          error={errors?.self_consumption?.installation_power}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectField
          label={t('SELFCONSUMPTION_INSTALLATION_SITUATION_QUESTION')}
          value={values?.self_consumption?.installation_type}
          fieldName="self_consumption.installation_type"
          options={situations}
          required={true}
          disabled={
            values?.self_consumption?.collective_installation == 'individual'
          }
          {...props}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        {Object.keys(technologies).length > 0 ? (
          <SelectField
            label={t('SELFCONSUMPTION_TECHNOLOGY_QUESTION')}
            value={values?.self_consumption?.technology}
            fieldName="self_consumption.technology"
            options={technologies}
            required={true}
            {...props}
          />
        ) : (
          <div></div>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputTitle
          text={t('SELFCONSUMPTION_DETAILS_QUESTION_AUXILIARY_SERVICE')}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <Chooser
          name="aux_services_question"
          options={aux_services_options}
          value={values?.self_consumption?.aux_services}
          handleChange={handleAuxiliaryService}
        />
        <HelperText
          helperText={
            <a
              href={t('SELFCONSUMPTION_AUXILIARY_SERVICE_HELP_URL')}
              target="_blank"
              style={{ color: '#8C8C8C', textDecoration: 'underline' }}
              rel="noopener noreferrer">
              {t('SELFCONSUMPTION_AUXILIARY_SERVICE_HELP')}
            </a>
          }
        />
      </Grid>
    </Grid>
  )
}
export default NewContractMemberSelfConsumptionData
