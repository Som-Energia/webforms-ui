import ResultRequirement from './ResultRequirement'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

const FailureRequirement = ({ textHeader, textBody, textHelper }) => {
  return (
    <ResultRequirement
      containerColors={{
        border: '1px solid #EE4949',
        backgroundColor: '#FDEDED'
      }}
      icon={<CancelOutlinedIcon sx={{ color: '#EE4949', fontSize: '50px' }} />}
      textHeader={textHeader}
      textBody={textBody}
      textHelper={textHelper}
    />
  )
}

export default FailureRequirement
