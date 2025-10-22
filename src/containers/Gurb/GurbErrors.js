export default class GurbOutOfPerimeterError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GurbOutOfPerimeterError'
  }
}