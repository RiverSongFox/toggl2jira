import * as datetime from './datetime'

test('converts date and time strings', () => {
  expect(datetime.toDateTime('2020-01-01', '00:00')).toEqual(new Date('2020-01-01T00:00'))
})

test('computes duration', () => {
  expect(datetime.computeDuration(
    new Date('2020-01-01T00:00:00'),
    new Date('2020-01-01T12:34:56')
  )).toEqual({
    hours: 12,
    minutes: 35
  })
})

test('formats duration', () => {
  expect(datetime.formatDuration({
    hours: 12,
    minutes: 34
  })).toEqual('12h 34m')
})

test('formats dates', () => {
  expect(datetime.formatDate(new Date('2020-01-01T12:34:56'))).toEqual('2020-01-01 12:34:56')
})

test('computes difference in seconds between dates', () => {
  expect(datetime.diffInSeconds(
    new Date('2020-01-01T00:00:00.000'),
    new Date('2020-01-01T01:23:44.999')
  )).toEqual(3600 + 23 * 60 + 45)
})

test('divides and returns remainder', () => {
  expect(datetime.divRem(7, 3)).toEqual([2, 1])
})
