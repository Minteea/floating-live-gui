import GiftInfo from 'floating-live/src/Message/Info/GiftInfo';
import { acfun, bilibili, PlatformInfo } from './platformInfo';

class Platform {
  map: Map<string, PlatformInfo> = new Map();

  add(p: PlatformInfo) {
    this.map.set(p.id, p);
  }

  getPrivilegeName(platform: string, level?: number | boolean) {
    switch (typeof level) {
      case 'boolean':
        return level ? this.map.get(platform)?.privilege?.name : undefined;
      case 'number':
        return this.map.get(platform)?.privilege?.level?.[level];
      default:
    }
  }

  getGiftValue(platform: string, gift: GiftInfo) {
    const currency =
      this.map.get(platform)?.currency[gift.currency || 'default'];
    return {
      price: gift.value / (currency?.face || 1),
      cny: currency?.cny ? gift.value / currency?.cny : 0,
    };
  }
}

const platform = new Platform();

platform.add(bilibili);
platform.add(acfun);

export default platform;
