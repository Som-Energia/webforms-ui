import React, { useEffect } from 'react'
import { checkCups } from '../services/api'
import SolarPowerIcon from '@mui/icons-material/WbSunny'
import { useTranslation } from 'react-i18next'
import ApiValidatedField from './NewApiValidatedField'
import { checkCAUWhileTyping, prettyCAU } from '../services/utils'

export function CAUField(props) {
  const { t } = useTranslation()

  function localCheck(value) {
    return checkCAUWhileTyping(value, t, props.cupsToMatch)
  }
  function remoteCheck(value) {
    return checkCups(value.replace(/ /g, '').slice(0, 20))
      .then((response) => {
        const valid = response?.state === true
        return { value, valid, error: valid ? undefined : t("CAU_INVALID_CONTROL_DIGIT") }
      })
      .catch((error) => {
        const valid = !!error?.response?.data?.state
        return { value, valid, error: valid ? undefined : t("CAU_INVALID_CONTROL_DIGIT") }
      })
  }

  useEffect(() => {
    if (props.value) {
      const result = localCheck(props.value)
      props.onChange({ ...result, valid: false })
    }
  }, [props.cupsToMatch])

  return (
    <ApiValidatedField
      {...props}
      leadingIcon={SolarPowerIcon}
      inputFilter={prettyCAU}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
    />
  )
}

export default CAUField
