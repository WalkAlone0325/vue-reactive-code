import Element from './Element'

export function createElement(type, props, children) {
  return new Element(type, props, children)
}
/**
 * 设置标签属性
 * @param {*} node 要设置的节点
 * @param {*} prop 属性名
 * @param {*} value 属性值
 */
export function setAttrs(node, prop, value) {
  switch (prop) {
    case 'value':
      // input 和 textarea 的属性是直接设置.value
      //! 获取的标签名是大写
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.value = value
      } else {
        node.setAttribute(prop, value)
      }
      break
    case 'style':
      node.style.cssText = value
      break

    default:
      node.setAttribute(prop, value)
      break
  }
}

export function render(vDom) {
  const { type, props, children } = vDom
  // 创建真实节点
  const el = document.createElement(type)

  // 遍历属性props
  for (const key in props) {
    // 设置属性，节点 属性名 值
    setAttrs(el, key, props[key])
  }

  // 处理子节点
  children.map(c => {
    // if (c instanceof Element) {
    //   // 还是元素标签，再次使用render
    //   c = render(c)
    // } else {
    //   // 文本节点
    //   c = document.createTextNode(c)
    // }
    c = c instanceof Element ? render(c) : document.createTextNode(c)
    // 把创建的子节点放入el父节点中
    el.appendChild(c)
  })

  return el
}

/**
 * 渲染DOM到页面
 * @param {*} rDom 真实Dom
 * @param {*} rootEl 要挂载到的根节点
 */
export function renderDom(rDom, rootEl) {
  rootEl.appendChild(rDom)
}
