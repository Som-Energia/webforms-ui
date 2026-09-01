import { describe, expect, test } from "vitest"

import OrdinalNumbers from "./ordinalNumbers"

describe("OrdinalNumbers", () => {
  test("formats Catalan ordinal suffixes for the first four numbers", () => {
    const ordinals = new OrdinalNumbers("ca")

    expect(ordinals.formatOrdinals(1)).toBe("1r")
    expect(ordinals.formatOrdinals(2)).toBe("2n")
    expect(ordinals.formatOrdinals(3)).toBe("3r")
    expect(ordinals.formatOrdinals(4)).toBe("4t")
  })

  test("uses the generic Catalan suffix from the fifth ordinal onwards", () => {
    const ordinals = new OrdinalNumbers("ca")

    expect(ordinals.formatOrdinals(5)).toBe("5è")
    expect(ordinals.formatOrdinals(10)).toBe("10è")
  })

  test("uses the default ordinal suffix for non Catalan languages", () => {
    expect(new OrdinalNumbers("es").formatOrdinals(1)).toBe("1º")
    expect(new OrdinalNumbers("eu").formatOrdinals(3)).toBe("3º")
    expect(new OrdinalNumbers(undefined).formatOrdinals(7)).toBe("7º")
  })
})
