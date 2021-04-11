import observe from './observe'

function observeArr(arr) {
  // 多项再进行观察
  for (var i = 0; i < arr.length; i++) {
    observe(arr[i])
  }
}

export default observeArr
