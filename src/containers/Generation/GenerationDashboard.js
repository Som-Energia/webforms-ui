import React, { useCallback, useContext, useEffect } from 'react'
import SectionTitle from './SectionTitle'
import GenerationAssigmentSection from './GenerationAssignmentSection'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import { Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenerationContext from './context/GenerationContext'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import dayjs from 'dayjs'
import 'dayjs/locale/ca'
import 'dayjs/locale/es'

const useStyles = makeStyles({
  footer: {
    padding: '10px'
  },
  button: {
    background: '#96b633',
    color: '#fff'
  }
})

function GenerationDashboard({
  editing,
  handleCancelButtonClick,
  validateChanges,
  handleClick
}) {
  const { language } = useParams()
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const { assignments, investments } = useContext(GenerationContext)

  useEffect(() => {
    language && i18n.changeLanguage(language)
    language ? dayjs.locale(language) : dayjs.locale('es')
  }, [language, i18n])

  const ActionSection = useCallback(() => {
    return (
      <>
        {editing ? (
          <>
            <Button
              id="cancel-action-btn"
              variant="contained"
              className={classes.button}
              onClick={() => handleCancelButtonClick(false)}>
              {t('CANCELAR')}
            </Button>
            <Button
              id="validation-action-btn"
              variant="contained"
              className={classes.button}
              onClick={() => validateChanges()}>
              {t('VALIDATE_CHANGES')}
            </Button>
          </>
        ) : (
          <Button
            id="change-priority-btn"
            variant="contained"
            className={classes.button}
            onClick={() => handleClick(true)}>
            {t('CHANGE_PRIORITY')}
          </Button>
        )}
      </>
    )
  }, [
    t,
    editing,
    classes,
    handleClick,
    handleCancelButtonClick,
    validateChanges
  ])

  return (
    <>
      <SectionTitle text={t('GENERATION_INVESTMENTS_TABLE_TITLE')} />
      <GenerationInvestmentSection data={investments} />
      <SectionTitle text={t('GENERATION_ASSIGNMENTS_TABLE_TITLE')} />
      <GenerationAssigmentSection data={assignments} editing={editing} />
      <Grid className={classes.footer} container justifyContent="center">
        <ActionSection />
      </Grid>
    </>
  )
}

export default GenerationDashboard
