import React, { useCallback, useContext } from 'react'
import SectionTitle from './SectionTitle'
import GenerationAssigmentSection from './GenerationAssignmentSection'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import { Button, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenerationContext from '../context/GenerationContext'
import { useTranslation } from 'react-i18next'
import Alert from '@material-ui/lab/Alert'
import GenerationFailure from './GenerationFailure'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const useStyles = makeStyles({
  footer: {
    padding: '10px'
  },
  button: {
    background: '#96b633',
    color: '#fff'
  },
  altButton:{
    background: '#8E8C8C',
    color: '#fff'
  },
  buttons: {
    gap: '5px',
    justifyContent: 'center'
  },
  gripDivider: {
    margin: '50px 0 20px 0'
  },
  gripReminder: {
    margin: '20px 0 20px 0'
  }
})

function GenerationDashboard({
  editing,
  handleCancelButtonClick,
  validateChanges,
  validationConfirm,
  setValidationConfirm
}) {
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    editingPriority,
    assignments,
    investments,
    has_duplicate_priority_values
  } = useContext(GenerationContext)

  const ActionSection = useCallback(() => {
    return (
      <>
        {editingPriority ? (
          <Grid container>
            <Alert severity="warning" className={classes.gripReminder}>
              {t('GENERATION_INVESTMENTS_REMINDER_INFO_TEXT')}
            </Alert>
            <Grid item container className={classes.buttons}>
              <Button
                id="cancel-action-btn"
                variant="contained"
                className={classes.button}
                onClick={() => handleCancelButtonClick(false)}>
                {t('GENERATION_INVESTMENTS_CANCEL_BUTTON')}
              </Button>
              <Button
                id="validation-action-btn"
                variant="contained"
                className={classes.button}
                onClick={() => validateChanges()}>
                {t('GENERATION_INVESTMENTS_VALIDATE_BUTTON')}
              </Button>
            </Grid>
          </Grid>
        ) : null}
        {validationConfirm.finished && validationConfirm.completed ? (
          <Grid item container className={classes.buttons}>
            <Alert
              id="alert-success-message"
              severity="success"
              className={classes.gripReminder}
              onClose={() => setValidationConfirm(false)}>
              {t('GENERATION_INVESTMENTS_ASSIGNMENT_VALIDATION_SUCCESS')}
            </Alert>
          </Grid>
        ) : null}
      </>
    )
  }, [
    t,
    classes,
    editingPriority,
    setValidationConfirm,
    validationConfirm,
    handleCancelButtonClick,
    validateChanges
  ])

  return (
    <>
      {validationConfirm.finished && !validationConfirm.completed ? (
        <GenerationFailure />
      ) : (
        <>
          {!has_duplicate_priority_values() ? (
            <>
              <SectionTitle text={t('GENERATION_INVESTMENTS_TABLE_TITLE')} />
              <GenerationInvestmentSection data={investments} />
              <Grid item xs={12} className={classes.gripDivider}>
                <Alert severity="warning">
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: t('GENERATION_INVESTMENTS_HELPER_TEXT_1')
                    }}
                  />
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: t('GENERATION_INVESTMENTS_HELPER_TEXT_2')
                    }}
                  />
                </Alert>
              </Grid>
              <SectionTitle
                text={t('GENERATION_INVESTMENTS_ASSIGNMENTS_TABLE_TITLE')}
              />
              <GenerationAssigmentSection
                data={assignments}
                editing={editing}
              />
              <Grid
                className={classes.footer}
                container
                justifyContent="flex-end">
                <ActionSection />
              </Grid>
              <SectionTitle text={t('DADES DE PRODUCCIÓ I CONSUM')}>
                <Button
                  className={classes.altButton}
                  type="button"
                  id="generationkwh-id-production-consumption"
                  variant="contained"
                  onClick={()=> window.location.replace('/investments/production-consumption')}
                  endIcon={<ArrowForwardIosIcon />}>
                  {t('ENTRAR')}
                </Button>
              </SectionTitle>
            </>
          ) : (
            <Alert severity="warning">
              <Typography
                id="info-text-section"
                dangerouslySetInnerHTML={{
                  __html: t('GENERATION_INVESTMENTS_SAME_PRIORITY_INFO_TEXT')
                }}
              />
            </Alert>
          )}
        </>
      )}
    </>
  )
}

export default GenerationDashboard
