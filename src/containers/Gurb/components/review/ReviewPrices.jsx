import React from 'react'

import { useTranslation } from 'react-i18next'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

import ReviewField from './ReviewField'
import { textReviewLabel } from '../../gurbTheme'
import {
  iconRequirements,
  textHeader4
} from '../../gurbTheme'


const ReviewPricesTable = ({ reviewPrices, prices }) => {

  const { t } = useTranslation()

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

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
        {concept ? (
          <Grid
            container
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
            {keys.map((key, index) => (
              <Grid item key={index}>
                <ReviewField
                  label={`${labels[index]}:`}
                  value={`${concept[key]?.value} ${concept[key]?.unit}`}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>{t('UNAVAILABLE')}</>
        )}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2rem'
        }}>
        <LocalOfferOutlinedIcon sx={iconRequirements} />
        <Typography sx={textHeader4}>
          {t('GURB_REVIEW_PRICES_POWER_TITLE')}
        </Typography>
      </Box>
      <Grid container sx={{ marginLeft: '5rem' }}>
        {reviewPrices.map((detail, index) => {
          return (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              sx={{
                marginY: '1rem'
              }}>
              <Typography sx={textReviewLabel}>
                {t(detail.title)}
              </Typography>
              <Prices concept={prices?.[`${detail.field}`]} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ReviewPricesTable