import React from 'react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next'
import SectionTitle from './SectionTitle'
import GenerationAssigmentSection from './GenerationAssignmentSection'
import GenerationInvestmentSection from './GenerationInvestmentSection'
import GenerationContext from '../context/GenerationContext'
import PopUpContext from '../../../context/PopUpContext'
import GenerationFailure from './GenerationFailure'
import ContractList from '../../../components/ClickableList';
import SimpleDialog from '../../../components/SimpleDialog';
import { addContractsToAssignments } from '../../../services/api'
import Loading from '../../../components/NewLoading'
import CustomDialog from '../../../components/CustomDialog'
import GenerationTable from './GenerationTable'


function GenerationDashboard({
  editing,
  handleCancelButtonClick,
  validateChanges,
  validationConfirm,
  setValidationConfirm
}) {

  const { t } = useTranslation()
  const {
    editingPriority,
    assignments,
    investments,
    outsideAssignments,
    has_duplicate_priority_values,
    getAssingments,
    getContractsToAssign,
    contractNoAssignments
  } = React.useContext(GenerationContext)

  const { setContent } = React.useContext(PopUpContext)
  const [loading, setLoading] = React.useState(false)

  const ActionSection = React.useCallback(() => {
    return (
      <>
        {editingPriority ? (
          <Grid container>
            <Alert severity="warning" sx={{ margin: '20px 0 20px 0' }} >
              {t('GENERATION_INVESTMENTS_REMINDER_INFO_TEXT')}
            </Alert>
            <Grid item container sx={{
              gap: '5px',
              justifyContent: 'center'
            }}>
              <Button
                id="cancel-action-btn"
                variant="contained"
                sx={{
                  backgroundColor: 'primary.extraLight',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.extraLight',
                    backgroundColor: 'primary.main',
                  }
                }}
                onClick={() => handleCancelButtonClick(false)}>
                {t('GENERATION_INVESTMENTS_CANCEL_BUTTON')}
              </Button>
              <Button
                id="validation-action-btn"
                variant="contained"
                sx={{
                  backgroundColor: 'primary.extraLight',
                  color: 'primary.main',
                  '&:hover': {
                    color: 'primary.extraLight',
                    backgroundColor: 'primary.main',
                  }
                }}
                onClick={() => validateChanges()}>
                {t('GENERATION_INVESTMENTS_VALIDATE_BUTTON')}
              </Button>
            </Grid>
          </Grid>
        ) : null}
        {validationConfirm.finished && validationConfirm.completed ? (
          <Grid item container sx={{
            gap: '5px',
            justifyContent: 'center'
          }}>
            <Alert
              id="alert-success-message"
              severity="success"
              sx={{ margin: '20px 0 20px 0' }}
              onClose={() => setValidationConfirm(false)}>
              {t('GENERATION_INVESTMENTS_ASSIGNMENT_VALIDATION_SUCCESS')}
            </Alert>
          </Grid>
        ) : null}
      </>
    )
  }, [
    t,
    editingPriority,
    setValidationConfirm,
    validationConfirm,
    handleCancelButtonClick,
    validateChanges
  ])

  React.useEffect(() => {
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
        <Grid sx={{backgroundColor: 'background.third'}}>
        {(investments.length === 0 && outsideAssignments.length === 0) ?
          (
            <Typography
              variant="body1"
              id='not-has-invoices-text'
              dangerouslySetInnerHTML={{
                __html: t('GENERATION_INFO_NOT_HAS_INVOICES')
              }}
            />
          )
          : (!has_duplicate_priority_values() ? (
            <>
              <SectionTitle text={t('GENERATION_INVESTMENTS_TABLE_TITLE')} />
              <GenerationInvestmentSection data={investments} />
              <Grid item xs={12} sx={{ margin: '50px 0 20px 0' }}>
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
                  sx={{
                    backgroundColor: 'primary.extraLight',
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.extraLight',
                      backgroundColor: 'primary.main',
                    }
                  }}
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
                sx={{ padding: '10px' }}
                container
                justifyContent="flex-end">
                <ActionSection />
              </Grid>
              <SectionTitle text={t('GENERATION_INVESTMENTS_OUTSIDE_ASSIGNMENTS_TABLE_TITLE')} />
              <GenerationTable
                id="outside-assignments-table"
                columns={[
                  t('GENERATION_ASSIGNMENTS_TABLE_TTILE_N_CONTRACT'),
                  t('ADDRESS'),
                  t('GENERATION_INVESTMENTS_TABLE_TTILE_CONTRACT_HOLDER'),
                ]}
                rows={outsideAssignments} />
              <Grid
                sx={{ padding: '10px' }}
                container
                justifyContent="flex-end">
              </Grid>
              <SectionTitle text={t('GENERATION_INVESTMENTS_LINK_TO_PROD_CONSUMPTION')}>
                <Button
                  sx={{
                    backgroundColor: 'primary.extraLight',
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.extraLight',
                      backgroundColor: 'primary.main',
                    }
                  }}
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
          ))}
        </Grid>
      )}
    </>
  )
}

export default GenerationDashboard
