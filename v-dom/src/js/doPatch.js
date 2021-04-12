import { ATTR, REMOVE, REPLACE, TEXT } from './patchTypes'
import { render, setAttrs } from './virtualDom'

let finalPatches = {}
// 真实节点索引
let rnIndex = 0

/**
 * 打补丁
 * @param {*} rDom realDom 真实dom
 * @param {*} patches 补丁包
 */
function doPatch(rDom, patches) {
  finalPatches = patches
  rNodeWalk(rDom)
}

function rNodeWalk(rNode) {
  const rnPatch = finalPatches[rnIndex++]
  const childNodes = rNode.childNodes

  ;[...childNodes].map(c => {
    rNodeWalk(c)
  })

  if (rnPatch) {
    pathcAction(rNode, rnPatch)
  }
}

function pathcAction(rNode, rnPatch) {
  rnPatch.map(p => {
    switch (p.type) {
      case ATTR:
        for (let key in p.attrs) {
          const value = p.attrs[key]

          if (value) {
            setAttrs(rNode, key, value)
          } else {
            rNode.removeAttribute(key)
          }
        }
        break
      case TEXT:
        rNode.textContent = p.text
        break
      case REPLACE:
        const newNode =
          p.newNode instanceof Element ? render(p.newNode) : document.createTextNode(p.newNode)
        rNode.parentNode.replaceChild(newNode, rNode)
        break
      case REMOVE:
        rNode.parentNode.removeChild(rNode)
        break

      default:
        break
    }
  })
}

export default doPatch

// vNode = virtual Node
// vnPatch = virtual Node patch
// rNode = real Node
// rnPatch = real Node Patch
