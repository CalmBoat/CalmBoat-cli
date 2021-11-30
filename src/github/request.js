import { loggerError } from '../utils/index.js';
import request from 'request'
import qs from 'qs'

const GET = async ({ url, query = {} }) => {
  const sendUrl = `${url}?${qs.stringify(query)}`;
  try {
    return new Promise((resolve, reject) => {
      request({
        url: sendUrl,
        method: "GET",
        json: true,
        headers: {
          "content-type": "application/json",
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "CalmBoat-App",
        },
      }, (error, response, body) => {
        if (!error && body) {
          resolve(body)
        } else {
          reject(error)
        }
      });
    })
  } catch (error) {
    loggerError(error)
    throw (error);
  }
}

export {
  GET,
}
