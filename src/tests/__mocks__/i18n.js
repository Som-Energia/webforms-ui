// Use this helper when the test only needs stable translation keys; use src/tests/i18n.mock.js when rendered copy or i18n behavior matters.
export const useTranslation = () => ({
  t: (key) => key,
  i18n: {
    changeLanguage: () => new Promise(() => {}),
  },
})

export const Trans = ({ children }) => children

export const Translation = ({ children }) =>
  children((key) => key, { i18n: {} })
