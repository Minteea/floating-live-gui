export const objectRevivers = new Map<string, (v: any) => any>([
  ["Date", (v) => new Date(v)],
  ["RegExp", (v) => RegexParser(v)],
  ["Set", (v) => new Set(v)],
  ["Map", (v) => new Map(v)],
]);

export const objectReplacers = new Map<
  (v: any) => boolean,
  (v: any) => [string, any]
>([
  [(v) => v instanceof Date, (v: Date) => ["Date", v.getTime()]],
  [(v) => v instanceof RegExp, (v: RegExp) => ["RegExp", v.toString()]],
  [(v) => v instanceof Set, (v: Set<any>) => ["Set", [...v]]],
  [(v) => v instanceof Map, (v: Map<any, any>) => ["Map", [...v]]],
]);

function RegexParser(input: string) {
  const m = input.match(/(\/?)(.+)\1([a-z]*)/i)!;

  return new RegExp(m[2], m[3]);
}
