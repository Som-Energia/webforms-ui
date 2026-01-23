import { StringUtils } from './string.utils'

export class ArrayUtils {
  /**
   * Check if an array contains a specific string value.
   *
   * @param {string[]} array String values
   * @param {string} value Value to check
   * @returns {boolean}
   */
  static hasStringValue(array, value) {
    return array
      .map((item) => item.toLowerCase())
      .map((item) => StringUtils.normalize(item))
      .includes(StringUtils.normalize(value).toLowerCase())
  }
}
