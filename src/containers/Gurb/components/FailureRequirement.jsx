import { useContext } from 'react'
import Link from '@mui/material/Link'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ResultRequirement from './ResultRequirement'
import GurbErrorContext from '../../../context/GurbErrorContext'
import { link } from '../../../themes/gurbTheme'

const FailureRequirement = ({
  textHeader,
  textBody,
  textHelper,
  textHelperAction
}) => {
  const { setError, setErrorInfo } = useContext(GurbErrorContext)
  return (
    <ResultRequirement
      containerColors={{
        border: '1px solid #EE4949',
        backgroundColor: '#FDEDED'
      }}
      icon={<CancelOutlinedIcon sx={{ color: '#EE4949', fontSize: '50px' }} />}
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

export default FailureRequirement
