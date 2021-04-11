## vue2 数据劫持

> 不希望我们对数据的操作只是单纯的操作，希望在操作数据的过程中做一些额外的操作（跟视图做数据绑定）

### index.js 构造函数

Vue 的主初始化程序，就是在 Vue 的原型属性上挂载了初始化`_init`方法，会调用很多抽离出来的函数和工具，程序通过相互之间调用来完成 Vue 底层的一系列驱动程序。

### init.js 初始化程序

直接访问 `vm.xx`，进行数据代理，`proxyData()`
把`vm._data.xx`代理到`vm.xx`

```js
var data = vm.$options.data

// 临时保存一份vm._data vm._data->this.data
vm._data = data = typeof data === 'function' ? data.call(vm) : data || {}

// 将 vm._data 代理到 vm上
for (var key in data) {
  proxyData(vm, '_data', key)
}
```

### observe.js 观察

不是 object 或者是 null 返回，基础类型和 object 和数组

### Observer.js

{} defineProperty
[] 自己去写方法观察，用原来的方法操作数据，重写方法，然后再执行原来的方法过程中执行更多的处理

#### walk

- 传过来的 `data`
- 进行遍历
- 通过 `data` 拿到所有的 `key`
- 然后拿到所有 `key` 对应的 `value`
- 通过 `defineReactiveData(data, key, value)`进行循环拦截

### reactive.js 对对象进行拦截

```js
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
```

- 问题一：value 还是一个对象，重新观察`observe(value)`
- 问题二：设置时的 value 不确定是基础值还是对象或者数组，所以还要继续观察`observe(newValue)`

### array.js 处理数组

`config.js`的数组方法会对原数组进行更改（增加，删除等变化）

```js
var originArrMethods = Array.prototype
// 新造一个arr对象
var arrMethods = Object.create(originArrMethods)
// console.log(originArrMethods)
// console.log(arrMethods)

ARR_METHODS.map(function (m) {
  // arr['push'](123)
  // arr['push'] = function () {}
  arrMethods[m] = function () {
    console.log('数组新方法：', arguments)
    // 将 argments类数组 转化为 数组
    // slice 会返回一个新数组
    var args = Array.prototype.slice.call(arguments)
    // 执行原有的数组方法
    var rt = originArrMethods[m].apply(this, args)

    var newArr

    // 新增项的重写响应
    switch (m) {
      case 'push':
      case 'unshift':
        newArr = args
        break

      case 'splice':
        // splice(0,1,{},,,) 取 索引为2后面的所有参数
        newArr = args.slice(2)
        break

      default:
        break
    }
    newArr && observeArr(newArr)
    return rt
  }
})
```

### observeArr.js 观察数组

```js
function observeArr(arr) {
  // 多项再进行观察
  for (var i = 0; i < arr.length; i++) {
    observe(arr[i])
  }
}
```

### Observer.js

```js
if (Array.isArray(data)) {
  // 给 data 的__proto__ 添加自己的方法，先走自己的方法
  data.__proto__ = arrMethods
  // 如果data里还有数组或对象8
  observeArr(data)
}
```

- 在数组 data 的原型链`__proto__`上新加自己拦截的方法
- 数组先执行拦截的方法，
- 再进行原数组方法执行，
- 然后再对新增项进行处理，
- 最后对进行新增项进行观察
