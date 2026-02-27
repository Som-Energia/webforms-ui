import { describe, expect, it } from 'vitest'
import {
  computeTotals,
  getPricesForPeriod,
  transformIndexedTariffPrices,
  dayIsMissing,
  weekTimeInterval,
  computeMaxYAxisValue,
  computeMinYAxisValue,
} from './indexedTariffs.utils'

describe('Indexed tariffs utils', () => {

  describe('getPricesForPeriod', () => {

    describe('when single day requested', () => {
      it('returns single day prices', () => {
        const a_valid_price = 0.1
        const totalPrices = 408
        const prices = Array.from({ length: totalPrices }, () => a_valid_price)
        const limit_date = new Date('2024-03-20T00:00:00')
        const selected_day = new Date('2024-03-20T00:00:00')

        const prices_data = getPricesForPeriod(limit_date, selected_day, prices)

        const totalDayHours = 24
        expect(prices_data.length).toBe(totalDayHours)
      })
    })

    describe('when first summer day requested', () => {
      it('returns first summer day prices', () => {
        const a_valid_price = 0.1
        const totalPrices = 408
        const prices = Array.from({ length: totalPrices }, () => a_valid_price)
        const limit_date = new Date('2024-03-31T00:00:00')
        const selected_day = new Date('2024-03-31T00:00:00')

        const prices_data = getPricesForPeriod(limit_date, selected_day, prices)

        const totalDayHours = 23
        expect(prices_data.length).toBe(totalDayHours)
      })
    })

    describe('when first winter day requested', () => {
      it('returns first winter day prices', () => {
        const a_valid_price = 0.1
        const totalPrices = 408
        const prices = Array.from({ length: totalPrices }, () => a_valid_price)
        const limit_date = new Date('2023-10-29T00:00:00')
        const selected_day = new Date('2023-10-29T00:00:00')

        const prices_data = getPricesForPeriod(limit_date, selected_day, prices)

        const totalDayHours = 25
        expect(prices_data.length).toBe(totalDayHours)
      })
    })

    describe('when one week is requested', () => {
      it('returns one week prices', () => {
        const a_valid_price = 0.1
        const totalPrices = 408
        const prices = Array.from({ length: totalPrices }, () => a_valid_price)
        const limit_date = new Date('2024-03-06T00:00:00')
        const selected_day = new Date('2024-03-14T00:00:00')

        const prices_data = getPricesForPeriod(limit_date, selected_day, prices)

        expect(prices_data.length).toBe(168)
      })
    })
  })

  describe('computeTotals', () => {

    describe('happy path', () => {

      describe('when one week prices is requested', () => {
        it('returns computation of the prices', () => {
          const a_valid_price = 0.1
          const prices = Array.from({ length: 407 }, () => a_valid_price)
          const expectedtotalPrices = {
            AVERAGE: '0,100000',
            BASE_DAYS_COMPUTATION: 7,
            MAX: '0,100000',
            MIN: '0,100000',
            WEEKLY_AVERAGE: '0,100000',
          }
          expect(computeTotals('2024-03-03', '2024-03-10', prices)).toStrictEqual(
            expectedtotalPrices,
          )
        })
      })
    })

    describe('validations', () => {
      const expectedEmptyTotalPrices = {
        AVERAGE: '0',
        BASE_DAYS_COMPUTATION: '0',
        MAX: '0',
        MIN: '0',
        WEEKLY_AVERAGE: '0',
      }

      describe('when prices is an empty array', () => {
        it('returns the same prices array', () => {
          expect(computeTotals('', '', [])).toStrictEqual(expectedEmptyTotalPrices)
        })
      })

      describe('when date params are empty', () => {
        it('returns the same prices array', () => {
          expect(computeTotals('', '', [])).toStrictEqual(expectedEmptyTotalPrices)
        })
      })

      describe('when selectedDate is older than fromDate', () => {
        it('returns the same prices array', () => {
          const aValidPrice = 0.23
          expect(computeTotals('2024-03-20', '2024-03-19', [aValidPrice])).toStrictEqual(
            expectedEmptyTotalPrices,
          )
        })
      })

      describe('when selectedDate minus 7 days is older than firstDate', () => {
        it('returns the same prices array', () => {
          const aValidPrice = 0.23
          expect(computeTotals('2024-03-20', '2024-03-19', [aValidPrice])).toStrictEqual(
            expectedEmptyTotalPrices,
          )
        })
      })
    })
  })

  describe('transformIndexedTariffPrices', () => {

    describe('happy path', () => {

      describe('when a valid range with values is given', () => {
        it('returns a valid data to fill the chart', () => {
          const fromDate = '2024-03-01'
          const selectedDate = '2024-03-08'
          const a_valid_price = 0.1
          const pricesDefaultLength = 360
          const prices = Array.from(
            { length: pricesDefaultLength },
            () => a_valid_price,
          )

          const result = transformIndexedTariffPrices(fromDate, selectedDate, prices)

          const expected_result_keys = [
            'fills',
            'keys',
            'periods',
            'week_average',
            'day_average',
            'base_days_computation',
          ]
          expect(Object.keys(result)).toStrictEqual(expected_result_keys)
          expect(result['periods'].length).toBe(24)
        })
      })
    })
  })

  describe('dayIsMissing', () => {

    describe('when all day hours are not missing', () => {
      it('returns false', () => {
        const periodElement = {
          date: 1712786400000,
          value: 'aValidHourValue',
          past_low: 0.028231,
        }
        const totalDayHours = 24
        const periods = Array.from({ length: totalDayHours }, () => periodElement)

        const result = dayIsMissing(periods)

        expect(result).toBe(false)
      })
    })

    describe('when some day hours are missing', () => {
      it('returns false', () => {
        const periodElement = {
          date: 1712786400000,
          value: 'aValidHourValue',
          past_low: 0.028231,
        }
        const totalDayHours = 24
        const periods = Array.from({ length: totalDayHours }, () => ({
          ...periodElement,
        }))
        periods[0].value = null

        const result = dayIsMissing(periods)

        expect(result).toBe(false)
      })
    })

    describe('when all day hours are missing', () => {
      it('returns true', () => {
        const periodElement = {
          date: 1712786400000,
          value: null,
          past_low: 0.028231,
        }
        const totalDayHours = 24
        const periods = Array.from({ length: totalDayHours }, () => ({
          ...periodElement,
        }))

        const result = dayIsMissing(periods)

        expect(result).toBe(true)
      })
    })
  })

  describe('weekTimeInterval', () => {
    describe('when summer time', () => {
      it('returns interval in summer time', () => {
        expect(weekTimeInterval(new Date('2024-04-14T00:00:00'))).toStrictEqual([
          new Date('2024-04-08T00:00:00'),
          new Date('2024-04-15T00:00:00'),
        ])
      })
    })

    describe('when winter time', () => {
      it('returns interval in winter time', () => {
        expect(weekTimeInterval(new Date('2024-03-14T00:00:00'))).toStrictEqual([
          new Date('2024-03-08T00:00:00'),
          new Date('2024-03-15T00:00:00'),
        ])
      })
    })

    describe('when winter to summer time', () => {
      it('returns interval in between winter and summer time', () => {
        expect(weekTimeInterval(new Date('2024-03-30T00:00:00'))).toStrictEqual([
          new Date('2024-03-24T00:00:00'),
          new Date('2024-03-31T00:00:00'),
        ])
      })
    })

    describe('when summer to winter time', () => {
      it('returns interval in between summer and winter time', () => {
        expect(weekTimeInterval(new Date('2023-10-29T00:00:00'))).toStrictEqual([
          new Date('2023-10-23T00:00:00'),
          new Date('2023-10-30T00:00:00'),
        ])
      })
    })
  })

  describe('computeMaxYAxisValue', () => {

    describe('when weekly average price is lower than daily maximum price', () => {
      it('returns the default behavior', () => {
        const weekly_average_price = '2,00'
        const daily_maximum_price = '4,00'
        const totalPrices = {
          WEEKLY_AVERAGE: weekly_average_price,
          MAX: daily_maximum_price
        }

        const result = computeMaxYAxisValue(totalPrices)

        expect(result).toStrictEqual('4.00')
      })
    })

    describe('when weekly average price is equal to daily maximum price', () => {
      it('returns the default behavior', () => {
        const weekly_average_price = '2,00'
        const daily_maximum_price = '2.00'
        const totalPrices = {
          WEEKLY_AVERAGE: weekly_average_price,
          MAX: daily_maximum_price
        }

        const result = computeMaxYAxisValue(totalPrices)

        expect(result).toStrictEqual('2.00')
      })
    })

    describe('when weekly average price is greater than daily maximum price', () => {
      it('returns the default behavior', () => {
        const weekly_average_price = '4,00'
        const daily_maximum_price = '2,00'
        const tickCount = 7
        const totalPrices = {
          WEEKLY_AVERAGE: weekly_average_price,
          MAX: daily_maximum_price
        }

        const result = computeMaxYAxisValue(totalPrices, tickCount)

        const expectedResult = '4.57'
        expect(result).toStrictEqual(expectedResult)
      })
    })

    describe('when minimum price is greater than 0', () => {
      it('returns the default behavior', () => {
        const weekly_average_price = '4,00'
        const minimum_price = '2,00'
        const tickCount = 7
        const totalPrices = {
          WEEKLY_AVERAGE: weekly_average_price,
          MIN: minimum_price
        }

        const result = computeMinYAxisValue(totalPrices, tickCount)

        expect(result).toStrictEqual('0.00')
      })
    })

    describe('when minimum price less than 0', () => {
      it('returns the default behavior', () => {
        const weekly_average_price = '4,00'
        const minimum_price = '-2,00'
        const tickCount = 7
        const totalPrices = {
          WEEKLY_AVERAGE: weekly_average_price,
          MIN: minimum_price
        }

        const result = computeMinYAxisValue(totalPrices, tickCount)

        const expectedResult = '-2.571'
        expect(result).toStrictEqual(expectedResult)
      })
    })
  })
})
