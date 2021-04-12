import { parseHtmlToAst } from './astParser'
import { generate } from './generate'

function compileToRenderFunction(html) {
  // console.log(html)
  const ast = parseHtmlToAst(html)
  console.log(ast)
  const code = generate(ast)
  console.log(code)
  const render = new Function(`
          with(this){ return ${code} }
        `)
  return render
}

export { compileToRenderFunction }
