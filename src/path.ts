export function appendFilenameSuffix(filename: string, suffix: string) {
  const extFrom = filename.lastIndexOf('.')

  return filename.slice(0, extFrom) + suffix + filename.slice(extFrom)
}
