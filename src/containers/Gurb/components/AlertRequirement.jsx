import { useContext } from 'react'
import Link from '@mui/material/Link'
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'
import ResultRequirement from './ResultRequirement'
import GurbErrorContext from '../../../context/GurbErrorContext'
import { link } from '../gurbTheme'

const AlertRequirement = ({
  textHeader,
  textBody,
  textHelper,
  textHelperAction
}) => {
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  return (
    <ResultRequirement
      containerColors={{
        border: '1px solid #ED961D',
        backgroundColor: '#FDF4E8'
      }}
      icon={<ReportProblemRoundedIcon sx={{ color: '#ED961D', fontSize: '50px' }} />}
      textHeader={textHeader}
      textBody={textBody}
      textHelper={
        <Link
          component="button"
          color="inherit"
          sx={link}
          onClick={() => {
            setError(false)
            setErrorInfo({})
            textHelperAction()
          }}>
          {textHelper}
        </Link>
      }
    />
  )
}

export default AlertRequirement
