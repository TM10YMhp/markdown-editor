import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting
} from "@codemirror/language"
import { languages } from "@codemirror/language-data"
import { EditorState } from "@codemirror/state"
import { oneDark } from "@codemirror/theme-one-dark"
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  ViewUpdate
} from "@codemirror/view"
import { tags } from "@lezer/highlight"
import { RefObject, useEffect, useRef } from "react"

const transparentTheme = EditorView.theme({
  '&': {
    background: 'transparent !important',
    height: '100%'
  },
  ".cm-gutters": {
    background: 'transparent !important',
  },
  ".cm-activeLineGutter": {
    background: '#ffffff22 !important',
  },
  ".cm-activeLine": {
    background: '#ffffff22 !important',
  }
})

const syntax = HighlightStyle.define([
  { tag: tags.heading1, fontSize: '1.6em' },
  { tag: tags.heading2, fontSize: '1.4em' },
  { tag: tags.heading3, fontSize: '1.2em' }
])

interface Props {
  initialDoc: string,
  onChange?: (state: string) => void
}

const useCodeMirror = (props: Props): RefObject<HTMLDivElement>[] => {
  const { initialDoc, onChange } = props
  const refContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!refContainer.current) return

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        bracketMatching(),
        indentOnInput(),
        history(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        oneDark,
        transparentTheme,
        syntaxHighlighting(syntax),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            onChange && onChange(update.state.doc.toString())
          }
        })
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: refContainer.current
    })

    return () => view.destroy()
  }, [refContainer])

  return [refContainer]
}

export default useCodeMirror
