import { app } from "electron";
import { FloatingLive } from "floating-live";
import fs from "node:fs";
import path from "node:path";

interface AppBlacklistItem {
  platform: string;
  id: number;
  name: string;
  reason: string;
}

/** 应用程序黑名单用户，被列入黑名单的用户禁止使用本发行版程序副本 */
const blacklist: AppBlacklistItem[] = [
  {
    platform: "bilibili",
    id: 396972670,
    name: "帝森之御（翟森）",
    reason:
      "为达到抹黑某位主播的目的，多次在其他主播直播间和无关视频下发引战弹幕和评论，造成恶劣影响。详见[https://www.bilibili.com/opus/667110658526937138]",
  },
];

const lockpath = path.resolve(app.getPath("appData"), "floabl.txt");

/** 禁止黑名单用户使用本程序，若本机有登录黑名单用户账号的记录，将直接退出程序 */
export default class AppBlacklist {
  static pluginName = "appBlackList";
  constructor(main: FloatingLive) {
    if (fs.existsSync(lockpath)) {
      console.log("您已被禁止使用本程序");
      try {
        const reason = fs.readFileSync(lockpath, { encoding: "utf-8" });
        console.log(reason);
      } finally {
        this.quitApp();
      }
    }
    main.on("auth:update", (platform, userId) => {
      const result = blacklist.find(
        (u) => u.platform == platform && u.id == userId
      );
      if (result) {
        console.log(
          `检测到黑名单用户: ${result.name} (${result.platform}-${result.id})`
        );
        console.log(`黑名单原因: ${result.reason}`);
        this.addBlockFile(
          `本机存在黑名单用户登录记录: ${result.name} (${result.platform}-${result.id})\n黑名单原因：${result.reason}`
        );
        this.quitApp();
      }
    });
  }
  register() {}
  /** 退出程序 */
  quitApp() {
    app.quit();
  }
  addBlockFile(reason: string) {
    fs.writeFileSync(lockpath, reason, {
      encoding: "utf-8",
    });
  }
}
