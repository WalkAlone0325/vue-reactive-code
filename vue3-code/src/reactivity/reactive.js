import { isObject } from '../shared/utils'
import { mutableHandler } from './mutableHandler'

export function reactive(target) {
  return createReactiveObject(target, mutableHandler)
}

function createReactiveObject(target, baseHandler) {
  // 不是object，直接返回
  if (!isObject(target)) {
    return target
  }

  const observer = new Proxy(target, baseHandler)
  return observer
}
