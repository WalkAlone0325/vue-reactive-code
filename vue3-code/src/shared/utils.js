// 是否为对象
export function isObject(value) {
  return typeof value === 'object' && value !== null
}

// key是否为target上的属性
export function hasOwnProperty(target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}

// 两值是否一样
export function isEqual(newValue, oldValue) {
  return newValue === oldValue
}
