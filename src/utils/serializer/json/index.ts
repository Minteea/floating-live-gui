import { objectReplacers, objectRevivers } from "./parser";

export function replacer(_key: string, value: unknown) {
  if (value == null) {
    return value;
  } else if (typeof value == "object") {
    return replaceObject(value);
  } else if (typeof value == "number") {
    return Number.isFinite(value)
      ? value
      : { $type: "number", $value: value.toString() };
  } else if (typeof value == "bigint") {
    return { $type: "bigint", $value: value.toString() };
  } else return value;
}

function replaceObject(value: Record<string, any>) {
  for (const [predicator, parser] of objectReplacers) {
    if (predicator(value)) {
      const [$type, $value] = parser(value);
      return { $type, $value };
    }
  }
  return value.toJSON ? value.toJSON() : value;
}

type Json = string | number | null | boolean | Json[] | { [key: string]: Json };

export function reviver(
  _key: string,
  value: Json & { $type?: string; $value?: any }
) {
  if (!value?.$type) {
    return value;
  } else if (value.$type == "number") {
    return Number(value.$value);
  } else if (value.$type == "bigint") {
    return BigInt(value.$value);
  } else {
    return reviveObject(value);
  }
}

function reviveObject(
  value: Record<string, any> & { $type?: string; $value?: any }
) {
  const parser = objectRevivers.get(value.$type!);
  if (!parser) return value.$value ?? value;
  return parser(value.$value);
}

export function serialize(value: any) {
  return JSON.stringify(value, function (k) {
    return replacer(k, this[k]);
  });
}

export function deserialize(value: any) {
  return JSON.parse(value, reviver);
}
