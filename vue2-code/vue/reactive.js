import observe from './observe'

function defineReactiveData(data, key, value) {
  //! 此处的 value 有可能还是对象
  observe(value)

  Object.defineProperty(data, key, {
    get() {
      console.log('响应式数据：获取', value)
      return value
    },
    set(newValue) {
      console.log('响应式数据：设置', newValue)
      if (newValue === value) return
      // 先观察判断newValue是否为对象或者数组
      observe(newValue)
      value = newValue
    },
  })
}

export default defineReactiveData
