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

## vue3 proxy 数据代理

- `defineProperty(obj,'key',{})` 他是一个空对象 `obj`，要对里面的属性进行定义，所以有 `'key'` 参数

- `new Proxy(target, handler)` 他是对一个完整的对象 `target` 进行代理，所以没有 `key` 参数

  - `target` 要处理的目标对象
  - `handler` 容器，无数可以处理对象属性的方法
  - 自定义对象属性的获取、赋值、枚举、函数调用的等功能
  - 可以对对象、数组、函数等直接代理

- ECMAScript 委员会，对象操作有 14 中方法

  ```js
  //  [[]]内键方法
  //* 1. 获取原型 [[GetPrototypeOf]]
  // var proto = Object.getPrototypeOf(obj) // 函数式
  // console.log(proto)
  // console.log(obj.__proto__) // 同上
  // console.log(Object.prototype) // 同上

  // JS 很多的命令 关键字 而不是方法式
  // in instanceof 关键字
  // JS 底层很多方法都是函数式的，应该形成函数式

  //* 2. 设置原型 [[SetPrototypeOf]] 扩展原型
  // Object.setPrototypeOf(obj, { c: 3, d: 4 })
  // obj.__proto__=
  // Object.prototype= 同上
  // console.log(obj)

  //* 3. 获取对象的可扩展性 [[IsExtensible]]
  // var extensible = Object.isExtensible(obj)
  // console.log(extensible) // true

  // Object.freeze(obj) // 冻结对象 -> 不可修改 不可删除 不可写 可读
  // var extensible2 = Object.isExtensible(obj)
  // console.log(extensible2) // false

  // Object.seal(obj) // 封闭对象 -> 不可修改 不可删除 可写 可读
  // obj.c = 3 // 不可修改的
  // console.log(obj)
  // delete obj.a // 不可删除的
  // console.log(obj)
  // obj.b = 3 // 可写的， 原有的
  // console.log(obj)

  //* 4. 获取自有属性 [[GetOwnProperty]]
  // Object.setPrototypeOf(obj, { c: 3, d: 4 }) // c 和 d 是扩展的原型
  // console.log(Object.getOwnPropertyNames(obj)) // ["a", "b"]

  //* 5. 禁止扩展对象 [[PreventExtensions]] 可删除，不可增加
  // Object.preventExtensions(obj)
  // obj.c = 3
  // console.log(obj) // {a: 1, b: 2}

  //* 6. 拦截对象操作 [[DefineOwnProperty]]
  // Object.defineProperty()

  //* 7. 判断是否是自身属性 [[HasProperty]]
  // console.log(obj.hasOwnProperty('a')) // true

  //* 8. [[GET]]
  // console.log('c' in obj) // false
  // console.log('a' in obj) // true
  // console.log(obj.a)

  //* 9. [[SET]]
  // obj.a = 3
  // obj['b'] = 4

  //* 10. [[Delete]]
  // delete obj.a

  //* 11. [[Enumerate]]
  // for (var k in obj) {
  //   console.log(obj[k])
  // }

  //* 12. 获取键集合 [[OwnPropertyKeys]]
  // console.log(Object.keys(obj))

  //* 13. 函数调用
  // function test() {}
  // test()

  // obj.test = function () {}
  // obj.test()

  // function test() {}
  // test.call/apply

  //* 14. 构造函数
  // function Test() {}
  // new Test()
  ```

### Reflect 反射

> 内置对象 方法集合的容器，跟 Math 很像
> 13 种，没有枚举

## v-dom 虚拟节点与 DOM Diff 算法解析

### index.js

createElement

### virtualDom.js

- `createElement` 创建
- `Element` 返回 dom 对象
- `render` 函数将 vdom 转为真实 rdom，并返回
- `setAttrs`函数根据不同情况设置属性
- `renderDom`将 rDom 挂载到需要挂载的节点上

h 函数创建 vnode，然后转为 vdom 对象，通过 render 函数将 vdom 转为真实 dom，然后通过 mount 挂载到页面上

### domDiff.js

> `walk` 遍历递归，专业名词

递归遍历并通过 diff 算法返回补丁包，然后通过 patch 将补丁打入新的 vdom，然后挂载到页面
