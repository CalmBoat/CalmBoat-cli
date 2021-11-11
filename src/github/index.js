import { GET } from "./request.js"
import { loggerError } from "../utils/index.js"

export const getGithubBranch = async (params) => {
  try {
    const { apiUrl, org } = params
    const url = `${apiUrl}/repos/${org}/branches`
    const res = await GET({ url })
    if (Array.isArray(res)) {
      return res
    }
    loggerError(JSON.stringify(res))
    process.exit(1)
  } catch (error) {
    loggerError(error)
  }
}