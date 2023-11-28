const _ = require('lodash');

export type CSVRecord = Record<string, string>;
export type CSVDocument = CSVRecord[];

export function parse(string: string): CSVDocument {
  const [header, ...data] = string.trim().split(/[\r\n]+/);
  const keys: string[] = header.split(',').map(_.camelCase);

  const json = data.map((line: string) => {
    const fields = line
      .split(',')
      .map(value => value.replace(/^"|"$/g, ''))

    return fields.reduce((acc: CSVRecord, field: string, index: number) => {
      acc[keys[index]] = field;
      return acc;
    }, {});
  });

  return json.map((object: CSVRecord) => _.mapKeys(object, (_value: unknown, key: string) => _.camelCase(key)));
}

export function stringify(entries: CSVDocument): string {
  const keys = Object.keys(entries[0]);
  const table = [
    keys.map(_.startCase),
    ...entries.map(e => _.values(_.pick(e, keys)))
  ]

  return table
    .map(columns => columns.join(','))
    .join('\n');
}
