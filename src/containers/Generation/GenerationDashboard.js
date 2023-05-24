import React, { useCallback, useContext } from 'react'
import SectionTitle from './SectionTitle'
import GenerationAssigmentSection from './GenerationAssignmentSection'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import { Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenerationContext from './context/GenerationContext'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles({
  footer: {
    padding: '10px'
  },
  button: {
    background: '#96b633',
    color: '#fff'
  },
  buttons: {
    gap: '5px',
    justifyContent: 'center'
  }
})

function GenerationDashboard({
  editing,
  handleCancelButtonClick,
  validateChanges
}) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { editingPriority, assignments, investments } =
    useContext(GenerationContext)

  const ActionSection = useCallback(() => {
    return (
      <>
        {editingPriority ? (
          <Grid item container className={classes.buttons}>
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
          </Grid>
        ) : null}
      </>
    )
  }, [t, classes, editingPriority, handleCancelButtonClick, validateChanges])

  return (
    <>
      <SectionTitle text={t('GENERATION_INVESTMENTS_TABLE_TITLE')} />
      <GenerationInvestmentSection data={investments} />
      <SectionTitle text={t('GENERATION_ASSIGNMENTS_TABLE_TITLE')} />
      <GenerationAssigmentSection data={assignments} editing={editing} />
      <Grid className={classes.footer} container justifyContent="flex-end">
        <ActionSection />
      </Grid>
    </>
  )
}

export default GenerationDashboard
