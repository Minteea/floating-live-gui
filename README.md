# Floating Live GUI

Floating Live 弹幕接收工具的可视化界面版本，在 ```floating-live``` 模块的基础上添加了一些操作功能。

后端使用NodeJS开发，可视化程序界面使用Electron实现，前端界面使用React + Typescript开发，UI框架为Ant Design。

目前正处于开发阶段，请谨慎用于正式的使用场景。若使用时出现报错等情况，可在github页面上提issue。

工具库版本：[Minteea/floating-live](https://github.com/Minteea/floating-live)

## 使用方法

### 安装
目前暂未发布可执行程序版本，但可以自行通过 ```yarn package``` 指令打包为可执行程序。

目前也可以通过运行源代码的方式打开程序。

确认电脑上已安装 nodeJS (建议安装最新的稳定版)，并在项目文件夹下输入下列指令以安装依赖。

```
npm install
```

### 运行
输入下列指令打开程序
```
npm run start
```
出现一个程序窗口，代表程序成功运行。

## 功能

### 添加房间
进入【添加房间】选项卡，选择平台并输入直播间id，即可搜索房间。

点击添加按钮可将直播间添加到列表中，点击打开按钮可直接打开房间。

可以在【开始】选项卡中对房间进行操作。

目前支持bilibili直播间及AcFun直播间，后续会添加对更多平台的支持。

### 弹幕保存
进入【弹幕保存】选项卡，打开【记录弹幕到本地】即可记录弹幕。

可以更改弹幕文件保存位置，若文件夹路径不存在则会创建一个。

#### 弹幕格式
为了提高弹幕记录的性能，弹幕记录文件为txt格式，由多个json对象组成，用逗号分隔，形式如下：
```
{消息数据...}, {消息数据...}, {消息数据...},
```
可以将上述内容手动改成json格式，即去掉最后一个多余的逗号，再用中括号```[]```包裹上述内容：
```
[{消息数据...}, {消息数据...}, {消息数据...}]
```
单条消息数据的ts类型格式如下：
```typescript
interface MessageInterface {
    /** 平台名称, 一般为英文小写 */
    platform: string;
    /** 房间号 */
    room: number | string;
    /** 信息类型 */
    type: string;
    /** 记录时间 */
    record_time: number;
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
  "platform": "bilibili",   // 直播平台
  "room": 2064239,          // 房间号
  "type": "chat",           // 消息类型
  "record_time": 1674135210265, // 记录时间
  "info": {
    "timestamp": 1674135209059, // 服务器时间戳
    "color": 14893055,          // 弹幕颜色
    "mode": "bottom",           // 弹幕模式
    "content": "晚上好",        // 弹幕内容
    "user": {               // 用户信息
      "name": "Minteea薄茶",    // 用户名
      "id": 308906789,          // 用户id
      "medal": {                // 粉丝牌信息
        "level": 24,                // 粉丝牌等级
        "name": "鹿侯爷",           // 粉丝牌名称
        "id": 5659864,              // 粉丝牌所属用户id
        "membership": 3             // 粉丝牌直播间会员等级
      },
      "membership": 3,          // 直播间会员等级
      "identity": null,         // 用户身份
      "avatar": "https://i2.hdslb.com/bfs/face/bf71b26822b4fbeca622cbbb184a440c303bc60a.jpg"  // 头像url
    }
  }
}
```

目前支持的消息类型有：
* `chat`[聊天]
* `gift`[礼物]　`superchat`[付费留言]　`membership`[直播间会员开通]
* `entry`[进入]　`like`[点赞]　`share`[分享]　`follow`[关注]　`join`[加入粉丝团]
* `block`[禁言]
* `live_start`[直播开始]　`live_end`[直播结束]　`live_cut`[直播被切断]　`live_change`[直播信息更改]

### 网页版本操作
开发模式下，程序也可以使用网页版进行操作。确保主程序窗口中【本地服务 > 启用websocket服务】处于打开状态。

打开浏览器，在地址栏中输入```localhost:5173```即可进入网页界面（vite server 默认入口）。

此时页面需要与后端连接才能对程序进行操作。在浏览器页面中进入【连接服务】，点击连接按钮即可连接主程序，设置项将实时同步。

## TODO
当前版本 DEV **0.9.0**

⬜计划中 · 🟨开发中 · ✅已实现
* ✅ 网页端操作
* ✅ Typescript 后端
* ✅ 指令工具
* ✅ 聊天图片保存及显示
* ✅ AcFun 弹幕支持
* ✅ B站登录支持
* 🟨 房间收藏及配置保存
* 🟨 插件系统

## Q&A
### 现在已经有很多直播弹幕工具了，为什么还要自己再开发一个
虽然现在有不少直播弹幕接收程序，但是这些程序大部分都只支持一种平台。一些支持多平台的直播弹幕工具也并不开源，甚至要收费，难以实现高度自由的程序拓展。

这个弹幕接收程序的目标是接收来自不同平台的弹幕，将接收到的弹幕处理转化为统一的、易读的弹幕数据，并尽可能多地保存有效信息，提高程序及相关插件的易开发性和可拓展性。

### 为什么要用NodeJS而不是其他语言作为后端
很简单，为了保证前后端代码语言及数据结构的统一。前后端语言统一可以省去很多麻烦，比如可以使用同一套类型声明而无需在前后端同时修改。例如在这个项目的前端代码中就使用了在 floating-live 模块中定义的类型及接口。而且前后端使用一种语言可以降低项目开发者的语言门槛——只要你会写js前端，就一定会看懂nodejs代码。

还有一个原因，我个人基本只会用javascript，对其他语言不是很熟悉QwQ


## 相关链接
* 项目仓库：[github:Minteea/floating-live-gui](https://github.com/Minteea/floating-live-gui) 
* 核心模块：[github:Minteea/floating-live](https://github.com/Minteea/floating-live)
* 构建工具：[github:electron/forge](https://github.com/electron/forge)
### 弹幕获取
* bilibili弹幕库[MIT]: [github:simon300000/bilibili-live-ws](https://github.com/simon300000/bilibili-live-ws)
* AcFun弹幕库[GPLv3]: [github:ACFUN-FOSS/ac-danmu.js](https://github.com/ACFUN-FOSS/ac-danmu.js)
