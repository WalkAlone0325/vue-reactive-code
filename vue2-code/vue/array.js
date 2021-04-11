import { ARR_METHODS } from './config'
import observeArr from './observeArr'

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
        newArr = args.slice(2) // [{a:1},{b:2}]
        break

      default:
        break
    }
    // splice可能不填第三个参数，所有newArr可能为空
    // 然后再观察
    newArr && observeArr(newArr)
    return rt
  }
})

// arr.push(123)
export { arrMethods }
