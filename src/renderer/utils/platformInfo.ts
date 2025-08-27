export interface PlatformInfo {
  /** 平台名称 */
  name: string;
  /** 平台id */
  id: string;
  /** 平台vip信息 */
  vip?: {
    /** 平台vip对应id */
    id: string;
    /** 平台vip名称 */
    name: string;
    /** 平台vip等级名称 */
    level?: Array<string | null>;
  };
  /** 粉丝vip信息 */
  privilege?: {
    /** 粉丝vip对应id */
    id: string;
    /** 粉丝vip名称 */
    name: string;
    /** 粉丝vip等级名称 */
    level?: Array<string | null>;
  };
  /** 礼物信息 */
  gift: {
    /** 送出礼物时的行为 */
    action?: string;
  };
  /** 货币 */
  currency: {
    /** 货币种类 */
    [id: string]: {
      /** 货币名称 */
      name: string;
      /** 1货币面值等值value (1面值/1数值) (默认值为1) */
      face?: number;
      /** 1人民币等值value (1.00CNY/1数值) (若为0则为免费货币) */
      cny?: number;
    };
  };
}

export const bilibili: PlatformInfo = {
  name: "bilibili",
  id: "bilibili",
  vip: {
    id: "milord",
    name: "直播老爷",
  },
  privilege: {
    id: "guard",
    name: "大航海",
    level: [null, "总督", "提督", "舰长"],
  },
  gift: {
    action: "投喂",
  },
  currency: {
    gold: {
      name: "电池",
      face: 100, // 1金电池=100金瓜子
      cny: 1000, // 1人民币=1000金瓜子
    },
    silver: {
      name: "银瓜子",
      face: 1,
    },
  },
};

export const acfun: PlatformInfo = {
  name: "AcFun",
  id: "acfun",
  gift: {
    action: "送出",
  },
  currency: {
    coin: {
      name: "AC币",
      face: 1,
      cny: 10, // 1人民币=10AC币
    },
  },
};
