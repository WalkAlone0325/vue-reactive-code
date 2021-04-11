import { reactive } from '.'
import { isObject, hasOwnProperty, isEqual } from '../shared/utils'

const get = createGetter()
const set = createSetter()

function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    console.log('响应式获取：' + target[key])

    // 获取的还是对象，再进行响应
    if (isObject(res)) {
      return reactive(res)
    }

    return res
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    // 判断 key 是否为 target 的属性
    const isKeyExist = hasOwnProperty(target, key)
    const oldValue = target[key]
    const res = Reflect.set(target, key, value, receiver)
    // console.log('响应式设置：' + key + '=' + value, target.length)

    // 如果不是target的属性，则为新增属性
    if (!isKeyExist) {
      console.log('响应式新增：' + value)
    } else if (!isEqual(value, oldValue)) {
      console.log('响应式修改：' + key + '=' + value)
    }
    return res
  }
}
// function createDeleteProperty() {}

export const mutableHandler = {
  get,
  set,
}
