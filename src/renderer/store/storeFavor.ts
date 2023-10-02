class StoreFavor {
  list: Array<{
    platform: string;
    id: string;
    name: string;
    avatar: string;
  }> = [];

  /** 添加收藏 */
  add(r: { platform: string; id: string; name: string; avatar: string }) {
    this.list.push(r);
  }

  /** 移除收藏 */
  remove(i: number) {
    return this.list.splice(i, 1);
  }
}

const storeFavor = new StoreFavor();

export default storeFavor;
