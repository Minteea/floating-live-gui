export const objectRevivers = new Map<string, (v: any) => any>([
  ["Date", (v) => new Date(v)],
  ["RegExp", (v) => RegexParser(v)],
  ["Set", (v) => new Set(v)],
  ["Map", (v) => new Map(v)],
  ["Error", (v) => parseError(v)],
]);

export const objectReplacers = new Map<
  (v: any) => boolean,
  (v: any) => [string, any]
>([
  [(v) => v instanceof Date, (v: Date) => ["Date", v.getTime()]],
  [(v) => v instanceof RegExp, (v: RegExp) => ["RegExp", v.toString()]],
  [(v) => v instanceof Set, (v: Set<any>) => ["Set", [...v]]],
  [(v) => v instanceof Map, (v: Map<any, any>) => ["Map", [...v]]],
  [(v) => v instanceof Error, (v: Error) => ["Error", serializeError(v)]],
]);

function RegexParser(input: string) {
  const m = input.match(/(\/?)(.+)\1([a-z]*)/i)!;

  return new RegExp(m[2], m[3]);
}

function serializeError(err: Error) {
  const { name, message, stack, cause } = err;
  return { ...err, name, message, stack, cause };
}

function parseError(obj: Record<string, any>) {
  const { name, message, stack, cause, ...prop } = obj;
  const err = new Error(message);
  err.name = name;
  err.stack = stack;
  err.cause = cause;
  Object.assign(err, prop);

  return err;
}
