import fs from 'fs-extra'
import os from 'os'
import { loggerError, loggerSuccess, loggerInfo } from './index.js'

// *读取文件
export const loadFile = (path, system = true) => {
  const rePath = system ? `${os.homedir()}/${path}` : path
  try {
    if (!fs.pathExistsSync(rePath)) {
      return false
    }
    const data = fs.readJsonSync(rePath);
    return data
  } catch (err) {
    loggerError(`Error reading file from disk: ${rePath}`);
  }
}

export const existsFile = (path, system = true) => {
  const rePath = system ? `${os.homedir()}/${path}` : path
  loggerInfo(rePath)
  return fs.pathExistsSync(rePath)
}

// *写入文件
export const writeFile = (path, fileName, file, system = true) => {
  const rePath = system ? `${os.homedir()}/${path}` : path
  loggerInfo(rePath)
  try {
    fs.outputJsonSync(`${rePath}/${fileName}`, file)
    loggerSuccess('Writing file successful!')
  } catch (err) {
    loggerError(`Error writing file from disk: ${err}`);
  }
}
