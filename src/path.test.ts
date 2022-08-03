import * as path from './path'

test('append suffix to a fileame', () => {
  expect(path.appendFilenameSuffix('file.txt', '-new')).toEqual('file-new.txt')
})
