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
   * Compatible with next languages: ca, es, eu, gl
   *
   * @param {string} value Full address
   * @param {{ avoidStreetType: boolean }} options Avoid street type. `Default: true`
   *
   * @example
   * ```js
   * AddressUtils.segmentStreet('Avinguda de la Verge de Montserrat')
   * // => { streetName: 'Verge de Montserrat' segments: ['de', 'la', 'Verge de Montserrat'] }
   * ```
   *
   * @returns {{ streetName: string[], segments: string[] }}
   */
  static segmentStreet(value, opts = { avoidStreetType: true }) {
    const connectors = []
    const streetNames = []
    const particlesRegex = /\b(de|do|da|dos|das|o|a|os|as|e|ao|aos|á|ás|del|dels|la|las|les|el|els|los|al|als|en|na|eta|ta)\b|\b(d|l|n|s)'/i

    value.split(/\s+/).forEach((word, index) => {
      if (particlesRegex.test(word) && !streetNames.length) {
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
