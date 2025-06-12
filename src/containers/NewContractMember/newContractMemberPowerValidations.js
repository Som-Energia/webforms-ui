import * as Yup from 'yup'
import { newTestPowerForPeriods } from '../../services/utils'
import { getNewRates } from '../../services/api'

const rates = getNewRates()

const newContractMemberPowerValidations = Yup.object().shape({
  contract: Yup.object().shape({
    power_type: Yup.string()
      .required('REQUIRED_FIELD')
      .oneOf(['power-lower-15kw', 'power-higher-15kw']),
    power: Yup.object()
      .when('power_type', {
        is: 'power-lower-15kw',
        then: Yup.object()
          .shape({
            power1: Yup.number()
              .required('NO_POWER_CHOSEN_PX')
              .test({
                name: 'minPowerValue',
                test: function () {
                  return newTestPowerForPeriods(
                    'power-lower-15kw',
                    this.parent,
                    'min_power',
                    this.createError
                  )
                }
              })
              .test({
                name: 'maxPowerValue',
                test: function () {
                  return newTestPowerForPeriods(
                    'power-lower-15kw',
                    this.parent,
                    'max_power',
                    this.createError
                  )
                }
              }),
            power2: Yup.number()
              .test('required', 'NO_POWER_CHOSEN_PX', function () {
                return rates['power-lower-15kw']?.num_power_periods >= 2
                  ? this.parent.power2
                  : true
              })
              .test('increasing', 'NO_POWER_INCREASING', function () {
                return rates['power-lower-15kw']?.increasing
                  ? parseFloat(this.parent.power2) >= parseFloat(this.parent.power1)
                  : true
              })
              .test({
                name: 'minPowerValue',
                test: function () {
                  return newTestPowerForPeriods(
                    'power-lower-15kw',
                    this.parent,
                    'min_power',
                    this.createError
                  )
                }
              })
              .test({
                name: 'maxPowerValue',
                test: function () {
                  return newTestPowerForPeriods(
                    'power-lower-15kw',
                    this.parent,
                    'max_power',
                    this.createError
                  )
                }
              })
          })
      })
        .when('power_type', {
          is: 'power-higher-15kw',
          then: Yup.object()
            .shape({
              power1: Yup.number()
                .required('NO_POWER_CHOSEN_PX')
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                }),
              power2: Yup.number()
                .test('required', 'NO_POWER_CHOSEN_PX', function () {
                  return rates['power-higher-15kw']?.num_power_periods >= 2
                    ? this.parent.power2
                    : true
                })
                .test('increasing', 'NO_POWER_INCREASING', function () {
                  return rates['power-higher-15kw']?.increasing
                    ? parseFloat(this.parent.power2) >= parseFloat(this.parent.power1)
                    : true
                })
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                }),
              power3: Yup.number()
                .test('required', 'NO_POWER_CHOSEN_PX', function () {
                  return rates['power-higher-15kw']?.num_power_periods >= 3
                    ? this.parent.power3
                    : true
                })
                .test('increasing', 'NO_POWER_INCREASING', function () {
                  return rates['power-higher-15kw']?.increasing
                    ? parseFloat(this.parent.power3) >= parseFloat(this.parent.power2)
                    : true
                })
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                }),
              power4: Yup.number()
                .test('required', 'NO_POWER_CHOSEN_PX', function () {
                  return rates['power-higher-15kw']?.num_power_periods >= 4
                    ? this.parent.power4
                    : true
                })
                .test('increasing', 'NO_POWER_INCREASING', function () {
                  return rates['power-higher-15kw']?.increasing
                    ? parseFloat(this.parent.power4) >= parseFloat(this.parent.power3)
                    : true
                })
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                }),
              power5: Yup.number()
                .test('required', 'NO_POWER_CHOSEN_PX', function () {
                  return rates['power-higher-15kw']?.num_power_periods >= 5
                    ? this.parent.power5
                    : true
                })
                .test('increasing', 'NO_POWER_INCREASING', function () {
                  return rates['power-higher-15kw']?.increasing
                    ? parseFloat(this.parent.power5) >= parseFloat(this.parent.power4)
                    : true
                })
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                }),
              power6: Yup.number()
                .test('required', 'NO_POWER_CHOSEN_PX', function () {
                  return rates['power-higher-15kw']?.num_power_periods >= 6
                    ? this.parent.power6
                    : true
                })
                .test('increasing', 'NO_POWER_INCREASING', function () {
                  return rates['power-higher-15kw']?.increasing
                    ? parseFloat(this.parent.power6) >= parseFloat(this.parent.power5)
                    : true
                })
                .test({
                  name: 'minPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'min_power',
                      this.createError
                    )
                  }
                })
                .test({
                  name: 'maxPowerValue',
                  test: function () {
                    return newTestPowerForPeriods(
                      'power-higher-15kw',
                      this.parent,
                      'max_power',
                      this.createError
                    )
                  }
                })
            })
        })
    })
});

export default newContractMemberPowerValidations;