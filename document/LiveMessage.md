# 直播消息

## 来源

可通过监听实例的 `live_message` 事件获取，也可以在弹幕记录文件中获取。

## 支持类型

## 格式

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

### `chat`
聊天消息。其`info`属性类型如下：

```typescript
interface {
  /** 用户信息 */
  user: UserInfo;
  /** 日期时间戳 */
  timestamp: number;
  /** 文本内容 */
  content: string;
  /** 文字颜色 */
  color?: number | string;
  /** 弹幕模式 */
  mode?: number | string;
  /** 文字大小 */
  size?: number | string;
  /** 图片信息 */
  image?: ImageInfo;
  /** 表情信息 */
  emoticon?: {
      [keyword: string]: ImageInfo;
  };
  /** 标签信息 */
  tag?: string;
}
```


### `gift`
礼物消息。其`info`属性类型如下：

###