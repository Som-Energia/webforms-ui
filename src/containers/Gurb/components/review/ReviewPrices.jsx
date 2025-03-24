import React from 'react'

import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import ReviewField from './ReviewField'
import { textReviewLabel } from '../../gurbTheme'
import { iconRequirements, textHeader4 } from '../../gurbTheme'
import useCheckMobileScreen from '../../../../services/checkMobileScreen'

const ReviewPricesTable = ({ reviewPrices, prices }) => {
  const { t } = useTranslation()
  const isMobile = useCheckMobileScreen()

  const Prices = ({ concept, name }) => {
    let keys = concept ? Object.keys(concept) : []
    keys.sort()

    const differentValues = new Set(
      Object.keys(concept).map((key) => concept[key]?.value)
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

    return concept ? (
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
    ) : (
      <>{t('UNAVAILABLE')}</>
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
            <Typography sx={textHeader4}>
              {t('GURB_REVIEW_PRICES_POWER_TITLE')}
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
                        <Typography sx={textReviewLabel}>
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