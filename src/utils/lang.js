
/** Used to check objects for own properties. */
// const hasOwnProperty = Object.prototype.hasOwnProperty;

function isObject(value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

function isArray(value) {
  const _isArray = Array.isArray || (_arg => Object.prototype.toString.call(_arg) === '[object Array]')
  return _isArray(value)
}

function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (isObject(value)) return Object.keys(value).length === 0
  if (isArray(value)) return value.length === 0

  return false
}

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]'
}

function objectHandler(obj, handler) {
  const finalObj = Object.keys(obj)
    .reduce((a, c) => ({
      ...a,
      [c]: handler(obj[c])
    }), {})
  return finalObj
}

function trim(str) {
  if (Object.prototype.toString.call(str) === '[object String]') {
    return str.trim()
  }
  return str
}

export {
  isString,
  isObject,
  isArray,
  isEmpty,
  objectHandler,
  trim,
}
