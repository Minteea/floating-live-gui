import Storager from "./Storager";

export default class ImageStorage {
  emotion: Storager;
  avatar: Storager;
  constructor(path: string = "./storage/image") {
    this.emotion = new Storager(path, "emotion")
    this.avatar = new Storager(path, "avatar")
  }
}