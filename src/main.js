const _ = require('lodash')
const fs = require('fs')

function readCSV (file) {
  const [header, ...data] = fs.readFileSync(file, 'utf-8').trim().split(/[\r\n]+/)
  const keys = header.split(',').map(_.camelCase)

  const json = data.map(line => {
    const fields = line.split(',')

    return fields.reduce((acc, field, index) => {
      acc[keys[index]] = field
      return acc
    }, {})
  })

  return json.map(object => _.mapKeys(object, (_value, key) => _.camelCase(key)))
}

function divRem (n, d) {
  return [
    ~~(n / d),
    n % d
  ]
}

function formatDuration (a, b) {
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

function toDateTime (date, time) {
  return new Date(`${date}T${time}`)
}

function diffInSeconds (a, b) {
  const diff = Math.abs(a.getTime() - b.getTime())
  return Math.round(diff / 1000)
}

function parseToggl (entries) {
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

function formatWorklog (entries) {
  return [
    'Issue Key,Date Started,Time Spent',
    ...entries.map(e => [
      e.issueKey,
      e.dateStarted,
      e.timeSpent
    ].join(','))
  ].join('\n')
}

function appendFilenameSuffix (filename, suffix) {
  const matches = /^(?<prefix>.*)(?<extension>\..*)$/.exec(filename)
  const { prefix, extension } = matches.groups

  return [
    prefix,
    suffix,
    extension
  ].join('')
}

function main (file) {
  const csv = readCSV(file)
  const entries = parseToggl(csv)
  const worklog = formatWorklog(entries)

  fs.writeFileSync(
    appendFilenameSuffix(file, '-jira'),
    worklog,
    'utf-8'
  )
}

// ;(() => {
//   main(process.argv[2])
// })()

module.exports = {
  readCSV,
  formatDuration,
  parseToggl,
  toDateTime,
  diffInSeconds,
  formatWorklog,
  appendFilenameSuffix,
  main
}
