/** Utility methods for application-level integrations. */
export class AppUtils {
  /**
   * Opens an external popup using the function configured on the root element.
   * The function name is read from the root element's `data-popup-function`
   * attribute and the configured function is called with `args`.
   *
   * @param {*} [args] Arguments forwarded to the configured popup function.
   * @throws {Error} If no popup function is configured or the configured name
   * does not reference a function on `window`.
   */
  static openExternalPopup(args) {
    const root = document.getElementById("root")
    const fnName = root?.getAttribute("data-popup-function")
    if (!fnName) {
      throw new Error(
        "No external popup function is configured on the root element",
      )
    }
    if (typeof window[fnName] !== "function") {
      throw new Error(
        `Configured external popup function "${fnName}" is not available on window`,
      )
    }

    window[fnName](args)
  }
}
