import { useContext } from 'react'
import Link from '@mui/material/Link'
import ResultRequirement from './ResultRequirement'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import GurbErrorContext from '../../../context/GurbErrorContext'
import { link } from '../gurbTheme'

const SuccessRequirement = ({
  textHeader,
  textBody,
  textHelper,
  textHelperAction
}) => {
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  return (
    <ResultRequirement
      containerColors={{
        border: '1px solid #96B633',
        backgroundColor: '#F4F8EB'
      }}
      icon={<CheckCircleIcon sx={{ color: '#96B633', fontSize: '50px' }} />}
      textHeader={textHeader}
      textBody={textBody}
      textHelper={
        <Link
          data-cy='success_link'
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

export default SuccessRequirement
