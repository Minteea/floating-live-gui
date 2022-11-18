import path from "path"
import fs from "fs"
import axios from "axios"
import { createFolder } from "../utils/file"

export default class Storager {
  /** 资源存储表，若已存在id及url相同的资源，则无需再次请求 */
  storeMap: Map<string, string> = new Map()
  /** 存储集存放路径 */
  path: string
  /** 存储集名称 */
  name: string
  /** 存储分支集合，若存在名称，表示分支文件夹已创建，无需检查并创建文件夹 */
  branches: Set<string> = new Set()
  constructor(path: string, name: string) {
    this.path = path
    this.name = name
  }
  store(branch: string, id: string | number, url: string, format: string) {
    // 检查存储表中是否存在同一id同一url的资源，若存在则无需再次请求
    if(this.storeMap.get(`${branch}/${id}`) == url) return
    this.checkBranch(branch)
    console.log('正在保存:' + `${branch}/${id}`);
    axios.get(url, {responseType: 'arraybuffer'})
      .then((response) => {
        if (response.status != 200) return;
        fs.writeFile(path.join(this.path, this.name, branch,`${id}.${format}`), response.data, (err) => {
          if (err) throw err;
          console.log('保存成功:' + `${branch}/${id}`);
          // 保存成功后将文件url添加至存储表
          this.storeMap.set(`${branch}/${id}`, url)
      });
    })
  }
  /** 检查存储分支是否存在，若不存在则添加分支并创建一个文件夹，若文件夹不可创建则报错 */
  checkBranch(branch: string) {
    if (this.branches.has(branch)) return
    let status = createFolder(path.join(this.path, this.name, branch))
    if (status) {
      this.branches.add(branch)
    } else {
      throw Error("无效的文件夹路径")
    }
  }
}
