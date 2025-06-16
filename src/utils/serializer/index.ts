import { serialize, deserialize } from "./msgpack";
import { decode } from "@msgpack/msgpack";
import {
  serialize as serializeError,
  parse as parseError,
} from "error-serializer";

const data = {
  string: "abc",
  number: 1,
  boolean: true,
  object: { a: 0, b: "", c: false },
  null: null,
  undefined: undefined,
  Map: new Map([
    [123, "abc"],
    [345, "true"],
  ]),
  Set: new Set([123, 456]),
  Date: new Date(),
  RegExp: /abc/i,
  array: [1, "a", true],
  numbers: [123, Infinity, -Infinity, NaN, 0],
  bigint: 1234567890987654321n,
  // function: () => true,
  // symbol: Symbol(),
};

/* const ser = serialize(data);
console.log(ser);

console.log(decode(ser));

console.log(deserialize(ser));

console.log(data); */
const err = new Error("aaaa");
err.cause = "111";
const sererr: any = serializeError(err);

console.log(sererr);
// console.dir(parseError(sererr));
console.dir(err);
