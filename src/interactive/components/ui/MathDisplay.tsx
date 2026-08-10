import katex from 'katex'

export function renderLatex(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    })
  } catch {
    return latex
  }
}

export function renderLatexDisplay(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: true,
    })
  } catch {
    return latex
  }
}

export function MathInline({ children }: { children: string }) {
  return (
    <span
      className="katex-inline"
      dangerouslySetInnerHTML={{ __html: renderLatex(children) }}
    />
  )
}

export function MathDisplay({ children }: { children: string }) {
  return (
    <div
      className="katex-block my-2"
      dangerouslySetInnerHTML={{ __html: renderLatexDisplay(children) }}
    />
  )
}