## template -> 编译 .... -> 形成真实 DOM

- 1、获取到 template
- 2、template -> AST 树

- AST Abstract syntax tree 抽象语法树
- 源代码的抽象语法结构的树状描述

- 3、AST -> render 函数 -> \_c \_v \_s
- 4、render 函数 -> 虚拟节点
- 5、设置 PATCH -> 打补丁到真实 DOM

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
