import ResultRequirement from './ResultRequirement'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const SuccessRequirement = ({ textHeader, textBody, textHelper }) => {
  return (
    <ResultRequirement
      containerColors={{
        border: '1px solid #96B633',
        backgroundColor: '#F4F8EB'
      }}
      icon={
        <CheckCircleOutlineIcon sx={{ color: '#96B633', fontSize: '50px' }} />
      }
      textHeader={textHeader}
      textBody={textBody}
      textHelper={textHelper}
    />
  )
}

export default SuccessRequirement
