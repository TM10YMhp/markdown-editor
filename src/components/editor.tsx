import React from "react"
import useCodeMirror from '@/hooks/useCodeMirror'

interface Props {
  initialDoc: string,
  onChange: (doc: string) => void
}

const Editor = (props: Props): JSX.Element => {
  const { onChange, initialDoc } = props
  const handleChange = (state: string) => {
    onChange(state)
  }

  const [refContainer] = useCodeMirror({
    initialDoc: initialDoc,
    onChange: handleChange
  })

  return <div ref={refContainer}></div>
}

export default React.memo(Editor)
