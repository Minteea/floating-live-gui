export const secondToTime = (second: number): string => {
  second = second || 0
  if (second === 0 || second === Infinity || second.toString() === "NaN") {
    return "00:00"
  }
  const hour = Math.floor(second / 3600)
  const min = Math.floor((second - hour * 3600) / 60)
  const sec = Math.floor(second - hour * 3600 - min * 60)
  return (hour > 0 ? `${hour}:` : "") + ([min, sec])
    .map((num: number) => (num.toString().padStart(2, "0"))).join(":")
}
