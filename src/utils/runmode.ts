import { Language, LanguageDescription } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import { highlightTree } from "@lezer/highlight";

type RunModeCallBack = (
  text: string,
  style: string | null,
  from: number,
  to: number
) => void

function runmode(
  textContent: string,
  language: Language,
  callback: RunModeCallBack
): void {
  const tree = language.parser.parse(textContent)
  let pos = 0

  highlightTree(tree, oneDarkHighlightStyle, (from, to, classes) => {
    if (from > pos) {
      callback(textContent.slice(pos, from), null, pos, from)
    }
    callback(textContent.slice(from, to), classes, from, to)
    pos = to
  })

  if (pos !== tree.length) {
    callback(textContent.slice(pos, tree.length), null, pos, tree.length)
  }
}

export function findLanguage(langName: string): LanguageDescription | null {
  const language = languages.find((lang: LanguageDescription) => {
    return lang.alias.includes(langName)
  })

  if (!language) return null

  return language
}

export async function getLanguage(langName: string): Promise<Language | null> {
  const language = findLanguage(langName)

  if (!language) return null

  const langSupport = await language.load()
  return langSupport.language
}

export default runmode
