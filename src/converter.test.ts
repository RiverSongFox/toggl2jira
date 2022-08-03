import * as toggl from './converter'

test('parses toggl csv records', () => {
  expect(toggl.parseTogglEntry({
    description: 'ABC-123 Test',
    startDate: '2020-01-01',
    startTime: '00:00',
    endDate: '2020-01-01',
    endTime: '12:34',
  })).toEqual({
    issueKey: 'ABC-123',
    start: new Date('2020-01-01T00:00'),
    end: new Date('2020-01-01T12:34'),
  })
})

test('skips invalid toggl csv records', () => {
  expect(toggl.parseTogglEntry({
    description: 'Lorem Ipsum',
    startDate: '2020-01-01',
    startTime: '00:00',
    endDate: '2020-01-01',
    endTime: '12:34',
  })).toEqual(null)
})

test('converts toggl entries to worklog entries', () => {
  expect(toggl.convertTogglEntryToWorklog({
    issueKey: 'ABC-123',
    start: new Date('2020-01-01T00:00'),
    end: new Date('2020-01-01T12:34'),
  })).toEqual({
    issueKey: 'ABC-123',
    dateStarted: new Date('2020-01-01T00:00'),
    timeSpent: {
      hours: 12,
      minutes: 34,
    },
  })
})
