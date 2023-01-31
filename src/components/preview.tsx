import rehypeReact from "rehype-react"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import { unified } from "unified"
import { createElement, Fragment } from "react"
import remarkRehype from "remark-rehype"
import 'github-markdown-css/github-markdown-dark.css'
import RemarkCode from "./remark-code"

interface Props {
  doc: string
}
const Preview = (props: Props): JSX.Element => {
  const { doc } = props
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // @ts-expect-error
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        code: RemarkCode
      }
    })
    .processSync(doc).result

  return (
    <div
      className="markdown-body overflow-auto p-6 !bg-transparent
      border-gray-700 border-t sm:border-l sm:border-t-0"
    >
      {md}
    </div>
  )
}

export default Preview
