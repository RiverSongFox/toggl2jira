import { readFileSync, writeFileSync } from 'fs'
import { convertTogglEntryToWorklog, parseTogglEntry, stringifyWorklogEntry, TogglEntry } from "./converter"
import { parse, stringify } from "./csv"
import { appendFilenameSuffix } from './path'

export function main(file: string) {
  const togglCSV = readFileSync(file, 'utf-8')

  const filteredTogglEntries = parse(togglCSV)
    .map(parseTogglEntry)
    .filter(Boolean) as TogglEntry[]

  const worklogs = filteredTogglEntries
    .map(convertTogglEntryToWorklog)
    .map(stringifyWorklogEntry)

  const jiraCSV = stringify(worklogs)

  writeFileSync(
    appendFilenameSuffix(file, '-jira'),
    jiraCSV,
    'utf-8'
  )
}
