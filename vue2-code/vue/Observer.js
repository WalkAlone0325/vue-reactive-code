import defineReactiveData from './reactive'
import { arrMethods } from './array'
import observeArr from './observeArr'

/**
 * {} defineProperty
 * [] 自己去写方法观察
 * @param {object} data 观察的对象
 */
function Observer(data) {
  if (Array.isArray(data)) {
    // 给 data 的__proto__ 添加自己的方法，先走自己的方法
    data.__proto__ = arrMethods
    // 如果data里还有数组或对象8
    observeArr(data)
  } else {
    // object
    this.walk(data)
  }
}

Observer.prototype.walk = function (data) {
  // 先拿到所有的对象的key
  var keys = Object.keys(data)
  console.log(keys)
  // console.log(keys)

  for (var i = 0; i < keys.length; i++) {
    // 所有的key
    var key = keys[i]
    // 所有的value
    var value = data[key]
    // console.log(key, value)

    // 进行拦截
    defineReactiveData(data, key, value)
  }
}

export default Observer
