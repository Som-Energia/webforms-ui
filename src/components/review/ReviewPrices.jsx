import React from 'react'

import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import ReviewField from './ReviewField'
import { iconRequirements } from '../../themes/commonStyles'
import useCheckMobileScreen from '../../services/checkMobileScreen'

const ReviewPricesTable = ({ reviewPrices, prices }) => {
  const { t } = useTranslation()
  const isMobile = useCheckMobileScreen()

  const Prices = ({ concept, name }) => {
    if (!concept) {
      return <>{t('UNAVAILABLE')}</>
    }
    const keys = Object.keys(concept).sort()

    const differentValues = new Set(
      keys.map((key) => concept[key]?.value)
    )
    if (differentValues.size === 1) {
      for (const key in concept) {
        return (
          <ReviewField
            label={`${name}`}
            value={`${concept[key]?.value} ${concept[key]?.unit}`}
          />
        )
      }
    }
    const labels =
      keys.length === 2
        ? [t('PEAK'), t('VALLEY')]
        : keys.length === 3
        ? [t('PEAK'), t('FLAT'), t('VALLEY')]
        : keys

    return (
      <Grid container spacing={0}>
        {keys.map((key, index) => (
          <Grid item key={index} xs={12}>
            <ReviewField
              label={`${labels[index]}:`}
              value={`${concept[key]?.value} ${concept[key]?.unit}`}
            />
          </Grid>
        ))}
      </Grid>
    )
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={2} sm={1}>
        <LocalOfferOutlinedIcon sx={iconRequirements} />
      </Grid>
      <Grid item xs={10} sm={11}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="headline4.bold">
              {t('REVIEW_PRICES_POWER_TITLE')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container rowSpacing={4}>
              {reviewPrices.map((detail, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      padding: isMobile || index % 2 == 0 ? '0px' : '2rem'
                    }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="body.sm.regular">
                          {t(detail.title)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Prices concept={prices?.[`${detail.field}`]} />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ReviewPricesTable