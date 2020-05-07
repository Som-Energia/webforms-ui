const THOUSANDS_CONVERSION_FACTOR = 1000

export const normalizeFormData = (params) => {
  const { modify, contact, token } = params

  const data = {
    tarifa: modify?.tariff,
    tensio: modify?.phases,
    attachments: [...modify?.attachments, ...modify?.power_attachments],
    potencia: modify?.changePower ? Math.round(modify?.power * THOUSANDS_CONVERSION_FACTOR) : undefined,
    potencia_p2: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power2 * THOUSANDS_CONVERSION_FACTOR) : undefined,
    potencia_p3: modify?.changePower && modify?.moreThan15Kw ? Math.round(modify?.power3 * THOUSANDS_CONVERSION_FACTOR) : undefined,
    discriminacio: modify?.fare,
    contact_name: contact?.contactName,
    contact_surname: contact?.contactSurname,
    contact_phone: contact?.phone,
    token: token
  }

  return data
}
