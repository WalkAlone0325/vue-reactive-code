import { ARR_METHODS } from './config'
import observeArr from './observeArr'

var originArrMethods = Array.prototype
var arrMethods = Object.create(originArrMethods)
// console.log(originArrMethods)
// console.log(arrMethods)

ARR_METHODS.map(function (m) {
  arrMethods[m] = function () {
    console.log('数组新方法：', arguments)
    // 将argments类数组 转化为数组
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

// arr.push(123)
export { arrMethods }
