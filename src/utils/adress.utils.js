export class AddressUtils {
  /**
   * Parse Google.Place object and extract specified elements.
   *
   * @param {Google.place} place Google Place Object
   * @param {string[]} components Components to find in Place
   *
   * @return {object} object with components props
   */
  static parsePlace(place, components) {
    const result = {}

    const comps = components || []
    comps.forEach((item) => {
      result[item] =
        place.addressComponents.find((c) => c.types.includes(item))?.longText ||
        ''
    })

    return result
  }

  /**
   * Sanitize { id, name } Place object with empty strings
   *
   * @param {{ id: number | string | undefined, name: string | undefined }} place Id, Name Object
   *
   * @return {{ id: string, name: string }} Id, Name object without undefined values
   */
  static sanitizePlace(place) {
    return {
      id: String(place?.id || ''),
      name: place?.name || ''
    }
  }

  /**
   * Parse full address string and decompose it into connectors and real words.
   *
   * @param {string} value Full address
   * @param {string} language Language key: 'ca', 'es', 'gl', 'eu'
   * @param {{ avoidStreetType: boolean }} options Avoid street type. `Default: true`
   *
   * @example
   * ```js
   * AddressUtils.segmentStreet('Plaça de la Reina Maria Cristina', 'ca')
   * // => { streetName: 'Reina Maria Cristina' segments: ['de', 'la', 'Reina Maria Cristina'] }
   * ```
   *
   * @returns {{ streetName: string[], segments: string[] }}
   */
  static segmentStreet(value, language, opts = { avoidStreetType: true }) {
    const connectors = []
    const streetNames = []
    const particlesRegex = {
      es: /\b(de|del|la|las|el|los|al)\b/i,
      ca: /\b(de|del|dels|la|les|el|els|al|als|en|na)\b|\b(d|l|n|s)'/i,
      gl: /\b(de|do|da|dos|das|o|a|os|as|e|ao|aos|á|ás)\b/i,
      eu: /\b(eta|ta)\b/i
    }

    value.split(/\s+/).forEach((word, index) => {
      if (particlesRegex[language]?.test(word)) {
        connectors.push(word)
      } else if (opts.avoidStreetType && index > 0) {
        streetNames.push(word)
      }
    })

    return {
      streetName: streetNames.join(' '),
      segments: connectors.concat(streetNames.join(' '))
    }
  }
}
