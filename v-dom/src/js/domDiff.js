import { ATTR, TEXT, REMOVE, REPLACE } from './patchTypes'

// 相当于test.js里的格式
let patches = {}
// 01234的遍历子节点顺序
let vnIndex = 0

function domDiff(oldVDom, newVDom) {
  // vNodeWalk 私有 index
  let index = 0
  // diff
  vNodeWalk(oldVDom, newVDom, index)
  // 返回patches
  return patches
}

function vNodeWalk(oldNode, newNode, index) {
  let vnPatch = []

  if (!newNode) {
    // 删除
    vnPatch.push({
      type: REMOVE,
      index,
    })
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    // 文本
    if (oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode,
      })
    }
  } else if (oldNode.type === newNode.type) {
    // 标签一样，对比属性
    const attrPatch = attrsWalk(oldNode.props, newNode.props)
    // console.log(attrPatch)
    if (Object.keys(attrPatch).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch,
      })
    }

    // 递归遍历子节点做patch
    childrenWalk(oldNode.children, newNode.children)
  } else {
    vnPatch.push({
      type: REPLACE,
      newNode: newNode,
    })
  }

  if (vnPatch.length > 0) {
    patches[index] = vnPatch
  }
}

// patch 属性
function attrsWalk(oldAttrs, newAttrs) {
  let attrPatch = {}

  for (let key in oldAttrs) {
    // 修改属性
    if (oldAttrs[key] !== newAttrs[key]) {
      // 如果属性值不同，要将新属性打入补丁attrPatch中
      attrPatch[key] = newAttrs[key]
    }
  }

  for (let key in newAttrs) {
    // 新的属性在老的属性上找不到，即为新增属性
    if (!oldAttrs.hasOwnProperty(key)) {
      attrPatch[key] = newAttrs[key]
    }
  }

  return attrPatch
}

function childrenWalk(oldChildren, newChildren) {
  oldChildren.map((c, idx) => {
    vNodeWalk(c, newChildren[idx], ++vnIndex)
  })
}

export default domDiff
