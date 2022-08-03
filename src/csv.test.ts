import * as csv from './csv'

const CSV = `
Index,Full Name
1,John Doe
`

const JSON = [{
    index: '1',
    fullName: 'John Doe'
}]

test('parses csv into json', () => {
    expect(csv.parse(CSV)).toEqual(JSON)
})

test('converts json to csv', () => {
    expect(csv.stringify(JSON)).toEqual(CSV.trim())
})
