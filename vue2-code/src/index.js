import Vue from 'vue'

// options
let vm = new Vue({
  el: '#app',
  data() {
    return {
      title: 'Vue2数据劫持',
      avator: 'loner',
      age: 18,
      arr: ['xx', 'bb'],
      arrObj: [
        { id: 1, name: 'duxing' },
        { id: 2, name: 'loner' },
      ],
      info: {
        a: {
          b: 1,
        },
      },
    }
  },
})

// vm._data
console.log(vm)
vm.title
vm.title = 'duxing'
console.log(vm.info.a)
vm.arr.push('111', '5646')
vm.info.a = { c: 8 }
vm.arr.splice(1, 1, {
  id: 3,
  name: 'duxing',
})
