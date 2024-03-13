const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.60";

/** 等待一段时间 */
const wait = (delay: number) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve(void 0);
    }, delay);
  });

/** 头像池 */
export default class AvatarService {
  /** 请求间隔 */
  interval: number;
  /** 超时限制 */
  timeout: number;
  lastRequestTime = 0;
  /** 头像表 */
  avatarMap = new Map<string, string>();
  /** 请求表 */
  requestMap = new Map<string, Promise<string | undefined>>();

  constructor({ interval, timeout }: { interval: number; timeout: number }) {
    this.interval = interval;
    this.timeout = timeout;
  }
  /** 发送头像请求 */
  async requestAvatar(uid: string, delay?: number) {
    if (delay) await wait(delay);
    const { code, data } = await fetch(
      `https://api.bilibili.com/x/space/wbi/acc/info?mid=${uid}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    ).then((res: any) => res.json());
    if (code == 0) {
      const url = data.face as string;
      this.requestMap.delete(uid);
      this.avatarMap.set(uid, url);
      console.log(`[${this.avatarMap.size}]从API获取: ${uid} -> ${url}`);
      return url;
    }
  }
  /** 获取头像 */
  async get(uid: string) {
    let url = this.avatarMap.get(uid);
    if (url) {
      console.log(`[${this.avatarMap.size}]从缓存获取: ${uid} -> ${url}`);
    } else {
      /** 如果uid处于请求中状态，则获取正在请求的promise */
      let avatarRequest = this.requestMap.get(uid);
      console.log(`请求头像: ${uid}`);
      if (!avatarRequest) {
        const now = Date.now();
        let delay = this.lastRequestTime - now;
        console.log(delay);
        if (delay < 0) delay = 0;
        else if (delay > this.timeout) return;
        this.lastRequestTime = now + delay + this.interval;
        console.log(`首次请求: ${uid}`);
        avatarRequest = this.requestAvatar(uid, delay);
        this.requestMap.set(uid, avatarRequest);
      }
      url = await avatarRequest;
    }
    return url;
  }
}
