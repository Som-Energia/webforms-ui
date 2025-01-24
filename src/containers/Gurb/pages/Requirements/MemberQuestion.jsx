import { useTranslation } from 'react-i18next'

import TextRecomendation from '../../components/TextRecomendation'
import Chooser from '../../components/Chooser'
import { HelperText } from '../../components/InputField'

import Groups2Icon from '@mui/icons-material/Groups2'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'

import { iconRequirements, iconOffRequirements } from '../../gurbTheme'

const MemberQuestion = (props) => {
  const { values, setFieldValue } = props
  const { t } = useTranslation()

  const handleMemberQuestion = (value) => {
    setFieldValue('has_member', value)
  }
  const options = [
    {
      id: 'member-on',
      icon: <Groups2Icon sx={iconRequirements} />,
      textHeader: t('GURB_HAS_MEMBER'),
      textBody: t('GURB_HAS_MEMBER_BODY')
    },
    {
      id: 'member-off',
      icon: <Groups2Icon sx={iconOffRequirements} />,
      textHeader: t('GURB_HAS_NO_MEMBER'),
      textBody: t('GURB_HAS_NO_MEMBER_BODY')
    },
    {
      id: 'apadrinating',
      icon: <HandshakeOutlinedIcon sx={iconRequirements} />,
      textHeader: t('GURB_APADRINATING'),
      textBody: t('GURB_APADRINATING_BODY'),
      helper: (
        <HelperText
          helperText={t('GURB_APADRINATING_HELPER')}
          iconHelper={true}
        />
      )
    }
  ]

  return (
    <>
      <TextRecomendation title={t('GURB_HAS_MEMBER_TITLE')} required={true} />
      <Chooser
        options={options}
        value={values.has_member}
        handleChange={handleMemberQuestion}
      />
    </>
  )
}

export default MemberQuestion
