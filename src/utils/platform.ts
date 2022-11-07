import { acfun, bilibili, PlatformInfo } from "./platformInfo"
import GiftInfo from "floating-living/src/Message/Info/GiftInfo"

class Platform {
  map: Map<string, PlatformInfo> = new Map()
  add(p: PlatformInfo) {
    this.map.set(p.id, p)
  }
  getPrivilegeName(platform: string, level?: number | boolean) {
    switch (typeof level) {
      case "boolean": return level ? this.map.get(platform)?.privilege?.name : undefined
      case "number": return this.map.get(platform)?.privilege?.level?.[level]
      default: return 
    }
  }
  getGiftValue(platform: string, gift: GiftInfo) {
    let currency = this.map.get(platform)?.currency[gift.currency || "default"]
    return {
      price: gift.value / (currency?.face || 1),
      cny: currency?.cny ? gift.value / currency?.cny : 0
    }
  }
  
}

const platform = new Platform()

platform.add(bilibili)
platform.add(acfun)

export default platform