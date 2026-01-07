import React from 'react'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import Chooser from '../../../components/Chooser'
import GenerationMemberIdFields from './GenerationMemberIdFields'
import GenerationNoMemberIdFields from './GenerationNoMemberIdFields'


const GenerationMemberIdentifier = (props) => {
  const { t } = useTranslation()
  
  const {
    values,
    errors,
    setFieldValue,
    resetForm,
    title = t('CONTRIBUTION')
  } = props

  const handleChooser = (event) => {
    resetForm()
    setFieldValue('member.is_member', !!event?.option)
  }

  return (
    <>
      <Typography
        component='h1'
        variant='h4'
      >
        {title}
      </Typography>
      
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: t('GENERATION_FORM_MEMBER_IDENTIFIER_DESC')
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
              id: 'member-choose-yes'
            },
            {
              value: false,
              label: t('CONTRIBUTION_MEMBER_NO'),
              id: 'member-choose-no'
            }
          ]}
        />
      </Box>

      {values?.member?.is_member ? (
        <Box id="box_member_identifier" mt={0} mb={2}>
          <Typography
            component="h3"
            variant='h6'
            dangerouslySetInnerHTML={{
              __html: t('CONTRIBUTION_MEMBER_INDENTIFIER')
            }}
          />

          <GenerationMemberIdFields {...props} />
        </Box>
      ) : (
        <>
          <GenerationNoMemberIdFields {...props} />
        </>
      )}
      {!values?.member?.has_generation_enabled_zone ? (
        <Grid id="grid_not_enabled_zone" container sx={{ gap: '1rem' }}>
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
              {!values?.member?.is_member ? (
                <Typography
                  variant="body1"
                  dangerouslySetInnerHTML={{
                    __html: t('GENERATION_CONTRIBUTION_NO_MEMBER_TO_MEMBER_FORM', {
                      url: t('GENERATION_CONTRIBUTION_MEMBER_FORM_URL')
                    })
                  }}
                />
              ) : null}
            </Alert>
          </Grid>
          {values?.member?.is_member ? (
            <Grid item>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_FORM_INFO_NOT_VALID_DATA_OF_PARTNER')
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      ) : null}

      {errors?.member?.has_generation_enabled_zone ? (
        <Grid id="grid_error_enabled_zone" container item>
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
