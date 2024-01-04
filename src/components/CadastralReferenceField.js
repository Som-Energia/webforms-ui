import React from 'react';
import { checkCadastralReference } from '../services/api';
import MapIcon from '@material-ui/icons/Map';
import { useTranslation } from 'react-i18next';
import { ApiValidatedField } from './ApiValidatedField';

export function CadastralReferenceField(props) {
  const { t } = useTranslation();
  const { onChange, ...others } = props;
  function inputFilter(value) {
    if (!value) return value;
    value = value.replace(/[^0-9A-Za-z]/g, ''); // TODO: Do not cut chars after not matching one
    value = value.slice(0, 20);
    value = value.toUpperCase();
    value = [value.slice(0, 7), value.slice(7, 14), value.slice(14, 18), value.slice(18, 20)].join(' ');
    return value;
  }
  function localCheck(value) {
    return value.replaceAll(' ', '').length === 20;
  }
  function remoteCheck(value) {
    return checkCadastralReference(value)
      .then((response) => {
        return response?.state === true;
      })
      .catch((error) => {
        return !!error?.response?.data?.state;
      });
  }

  return (
    <ApiValidatedField
      {...others}
      leadingIcon={MapIcon}
      errorText={t('INVALID_CADASTRAL_REFERENCE_FORMAT')}
      inputFilter={inputFilter}
      localCheck={localCheck}
      remoteCheck={remoteCheck}
      onChange={onChange} />
  );
}
