import * as Yup from 'yup'

const newContractMemberPowerValidations = Yup.object().shape({
    contract: Yup.object().shape({
      power_type: Yup.string()
        .required('REQUIRED_FIELD')
        .oneOf(['power-lower-15kw', 'power-higher-15kw']),
      power: Yup.object()
        .shape({
          power1: Yup.string().required('NO_POWER_CHOSEN_PX'),
          power2: Yup.string().required('NO_POWER_CHOSEN_PX'),
          power3: Yup.string(),
          power4: Yup.string(),
          power5: Yup.string(),
          power6: Yup.string()
        })
        .when('power_type', {
          is: 'power-higher-15kw',
          then: Yup.object()
            .shape({
              power1: Yup.string().required('NO_POWER_CHOSEN_PX'),
              power2: Yup.string().required('NO_POWER_CHOSEN_PX'),
              power3: Yup.string().required('NO_POWER_CHOSEN_PX'),
              power4: Yup.string().required('NO_POWER_CHOSEN_PX'),
              power5: Yup.string().required('NO_POWER_CHOSEN_PX'),
              power6: Yup.string().required('NO_POWER_CHOSEN_PX')
            })
            .required('NO_ADDRESS_STATE')
        }),
    },)
  });

  export default newContractMemberPowerValidations;