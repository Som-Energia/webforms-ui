const reactI18next = require('react-i18next');

module.exports = {
  ...reactI18next,
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Trans: ({ children }) => children,
  Translation: ({ children }) => children((key) => key, { i18n: {} }),
};