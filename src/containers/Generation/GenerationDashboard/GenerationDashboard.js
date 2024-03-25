import React, { useCallback, useContext, useState, useEffect } from 'react'
import SectionTitle from './SectionTitle'
import GenerationAssigmentSection from './GenerationAssignmentSection'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import { Button, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import GenerationContext from '../context/GenerationContext'
import PopUpContext from '../../../context/PopUpContext'
import { useTranslation } from 'react-i18next'
import Alert from '@material-ui/lab/Alert'
import GenerationFailure from './GenerationFailure'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import AddIcon from '@material-ui/icons/Add';
import ContractList from '../../../components/ClickableList';
import SimpleDialog from '../../../components/SimpleDialog';
import { addContractsToAssignments } from '../../../services/api'
import Loading from 'components/Loading'
import CustomDialog from 'components/CustomDialog'

const useStyles = makeStyles({
  footer: {
    padding: '10px'
  },
  button: {
    background: '#96b633',
    color: '#fff'
  },
  altButton: {
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
    has_duplicate_priority_values,
    getAssingments,
    getContractsToAssign,
    contractNoAssignments
  } = useContext(GenerationContext)

  const { setContent } = useContext(PopUpContext)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    getContractsToAssign()
  }, [])


  const addContracts = async (ids) => {
    try {
      setLoading(true)
      setContent(<CustomDialog withBackground={false} blockHandleClose={true}><Loading /></CustomDialog>)
      await addContractsToAssignments(ids)
      await getContractsToAssign()
      setLoading(false)
      getAssingments()
    }
    catch (e) {
      console.log(e)
    }
    setContent(undefined)
  }

  const contractListDialog = () => {

    const dataList = contractNoAssignments.map(element => ({ id: element.id, primary: element.contract, secondary: element.contract_address }))
    if (contractNoAssignments.length === 0) {
      setContent(
        <SimpleDialog text={<Typography dangerouslySetInnerHTML={{ __html: t('GENERATION_ADD_ASSIGNMENTS_INFO_NO_CONTRACTS_TEXT') }} />} acceptFunction={() => setContent(undefined)} />
      )
    } else {
      setContent(
        <CustomDialog withBackground={true} ><ContractList data={dataList} title={t('GENERATION_ADD_CONTRACT_LIST_TITLE')} acceptFunction={addContracts} cancelFunction={() => setContent(undefined)} acceptButtonText={t('GENERATION_ADD_CONTRACT_LIST_VALIDATE_CHANGES')} cancelButtonText={t('GENERATION_ADD_CONTRACT_LIST_CANCEL')} /></CustomDialog>
      )
    }

  }


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
              <SectionTitle text={t('GENERATION_INVESTMENTS_ASSIGNMENTS_TABLE_TITLE')}>
                {investments.length > 0 ? <Button
                  className={classes.altButton}
                  disabled={loading}
                  type="button"
                  id="generationkwh-id-add-assignment"
                  variant="contained"
                  onClick={() => contractListDialog()}
                  endIcon={<AddIcon />}>
                  {t('GENERATION_BUTTON_ADD_ASSIGNMENT')}
                </Button> : null}
              </SectionTitle>
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
              <SectionTitle text={t('GENERATION_INVESTMENTS_LINK_TO_PROD_CONSUMPTION')}>
                <Button
                  className={classes.altButton}
                  type="button"
                  id="generationkwh-id-production-consumption"
                  variant="contained"
                  onClick={() => window.location.replace('/investments/production-consumption')}
                  endIcon={<ArrowForwardIosIcon />}>
                  {t('GENERATION_BUTTON_ACCESS_PRODUCTION_CONSUMPTION')}
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
