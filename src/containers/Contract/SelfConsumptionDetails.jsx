import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import InputAdornment from '@mui/material/InputAdornment'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'

import Chooser from '../../components/Chooser'
import StepHeader from '../../components/StepHeader'
import Uploader from '../../components/Uploader'
import CAUField from '../../components/CAUField'

import {
  getSelfConsumptionSituations,
  getSelfConsumptionTechnologies
} from '../../services/api'

const SelfConsumptionDetails = (props) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    props
  const { t } = useTranslation()

  const handleCollectiveInstallation = ({ option }) => {
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
        setTechnologies(response?.data)
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
        setSituations(response?.data)
        setLoadingSituations(false)
      })
      .catch((error) => {
        console.error(error)
        setLoadingSituations(false)
      })
  }, [])

  return (
    <>
      <StepHeader title={t('SELFCONSUMPTION_DETAILS_TITLE')} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Chooser
            name="self_consumption.collective_installation"
            sx={{
              '& h6': {
                mb: 0
              },
              '& > div': {
                mt: 2
              },
              '& label': {
                pt: 1,
                pb: 1,
                minHeight: '90px',
                '& p': {
                  mt: 0
                }
              }
            }}
            question={t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_QUESTION')}
            onChange={handleCollectiveInstallation}
            value={props.values.self_consumption.collective_installation}
            options={[
              {
                id: 'individual',
                value: false,
                label: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_LABEL'),
                description: t('SELFCONSUMPTION_INDIVIDUAL_INSTALLATION_HELP')
              },
              {
                id: 'collective',
                value: true,
                label: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_LABEL'),
                description: t('SELFCONSUMPTION_COLLECTIVE_INSTALLATION_HELP')
              }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: t('SELFCONSUMPTION_CAU_CODE') }}
            sx={{
              fontWeight: 500,
              mb: 2
            }}
          />
          <CAUField
            required
            id="self_consumption_cau"
            name="self_consumption.cau"
            label={t('CAU')}
            variant="outlined"
            fullWidth
            values={values}
            value={values.self_consumption.cau}
            onChange={handleChangeCAU}
            disabled={props.values.self_consumption.collective_installation === undefined}
            onBlur={handleBlur}
            error={
              values?.self_consumption?.cau && !!errors?.self_consumption?.cau
            }
            helperText={
              errors?.self_consumption?.cau || (
                <a
                  href={t('SELFCONSUMPTION_CAU_HELP_URL')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('SELFCONSUMPTION_CAU_HELP')}
                </a>
              )
            }
            data={{
              'collective_installation': props.values.self_consumption.collective_installation,
              'cups': props.values.supply_point.cups,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('SELFCONSUMPTION_INSTALL_POWER_QUESTION')
            }}
            sx={{
              fontWeight: 500,
              mb: 2
            }}
          />
          <TextField
            required
            id="self_consumption_install_power"
            name="self_consumption.installation_power"
            label={t('SELFCONSUMPTION_INSTALL_POWER')}
            variant="outlined"
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">kWp</InputAdornment>
            }}
            value={values.self_consumption.installation_power}
            onChange={handleChangeInstallPower}
            onBlur={handleBlur}
            error={
              errors?.self_consumption?.installation_power &&
              touched?.self_consumption?.installation_power
            }
            helperText={
              (touched?.self_consumption?.installation_power &&
                errors?.self_consumption?.installation_power) || (
                <a
                  href={t('SELFCONSUMPTION_INSTALL_POWER_HELP_URL')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('SELFCONSUMPTION_INSTALL_POWER_HELP')}
                </a>
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('SELFCONSUMPTION_INSTALLATION_SITUATION_QUESTION')
            }}
            sx={{
              fontWeight: 500,
              mb: 2
            }}
          />
          <TextField
            select
            required
            id="self_consumption_installation_type"
            name="self_consumption.installation_type"
            label={t('SELFCONSUMPTION_INSTALLATION_SITUATION_QUESTION')}
            variant="outlined"
            fullWidth
            value={values?.self_consumption?.installation_type || ''}
            onChange={handleChangeInstallationType}
            onBlur={handleBlur}
            disabled={isLoadingSituations}
            error={
              errors?.self_consumption?.installation_type &&
              touched?.self_consumption?.installation_type
            }
            helperText={
              (touched?.self_consumption?.installation_type &&
                errors?.self_consumption?.installation_type) || (
                <a
                  href={t('SELFCONSUMPTION_INSTALLATION_SITUATION_HELP_URL')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('SELFCONSUMPTION_INSTALLATION_SITUATION_HELP')}
                </a>
              )
            }>
            {situations.map((situation) => (
              <MenuItem
                key={situation.id}
                value={situation.id}
                data-title={situation.name}>
                {t(situation.name)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('SELFCONSUMPTION_TECHNOLOGY_QUESTION')
            }}
            sx={{
              fontWeight: 500,
              mb: 2
            }}
          />
          <TextField
            select
            required
            id="self_consumption_technology"
            name="self_consumption.technology"
            label={t('SELFCONSUMPTION_TECHNOLOGY_QUESTION')}
            variant="outlined"
            fullWidth
            value={values?.self_consumption?.technology || ''}
            onChange={handleChangeTechnology}
            onBlur={handleBlur}
            disabled={isLoadingTechnologies}
            error={
              errors?.self_consumption?.technology &&
              touched?.self_consumption?.technology
            }
            helperText={
              (touched?.self_consumption?.technology &&
                errors?.self_consumption?.technology) || (
                <a
                  href={t('SELFCONSUMPTION_TECHNOLOGY_HELP_URL')}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t('SELFCONSUMPTION_TECHNOLOGY_HELP')}
                </a>
              )
            }>
            {technologies.map((technology) => (
              <MenuItem
                key={technology.id}
                value={technology.id}
                data-title={technology.name}>
                {t(technology.name)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Chooser
            name="self_consumption.aux_services"
            sx={{
              '& h6': {
                mb: 0
              },
              '& > div': {
                mt: 2
              },
              '& label': {
                pt: 1,
                pb: 1,
                minHeight: '90px',
                '& p': {
                  mt: 0
                }
              }
            }}
            question={t('SELFCONSUMPTION_DETAILS_QUESTION_AUXILIARY_SERVICE')}
            onChange={handleAuxiliaryService}
            value={props.values.self_consumption.aux_services}
            options={[
              {
                id: 'auxiliary-service-yes',
                value: true,
                label: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_YES_LABEL'),
                description: t(
                  'SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_YES_LABEL_DESCRIPTION'
                ),
                helper: (
                  <FormHelperText variant="outlined">
                    <a
                      href={t('SELFCONSUMPTION_AUXILIARY_SERVICE_HELP_URL')}
                      target="_blank"
                      technology
                      rel="noopener noreferrer">
                      {t('SELFCONSUMPTION_AUXILIARY_SERVICE_HELP')}
                    </a>
                  </FormHelperText>
                )
              },
              {
                id: 'auxiliary-service-no',
                value: false,
                label: t('SELFCONSUMPTION_DETAILS_AUXILIARY_SERVICE_NO_LABEL')
              }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: t('SELFCONSUMPTION_ATTACHMENTS')
            }}
            sx={{
              fontWeight: 500,
              mt: 2,
              mb: 2
            }}
          />

          <Uploader
            maxFiles={5}
            fieldError={
              errors?.self_consumption?.attachments &&
              touched?.self_consumption?.attachments &&
              errors?.self_consumption?.attachments
            }
            callbackFn={(attachments) =>
              setFieldValue('self_consumption.attachments', attachments)
            }
            values={values?.self_consumption?.attachments || []}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default SelfConsumptionDetails