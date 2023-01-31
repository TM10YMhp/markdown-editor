import runmode, { getLanguage } from "@/utils/runmode"
import { Language } from "@codemirror/language"
import React, { useEffect, useState } from "react"

type Chunk = {
  text: string,
  style: string | null
}

interface Props {
  className: string
  children: React.ReactNode[]
}

const RemarkCode = (props: Props): JSX.Element => {
  const { className, children } = props
  const [elements, setElements] = useState<Chunk[]>([])
  const langName: string = className.substring(9)

  useEffect(() => {
    getLanguage(langName)
      .then((language: Language | null) => {
        if (!language) return

        const body = children?.[0]?.toString() || ''
        const chunks: Chunk[] = []

        runmode(body, language, (text, style) => {
          chunks.push({ text, style })
        })
        setElements(chunks)
      })
  }, [children])

  if(!elements.length) return <code>{children}</code>

  return (
    <code>
      {elements.map((element, i) => (
        <span key={i} className={element.style ?? ''}>{element.text}</span>
      ))}
    </code>
  )
}

export default RemarkCode
