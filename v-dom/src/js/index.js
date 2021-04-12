import { createElement, render, renderDom } from './virtualDom'
import domDiff from './domDiff'
import doPatch from './doPatch'

const vDom1 = createElement(
  'ul',
  {
    class: 'list',
    style: 'width: 300px; height: 300px; background-color: orange;',
  },
  [
    createElement('li', { class: 'item', 'data-index': 0 }, [
      createElement('p', { class: 'text' }, ['第1个列表项']),
    ]),
    createElement('li', { class: 'item', 'data-index': 1 }, [
      createElement('p', { class: 'text' }, [
        createElement('span', { class: 'title' }, ['第2个列表项']),
      ]),
    ]),
    createElement('li', { class: 'item', 'data-index': 2 }, ['第3个列表项']),
  ],
)

const vDom2 = createElement(
  //* 0
  'ul',
  {
    // list -> list-wrap
    class: 'list-wrap',
    style: 'width: 300px; height: 300px; background-color: orange;',
  },
  [
    //* 1
    createElement('li', { class: 'item', 'data-index': 0 }, [
      // class 特殊列表项
      //* 2
      createElement('p', { class: 'title' }, [
        //* 3
        '特殊列表项',
      ]),
    ]),
    //* 4
    createElement('li', { class: 'item', 'data-index': 1 }, [
      //* 5
      createElement('p', { class: 'text' }, [
        // remove
        //* 6
        // createElement('span', { class: 'title' }, ['第2个列表项']),
      ]),
    ]),
    // li -> div
    //* 7
    createElement('div', { class: 'item', 'data-index': 2 }, [
      //* 8
      '第3个列表项',
    ]),
  ],
)

// rDom 真实Dom
// vDom 虚拟Dom
const rDom = render(vDom1)
// 挂载 dom
renderDom(rDom, document.getElementById('app'))

// 补丁包
const patches = domDiff(vDom1, vDom2)

// 打补丁
doPatch(rDom, patches)

console.log(patches)

// console.log(vDom)
// console.log(rDom)
