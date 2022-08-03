import { readFileSync, writeFileSync } from 'fs'
import { convertTogglEntryToWorklog, parseTogglEntry, stringifyWorklogEntry } from "./converter"
import { parse, stringify } from "./csv"
import { appendFilenameSuffix } from './path'

export function main(file: string) {
  const togglCSV = readFileSync(file, 'utf-8')

  const worklogs = parse(togglCSV)
    .map(parseTogglEntry)
    .map(convertTogglEntryToWorklog)
    .map(stringifyWorklogEntry)

  const jiraCSV = stringify(worklogs)

  writeFileSync(
    appendFilenameSuffix(file, '-jira'),
    jiraCSV,
    'utf-8'
  )
}
