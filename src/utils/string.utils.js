export class StringUtils {
  /**
   * Normalize a string by removing diacritics.
   *
   * @param {string} value - The string to normalize.
   * @returns {string} The normalized string.
   */
  static normalize(value) {
    return (value || '')
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
  }
}
