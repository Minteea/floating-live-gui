import path from "path"
import fs from "fs"


// 获取绝对路径
export function getAbsPath(p: string) {
  return path.resolve(process.cwd(), p)
}

// 自动创建文件夹并检测文件夹是否可用，若不可用则返回false
export function createFolder(p: string) {
  let absPath = getAbsPath(p)
  try {
    let stat = fs.statSync(absPath)
    return stat.isDirectory()
  } catch(err) {  // ENOENT
    try {
      fs.mkdirSync(absPath, {recursive: true})
      return true
    } catch(err) {  // ENOTDIR
      return false
    }
  }
}
