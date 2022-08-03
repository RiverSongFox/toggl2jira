export function appendFilenameSuffix(filename: string, suffix: string) {
  const matches = /^(?<prefix>.*)(?<extension>\..*)$/.exec(filename)
  const { prefix, extension } = matches!.groups ?? {}

  return [
    prefix,
    suffix,
    extension
  ].join('')
}
