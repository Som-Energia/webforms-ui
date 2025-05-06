import { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined'

import CAUField from '../../components/CAUField'
import Chooser from '../../components/NewChooser'
import InputField from '../../components/InputField'
import SelectField from '../../components/SelectField'

import {
    getSelfConsumptionSituations,
    getSelfConsumptionTechnologies
  } from '../../services/api'

const NewContractMemberSelfConsumptionData = (props) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleBlur
  } = props

  const { t } = useTranslation()

  const handleCollectiveInstallation = ({ option }) => {
    console.log('option', option)
    setFieldValue('self_consumption.collective_installation', option)
  }

  const handleAuxiliaryService = ({ option }) => {
    setFieldValue('self_consumption.aux_services', option)
  }

  const handleChangeInstallationType = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }

  const handleChangeTechnology = (event) => {
    setFieldValue(event.target.name, event.target.value)
  }


  const handleChangeInstallPower = (event) => {
    const regex = /^\d*([.,'])?\d{0,3}/g

    const match = regex.exec(event.target.value)
    let result = match[0].replace(',', '.')
    result = result.replace("'", '.')

    setFieldValue(event.target.name, result)
  }

  const handleChangeCAU = (data) => {
    setFieldValue('self_consumption.cau', data.value)
    setFieldValue('self_consumption.cau_error', data.error)
  }

  const [situations, setSituations] = useState([])
  const [isLoadingSituations, setLoadingSituations] = useState(false)

  const [technologies, setTechnologies] = useState([])
  const [isLoadingTechnologies, setLoadingTechnologies] = useState(false)

  useEffect(() => {
    setLoadingTechnologies(true)
    getSelfConsumptionTechnologies()
      .then((response) => {
        let technologies = {}
        response?.data.forEach((e) => technologies[e.id] = e.name)
        setTechnologies(technologies)
        setLoadingTechnologies(false)
      })
      .catch((error) => {
        console.error(error)
        setLoadingTechnologies(false)
      })
  }, [])

  useEffect(() => {
    setLoadingSituations(true)
    getSelfConsumptionSituations()
      .then((response) => {
        let situations = {}
        response?.data.forEach((e) => situations[e.id] = e.name)
        setSituations(situations)
        setLoadingSituations(false)
      })
      .catch((error) => {
        console.error(error)
        setLoadingSituations(false)
      })
  }, [])

  const installation_type_options = [
    {
      id: 'individual',
      icon: <AccountCircleOutlinedIcon />,
      textHeader: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_LABEL'),
      textBody: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_HELP')
    },
    {
      id: 'collective',
      icon: <Diversity1OutlinedIcon />,
      textHeader: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_LABEL'),
      textBody: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_HELP')
    }
  ]

  const aux_services_options = [
    {
      id: 'auxiliary-service-yes',
      icon: <AccountCircleOutlinedIcon />,
      textHeader: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_YES_LABEL'),
      textBody: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_YES_LABEL_DESCRIPTION')
    },
    {
      id: 'auxiliary-service-no',
      icon: <Diversity1OutlinedIcon />,
      textHeader: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_NO_LABEL')
    }
  ]

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="headline3">{t('SELFCONSUMPTION_DATA_TITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">{t('SELFCONSUMPTION_DATA_SUBTITLE')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <CAUField
            required
            id="self_consumption_cau"
            name="self_consumption.cau"
            label={t('CAU')}
            variant="outlined"
            fullWidth
            values={values}
            value={values?.self_consumption?.cau}
            onChange={handleChangeCAU}
            onBlur={handleBlur}
            error={
              // Show error if any content or if the field is empty but has been visited
              (touched?.self_consumption?.cau || values.self_consumption?.cau) && !!errors?.self_consumption?.cau
            }
            helperText={
              // if empty field, show the helper message, not the error
              (!!values?.self_consumption?.cau && errors?.self_consumption?.cau) || (
                <a
                  href={t('SELFCONSUMPTION_CAU_HELP_URL')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('SELFCONSUMPTION_CAU_HELP')}
                </a>
              )
            }
            cupsToMatch={
              props.values?.self_consumption?.collective_installation?
                undefined:
                props.values.cups
            }
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
              name={'self_consumption.power'}
              required={true}
              textFieldName={t('GURB_CURRENT_POWER')}
              endAdornmentText={'kW'}
              handleChange={handleChangeInstallPower}
              handleBlur={handleBlur}
              touched={touched?.self_consumption?.power}
              value={values?.self_consumption?.power}
              error={errors?.self_consumption?.power}
              textFieldHelper={
                t('HELP_POPOVER_POWER')
              }
            />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectField
            label={t('SELFCONSUMPTION_INSTALLATION_SITUATION_QUESTION')}
            value={values?.self_consumption?.installation_type}
            fieldName="self_consumption.installation_type"
            options={situations}
            {...props}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectField
            label={t('SELFCONSUMPTION_TECHNOLOGY_QUESTION')}
            value={values?.self_consumption?.technology}
            fieldName="self_consumption.technology"
            options={technologies}
            {...props}
        />
      </Grid>
      <Grid item xs={12}>
            <Chooser
                name="aux_services_question"
                options={aux_services_options}
                value={values?.self_consumption?.aux_services}
                handleChange={handleAuxiliaryService}
            />
        </Grid>
    </Grid>
  )
}
export default NewContractMemberSelfConsumptionData
