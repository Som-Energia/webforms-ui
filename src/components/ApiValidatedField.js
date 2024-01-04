import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      color: 'rgba(0, 0, 0, 0.54)'
    }
  }
}))

export function ApiValidatedField({
  name, id, label, variant, value = '', onChange, onBlur, inputFilter, localCheck, remoteCheck, helperText, errorText, autoFocus = false, leadingIcon
}) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const { t } = useTranslation();

  const LeadingIcon = leadingIcon;
  const hasError = !!currentValue && !isValid;

  const handleChange = (event) => {
    let value = event.target.value;
    const formattedValue = inputFilter ? inputFilter(value) : value;
    setCurrentValue(formattedValue);
  };

  useEffect(() => {
    onChange({ value: currentValue, valid: false });
    if (!localCheck(currentValue)) {
      setIsValid(false);
      return;
    }
    setIsLoading(true);
    remoteCheck(currentValue).then((isOk) => {
      onChange({ value: currentValue, valid: isOk });
      setIsValid(isOk);
      setIsLoading(false);
    });
  }, [currentValue]);

  return (
    <>
      <TextField
        id={id}
        name={name}
        label={label}
        variant={variant}
        fullWidth
        required
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={hasError}
        helperText={hasError ? errorText ?? t('INVALID_FORMAT') : helperText}
        InputProps={{
          startAdornment: LeadingIcon && (
            <InputAdornment className={classes.icon} position="start">
              <LeadingIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && <CircularProgress size={24} />}
              {!isLoading && isValid && <CheckOutlinedIcon color="primary" />}
            </InputAdornment>
          )
        }} />
    </>
  );
}