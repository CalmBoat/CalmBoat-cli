import { loggerError, loggerSuccess, getDirPath, getCwdPath, loggerWarring } from '../utils/index.js'
import { loadFile, writeFile } from '../utils/file.js'
import download from 'download-git-repo'

const cacheTpl = '.calmboatCache'

// *添加模板信息
export const updateTpl = async (params) => {
  const { tplUrl, name, desc } = params
  const { pathname } = new URL(tplUrl)
  let isExist = false
  try {
    const reTpl = {
      tplUrl,
      name,
      desc
    }
    // *判断如果是 github，则设置对应的代码下载地址和 api 地址
    if (tplUrl.includes('github.com')) {
      reTpl.org = pathname.substring(1)
      reTpl.downloadUrl = 'https://codeload.github.com'
      reTpl.apiUrl = 'https://api.github.com'
    }

    const tplConfig = loadFile(`${cacheTpl}/.tpl.json`)
    let file = [reTpl]
    
    // todo 理解这段代码
    if (tplConfig) {
      isExist = tplConfig.some(tpl => tpl.name === name)
      if (isExist) {
        file = tplConfig.map(tpl => {
          if (tpl.name === name) {
            return reTpl
          }
          return tpl
        })
      } else {
        file = [
          ...tplConfig,
          ...file
        ]
      }
    }
    writeFile(cacheTpl, '.tpl.json', file)
    loggerSuccess(`${isExist ? 'Update' : 'Add'} Template Successful!`)
  } catch (error) {
    loggerError(`${error}`)
  }
}

// *获取模板列表
export const getTplList = () => {
  try {
    const tplConfig = loadFile(`${cacheTpl}/.tpl.json`)
    if (tplConfig) {
      return tplConfig
    }
    loggerWarring('No template! Please add template first!')
    process.exit(1)
  } catch (error) {
    loggerError(`${error}`)
  }
}

// *载入模板
export const loadTpl = (name, downloadUrl, path) => {
  download(`direct:${downloadUrl}`, getCwdPath(`./${path}`), (err) => {
    if (err) {
      loggerError(`${err}`)
    } else {
      loggerSuccess(`Download ${name} Template Successful!`)
    }
  })
}