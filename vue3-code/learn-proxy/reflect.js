let target = {
  a: 1,
  b: 2,
}
let proxy = new Proxy(target, {
  get(target, prop) {
    // 这是直接取值，命令式
    // return target[prop]
    // 方法取值，函数式
    return Reflect.get(target, prop)
  },
  set(target, prop, value) {
    // target[prop] = value
    // 效果和上面一样
    // 函数式，方法式，偏于底层，有返回值
    const isOk = Reflect.set(target, prop, value)
    console.log(isOk) // true
    if (isOk) {
      console.log('SET successfully')
    }
  },
})
proxy.a = 33
