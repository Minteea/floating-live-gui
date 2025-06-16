import { decode, decodeMulti, encode, ExtensionCodec } from "@msgpack/msgpack";
import { objectReplacers, objectRevivers } from "../json/parser";
import { concat, fromString, toString } from "uint8arrays";

function encodeCustomType(type: string, value: any) {
  return concat([encode(type), encode(value, { extensionCodec })]);
}

function reviveObject(type: string, value: any) {
  const parser = objectRevivers.get(type);
  if (!parser) return value;
  return parser(value);
}

export function serialize(value: any) {
  return encode(value, { extensionCodec, ignoreUndefined: true });
}

export function deserialize(value: any) {
  return decode(value, { extensionCodec });
}

const extensionCodec = new ExtensionCodec();

const EXT_JS_TYPE = 1;

extensionCodec.register({
  type: EXT_JS_TYPE,
  encode: (value: unknown) => {
    console.log(value);
    if (typeof value == "bigint") {
      return encodeCustomType("bigint", bigIntToUint8Array(value));
    } else {
      for (const [predicator, parser] of objectReplacers) {
        if (predicator(value)) {
          const [type, val] = parser(value);
          return encodeCustomType(type, val);
        }
      }
      return null;
    }
  },
  decode: (data: Uint8Array) => {
    const [type, value] = decodeMulti(data, { extensionCodec });
    if (type == "bigint") {
      return uint8ArrayToBigInt(value as Uint8Array);
    } else {
      return reviveObject(type as string, value);
    }
  },
});

function bigIntToUint8Array(bn: bigint): Uint8Array {
  return fromString(bn.toString(16), "base16");
}

function uint8ArrayToBigInt(arr: Uint8Array): bigint {
  return BigInt("0x" + toString(arr, "base16"));
}
