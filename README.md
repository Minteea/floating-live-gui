# Floating Live GUI

Floating Live 弹幕工具的可视化界面版本，基于 `floating-live` 库的基础上添加了一些操作功能。

后端使用 NodeJS + Vite 开发，可视化程序界面使用 Electron 实现，前端界面使用 React + Typescript 开发，UI 框架为 Ant Design。

目前正处于开发阶段，请谨慎用于正式的使用场景。若使用时出现报错等情况，可在 github 页面上提 issue。

工具库版本：[Minteea/floating-live](https://github.com/Minteea/floating-live)

## 使用方法

### 安装

目前暂未发布可执行程序版本，但可以自行打包为可执行程序。

目前也可以通过运行源代码的方式打开程序。

确认电脑上已安装 NodeJS (建议版本 22+)，并在项目文件夹下输入下列指令以安装依赖，此处以 npm 包管理器为例：

```bash
npm install
```

### 运行

输入下列指令打开程序

```bash
npm run start
```

出现一个程序窗口，代表程序成功运行。

### 打包

```bash
npm run package
```

编译后的程序位于项目下的`/out`文件夹，打开文件夹并执行`FloatingLiveGUI.exe`即可。

## 功能

### 添加房间

进入【添加房间】选项卡，选择平台并输入直播间 id，即可搜索房间。

点击添加按钮可将直播间添加到列表中，点击打开按钮可直接打开房间。

可以在【开始】选项卡中对房间进行操作。

目前支持 bilibili 直播间及 AcFun 直播间，后续会添加对更多平台的支持。

### 弹幕保存

进入【弹幕保存】选项卡，打开【记录弹幕到本地】即可记录弹幕。

可以更改弹幕文件保存位置，若文件夹路径不存在则会创建一个。

#### 弹幕格式

为了提高弹幕记录的性能，弹幕记录文件为纯文本格式，文件后缀为`.floatrec`，由多个 json 对象组成，用逗号分隔，形式如下：

```
{消息数据...}, {消息数据...}, {消息数据...},
```

可以将上述内容手动改成 json 格式，即去掉最后一个多余的逗号，再用中括号`[]`包裹上述内容：

```
[{消息数据...}, {消息数据...}, {消息数据...}]
```

单条消息数据的 ts 类型格式如下：

```typescript
interface MessageInterface {
  /** 平台名称, 一般为英文小写 */
  platform: string;
  /** 房间号 */
  room: number | string;
  /** 信息类型 */
  type: string;
  /** 消息时间戳 */
  timestamp: number;
  /** 数据信息, 不同的数据类型具有不同的格式 */
  info: {
    [attr: string]: any;
  };
  /** 其他属性 */
  [attr: string]: any;
}
```

以一条弹幕消息为例：

```json5
{
  platform: "bilibili", // 直播平台
  room: 31426837, // 房间号
  type: "comment", // 消息类型
  timestamp: 1710344147079, // 时间戳
  id: "comment:308906789-1710344147079", // 消息id
  info: {
    color: 5816798, // 颜色
    mode: 1, // 弹幕模式
    content: "晚上好OwO", // 消息内容
    user: {
      // 用户信息
      name: "Minteea薄茶", // 用户名
      id: 308906789, // 用户id
      medal: {
        // 粉丝牌
        level: 25, // 粉丝牌等级
        name: "鹿侯爷", // 粉丝牌
        id: 5659864, // 粉丝牌所属主播用户id
        membership: 3, // 粉丝牌所属直播间会员等级
      },
      membership: 3, // 直播间会员等级
      type: 0, // 用户类型
    },
  },
}
```

目前支持的消息类型及支持程度如下：
🟩 支持　 🟨 部分支持　 ⬜ 尚未支持
|类型 |描述 |bilibili|AcFun|
|---------------|---------------|-------|-----|
|comment |评论 |🟩 |🟩 |
|gift |礼物 |🟩 |🟩 |
|superchat |付费留言 |🟩 | |
|membership |开通直播间会员 |🟩 | |
|entry |进入直播间 |🟩 |🟩 |
|like |点赞 |⬜ |🟩 |
|share |分享直播间 |🟩 |⬜ |
|follow |关注直播间 |🟩 |🟩 |
|join |加入粉丝团 |⬜ |🟩 |
|block |禁言 |🟩 |⬜ |
|lottery |直播抽奖消息 |⬜ | |
|lottery_result |抽奖中奖名单 |⬜ | |
|bonus |用户发送红包 |⬜ |⬜ |
|bonus_result |红包中奖名单 |⬜ |⬜ |
|live_start |直播开始 |🟩 |🟩 |
|live_end |直播结束 |🟩 |🟩 |
|live_cut |直播被切断 |🟩 |🟩 |
|live_detail |直播信息更改 |🟩 |🟩 |
|live_stats |直播数据更新 |🟩 |🟩 |

### 网页版本操作

开发模式下，程序也可以使用网页版进行操作。确保主程序窗口中【本地服务 > 启用 websocket 服务】处于打开状态。

打开浏览器，在地址栏中输入`localhost:5173`即可进入网页界面（vite server 默认入口）。

此时页面需要与后端连接才能对程序进行操作。在浏览器页面中进入【连接服务】，点击连接按钮即可连接主程序，设置项将实时同步。

## TODO

当前版本 **0.11.0** BETA

⬜ 计划中 · 🟨 开发中 · ✅ 已实现

- ✅ B 站登录支持
- ✅ 配置与登录信息保存
- ✅ 服务端插件系统
- ✅ 网页端插件系统
- ⬜ 自动发送弹幕屏蔽插件
- ⬜ 网页服务插件
- ⬜ 弹幕记录文件读取
- ⬜ 插件加载器

## Q&A

### 现在已经有很多直播弹幕工具了，为什么还要自己再开发一个

虽然现在有不少直播弹幕接收程序，但是这些程序大部分都只支持一种平台。一些支持多平台的直播弹幕工具也并不开源，甚至要收费，难以实现高度自由的程序拓展。

这个弹幕接收程序的目标是接收来自不同平台的弹幕，将接收到的弹幕处理转化为统一的、易读的弹幕数据，并尽可能多地保存有效信息，提供给相关插件处理，以实现各种直播功能。

### 为什么要用 JavaScript 而不是其他语言作为后端

众所周知，JavaScript 是网页开发的常用语言，而后端代码与前端语言统一可以省去很多麻烦，比如可以使用同一套类型声明而无需在前后端同时修改。例如在这个项目的前端代码中就使用了在 floating-live 库中定义的 ts 类型及接口。而且前后端使用一种语言可以降低项目开发者的语言门槛。

## 技术栈

- 语言 - TypeScript
- 运行环境 - NodeJS
- 桌面框架 - Electron
- web 框架 - Hono
- 构建工具 - Yarn + Electron Forge

- 前端框架 - React
- 状态管理 - Nanostores
- UI 框架 - Ant Design

## 相关链接

### 项目

- 项目仓库：[github:Minteea/floating-live-gui](https://github.com/Minteea/floating-live-gui)
- 程序库：[github:Minteea/floating-live](https://github.com/Minteea/floating-live)
- 插件库：[github:Minteea/floating-live-plugins](https://github.com/Minteea/floating-live-plugins)

### 相关工具

- 构建工具：[github:electron/forge](https://github.com/electron/forge)

### 弹幕库参考

- bilibili 弹幕库 [MIT]: [github:simon300000/bilibili-live-ws](https://github.com/simon300000/bilibili-live-ws)
- AcFun 弹幕库 [GPLv3]: [github:ACFUN-FOSS/ac-danmu.js](https://github.com/ACFUN-FOSS/ac-danmu.js)
