import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { DefaultTariff, Tariffs } from '../../data/tariff'
import { useTranslation } from 'react-i18next'
import { plausible } from '../../trackers/plausible'

function TariffSelector({ tariff, onSelectTariff = () => { } }) {
  const { t } = useTranslation()

  const handleClick = (tariffName) => {
    onSelectTariff(tariffName)
    plausible.trackEvent('IndexedTariffSelectorButton-' + tariffName)
  }

  const selectedTariff = tariff ?? DefaultTariff
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 6 }}
      justifyContent="center"
    >
      {Object.entries(Tariffs).map(([tariffKey, tariffName]) => (
        <Button
          variant="contained"
          key={tariffKey}
          data-cy={'button-' + tariffName}
          color={selectedTariff === tariffName ? 'primary' : 'secondary'}
          sx={{
            '@media (max-width:600px)': {
              maxWidth: '56%',
              marginLeft: '21% !important',
              marginBottom: '12px !important',
              width: 'auto',
              padding: '0.4em 0em 0.4em 0em',
              fontSize: '1rem',
            },
            '@media (min-width:600px)': {
              width: '150px',
              padding: '0.4em 0em 0.4em 0em',
            },
          }}
          onClick={() => handleClick(tariffName)}
        >
          {t('TARIFF_SELECTOR_' + tariffKey)}
        </Button>
      ))}
    </Stack>
  )
}

export default TariffSelector
