import inquirer from "inquirer";
import { updateTpl, getTplList, loadTpl } from "../template/index.js";
import { Subject } from "rxjs";
import { getGithubBranch } from "../github/index.js";
import { loggerError } from "../utils/index.js";

const promptList = [
  {
    type: 'input',
    message: '请输入仓库地址:',
    name: 'tplUrl',
    default: 'https://github.com/Cuz0224/cra-template'
  },
  {
    type: 'input',
    message: '模板标题(默认为 Git 名作为标题):',
    name: 'name',
    default({ tplUrl }) {
      return tplUrl.substring(tplUrl.lastIndexOf('/') + 1)
    }
  },
  {
    type: 'input',
    message: '描述:',
    name: 'desc',
  }
];


// *添加模板
export const addTpl = () => {
  inquirer.prompt(promptList).then((answers) => {
    const { tplUrl, name, desc } = answers
    updateTpl({ tplUrl, name, desc })
  })
}


// *选择模板下载
 export const selectTpl = async () => {
  const prompts = new Subject();
  let select
  let githubName
  let path
  let loadUrl

  try {
    const onEachAnswer = async (result) => {
      const { name, answer } = result
      if (name === 'name') {
        githubName = answer
        select = tplList.filter((tpl) => tpl.name === answer)[0]
        const { downloadUrl, org } = select
        const branches = await getGithubBranch(select)
        loadUrl = `${downloadUrl}/${org}/zip/refs/heads`
        if (branches.length === 1) {
          loadUrl = `${loadUrl}/${branches[0].name}`
          prompts.next({
            type: 'input',
            message: '下载路径:',
            name: 'path',
            default: githubName
          });
        } else {
          prompts.next({
            type: 'list',
            message: '请选择分支:',
            name: 'branch',
            choices: branches.map((branch) => branch.name)
          });
        }
      }
      if (name === 'branch') {
        loadUrl = `${loadUrl}/${answer}`
        prompts.next({
          type: 'input',
          message: '下载路径:',
          name: 'path',
          default: githubName
        });
      }
      if (name === 'path') {
        path = answer
        prompts.complete();
      }
    }

    const onError = (error) => {
      loggerError(error)
    }

    const onCompleted = () => {
      loadTpl(githubName, loadUrl, path)
    }

    inquirer.prompt(prompts).ui.process.subscribe(onEachAnswer, onError, onCompleted);

    const tplList = getTplList()

    prompts.next({
      type: 'list',
      message: '请选择模板:',
      name: 'name',
      choices: tplList.map((tpl) => tpl.name)
    });
  } catch (error) {
    loggerError(error)
  }
}