// defineProperty 劫持数据->给对象进行扩展->属性进行设置

// Proxy ES6 构造函数 并不是数据劫持 -> 返回一个代理对象
// function Proxy() {}
// var proxy = new Proxy()

/**
 * 自定义对象属性的获取、赋值、枚举、函数调用的等功能
 * target 要处理的目标对象
 * handler 容器，无数可以处理对象属性的方法
 */
// 对象obj
// const target = {
//   a: 1,
//   b: 2,
// }
// let proxy = new Proxy(target, {
//   // target 传入的对象，prop 对象的属性
//   get(target, prop) {
//     return 'This is property value ' + target[prop]
//   },
//   set(target, prop, value) {
//     target[prop] = value
//     console.log(target[prop])
//   },
// })

// console.log(proxy.a)
// console.log(target.a)
// proxy.b = 3
// console.log(target) // proxy修改，target也会修改 -> 代理

// 数组arr
// let arr = [
//   { name: '小明', age: 18 },
//   { name: '小红', age: 20 },
//   { name: '小黄', age: 15 },
//   { name: '小王', age: 28 },
//   { name: '小李', age: 30 },
// ]

// let persons = new Proxy(arr, {
//   get(arr, prop) {
//     return arr[prop]
//   },
//   set(arr, prop, value) {
//     arr[prop] = value
//   },
// })

// console.log(persons[0])
// persons[1] = { name: 'loner', age: 25 }
// console.log(persons)

// 函数func
// let fn = function () {
//   console.log('I am a function')
// }
// fn.a = 123

// let newFn = new Proxy(fn, {
//   get(fn, prop) {
//     return fn[prop] + ' This is a Proxy return'
//   },
// })
// console.log(newFn.a)

/**
 * ! ECMAScript 委员会，对象操作有 14 中方法
 */
var obj = { a: 1, b: 2 }
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
