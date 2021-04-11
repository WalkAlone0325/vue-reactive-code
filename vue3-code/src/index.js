// import { reactive } from '@vue/reactivity'
import { reactive } from './reactivity'

// composition API
// reactive -> es6 Proxy 代理api
const state = reactive({
  name: 'loner',
  age: 18,
  info: {
    job: 'web',
    arr: [
      {
        id: 1,
        name: 'xx',
      },
      {
        id: 2,
        name: 'dd',
      },
    ],
  },
  hobby: ['xduxing', 'loner', 'xaas'],
})

// console.log(state)
// state.name
// state.name = '独行'
// state.age = 25
state.hobby.push('coding')
// state.hobby[0] = 'coding'
state.info.arr.push({ id: 3, name: '我是新增3' })
console.log(state)
