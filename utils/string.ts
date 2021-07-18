function toTitleCaseDelimited(str: string, delimiter: string = ' ') {
  const ignoredWords = ['la', 'le', 'les', 'du', 'des', 'de', 'à', 'aux']
  return str
    .toLowerCase()
    .split(delimiter)
    .filter((word) => word.length > 0)
    .map(function (word) {
      return ignoredWords.includes(word.toLowerCase())
        ? word
        : word.replace(word[0], word[0].toUpperCase())
    })
    .join(delimiter)
}

export function toTitleCase(str: string) {
  return toTitleCaseDelimited(toTitleCaseDelimited(str), '-')
}
