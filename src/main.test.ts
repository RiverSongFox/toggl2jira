import { readFileSync } from 'fs';
import { main } from './main'

test('e2e', () => {
  main('./test/toggl.csv')

  const reference = readFileSync('./test/toggl-jira-reference.csv', 'utf-8')
  const actual = readFileSync('./test/toggl-jira.csv', 'utf-8')

  expect(actual).toEqual(reference)
})
