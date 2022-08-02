const fs = require('fs')
const { readCSV, main, parseToggl, appendFilenameSuffix, toDateTime, formatDuration, diffInSeconds, formatWorklog } = require('./main')

test('reads csv files', async () => {
  expect(readCSV('./test/toggl.csv')).toEqual([{
    amountUsd: '123.45',
    billable: 'Yes',
    client: 'ACME',
    description: 'JIRA-1234 Automate Toggl to Jira Conversion',
    duration: '01:23:45',
    email: 'john.doe@example.com',
    endDate: '2022-08-02',
    endTime: '18:23:45',
    project: 'Foo',
    startDate: '2022-08-02',
    startTime: '17:00:00',
    tags: '',
    task: '',
    user: 'John Doe'
  }])
})

test('converts separate date time to a date', () => {
  expect(toDateTime('2013-08-31', '10:30')).toEqual(new Date('2013-08-31T10:30'))
})

test('calculates difference in seconds between dates', () => {
  expect(diffInSeconds(
    new Date('2022-08-02T17:00:00.000'),
    new Date('2022-08-02T18:23:45.678')
  )).toEqual(
    1 * 3600 +
    23 * 60 +
    45 + 1 /* rounding ms */
  )
})

test('formats duration', () => {
  expect(formatDuration(
    new Date('2022-08-02T17:00:00.000'),
    new Date('2022-08-02T18:23:45.678')
  )).toEqual('1h 24m')
})

test('parses toggl entries', () => {
  const data = readCSV('./test/toggl.csv')

  expect(parseToggl(data)).toEqual([{
    issueKey: 'JIRA-1234',
    dateStarted: '2022-08-02 17:00:00',
    timeSpent: '1h 24m'
  }])
})

test('converts worklogs to csv', () => {
  expect(formatWorklog([{
    issueKey: 'JIRA-1234',
    dateStarted: '2022-08-02 17:00:00',
    timeSpent: '1h 24m'
  }])).toEqual(
    'Issue Key,Date Started,Time Spent\n' +
    'JIRA-1234,2022-08-02 17:00:00,1h 24m'
  )
})

test('appends a suffix to filename', () => {
  expect(appendFilenameSuffix('~/some/file.csv', '-jira'))
    .toEqual('~/some/file-jira.csv')
})

test('e2e', () => {
  main('./test/toggl.csv')

  const reference = fs.readFileSync('./test/toggl-jira-reference.csv')
  const actual = fs.readFileSync('./test/toggl-jira.csv')

  expect(actual).toEqual(reference)
})
