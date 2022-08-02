const _ = require('lodash')
const fs = require('fs')

export interface WorklogEntry {
  issueKey: string,
  dateStarted: string,
  timeSpent: string
}

type CSVRecord = Record<string, string>
type CSVDocument = CSVRecord[]

export function readCSV(file: string): CSVDocument {
  const [header, ...data] = fs.readFileSync(file, 'utf-8').trim().split(/[\r\n]+/)
  const keys = header.split(',').map(_.camelCase)

  const json = data.map((line: string) => {
    const fields = line.split(',')

    return fields.reduce((acc: CSVRecord, field: string, index: number) => {
      acc[keys[index]] = field
      return acc
    }, {})
  })

  return json.map((object: CSVRecord) => _.mapKeys(object, (_value: unknown, key: string) => _.camelCase(key)))
}

export function divRem(n: number, d: number) {
  return [
    ~~(n / d),
    n % d
  ]
}

export function formatDuration(a: Date, b: Date) {
  const seconds = diffInSeconds(a, b)
  const [hours, rh] = divRem(seconds, 3600)
  let [minutes, rm] = divRem(rh, 60)

  if (rm >= 30) {
    minutes += 1
  }

  return [
    hours && `${hours}h`,
    minutes && `${minutes}m`
  ]
    .filter(Boolean)
    .join(' ')
}

export function toDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`)
}

export function diffInSeconds(a: Date, b: Date) {
  const diff = Math.abs(a.getTime() - b.getTime())
  return Math.round(diff / 1000)
}

export function parseToggl(entries: CSVDocument) {
  return entries.map(entry => {
    const [issueKey] = entry.description.split(/\s/)

    return {
      issueKey,
      dateStarted: `${entry.startDate} ${entry.startTime}`,
      timeSpent: formatDuration(
        toDateTime(entry.startDate, entry.startTime),
        toDateTime(entry.endDate, entry.endTime)
      )
    }
  })
}

export function formatWorklog(entries: WorklogEntry[]) {
  return [
    'Issue Key,Date Started,Time Spent',
    ...entries.map(e => [
      e.issueKey,
      e.dateStarted,
      e.timeSpent
    ].join(','))
  ].join('\n')
}

export function appendFilenameSuffix(filename: string, suffix: string) {
  const matches = /^(?<prefix>.*)(?<extension>\..*)$/.exec(filename)
  const { prefix, extension } = matches!.groups ?? {}

  return [
    prefix,
    suffix,
    extension
  ].join('')
}

export function main(file: string) {
  const csv = readCSV(file)
  const entries = parseToggl(csv)
  const worklog = formatWorklog(entries)

  fs.writeFileSync(
    appendFilenameSuffix(file, '-jira'),
    worklog,
    'utf-8'
  )
}
