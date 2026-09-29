// Use this helper when the test only needs stable translation keys; use src/tests/i18n.mock.js when rendered copy or i18n behavior matters.
const t = (key) => key

const i18n = {
  changeLanguage: () => new Promise(() => {}),
}

export const useTranslation = () => ({
  t,
  i18n,
})

export const Trans = ({ children, i18nKey }) => children ?? i18nKey

export const Translation = ({ children }) => children(t, { i18n })
