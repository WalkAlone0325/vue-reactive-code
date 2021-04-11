import proxyData from './proxy'
import observe from './observe'

function initState(vm) {
  var options = vm.$options

  if (options.data) {
    initData(vm)
  }
  // ... computed methods
}

function initData(vm) {
  var data = vm.$options.data

  // 临时保存一份vm._data vm._data->this.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data || {}

  // 将 vm._data 代理到 vm上
  for (var key in data) {
    proxyData(vm, '_data', key)
  }

  // 观察者模式
  observe(vm._data)
}

export { initState }
