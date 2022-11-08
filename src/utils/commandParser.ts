import YAML from "yaml"
import bracketSplit from "./bracketSplit"

export default function commandParser(str: string) {
  let arr: any[] = []
  try {
    bracketSplit(" ", str)
      .forEach((subStr) => {
        if (subStr) {
          arr.push(YAML.parse(subStr))
        }
      })
    return arr
  } catch (err) {
    throw err
  }
}