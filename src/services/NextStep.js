export const keyByValue = (steps, value) => {
    const [key] = Object.entries(steps).find(([key, val]) => val === value) || [];
    return key || null;
}

export const valueByKey = (steps, key, values) => {
    return steps[key(values)];
}

export const NextStep = {
  NEW_LINK_MEMBER_CONTRACT_FORM_SUBSTEPS: { 
    LINK_MEMBER: () => 'SUPPLY_POINT',
    SUPPLY_POINT: () => 'SUPPLY_INFO',
    SUPPLY_INFO: () => 'POWER',
    POWER: (values) => values.has_member === 'member-on' && values.has_light === 'light-off' 
            ? 'DONATION' : values.has_member === 'member-link' && values.has_light === 'light-off'
            ? 'MEMBER_INFO' : 'SELFCONSUMPTION',
    SELFCONSUMPTION: (values) => values.has_light === 'light-on' && values.has_selfconsumption === 'selfconsumption-on'
            ? 'SELFCONSUMPTION_INFO' : 'HOLDER_INFO',
    SELFCONSUMPTION_INFO: () => 'HOLDER_INFO',
    HOLDER_INFO: (values) => values.has_member === 'member-on' && values.has_light === 'light-on'
            ? 'DONATION' : 'MEMBER_INFO',
    MEMBER_INFO: () => 'DONATION',
    DONATION: () => 'PAYMENT_INFO',
    PAYMENT_INFO: () => 'SUMMARY',
  },
  NEW_MEMBER_CONTRACT_FORM_SUBSTEPS: { 
    IDENTIFY_MEMBER: () => 'MEMBER_INFO',
    MEMBER_INFO: () => 'SUPPLY_POINT',
    SUPPLY_POINT: () => 'SUPPLY_INFO',
    SUPPLY_INFO: () => 'POWER',
    POWER: (values) => values.has_light === 'light-off' ? 'DONATION' : 'SELFCONSUMPTION',
    SELFCONSUMPTION: (values) => values.has_light === 'light-on' && values.has_selfconsumption === 'selfconsumption-on'
            ? 'SELFCONSUMPTION_INFO' : 'HOLDER_INFO',
    SELFCONSUMPTION_INFO: () => 'HOLDER_INFO',
    HOLDER_INFO: () => 'DONATION',
    DONATION: () => 'PAYMENT_INFO',
    PAYMENT_INFO: () => 'SUMMARY',
  }
}

