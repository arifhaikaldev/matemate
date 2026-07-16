import ReactMarkdown from 'react-markdown'

interface Props {
  kandungan: string
}

export function MarkdownRenderer({ kandungan }: Props) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-ul:my-2 prose-li:my-0.5">
      <ReactMarkdown>{kandungan}</ReactMarkdown>
    </div>
  )
}
