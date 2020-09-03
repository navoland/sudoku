import {save} from './fs'
import {createPromise} from '~/util'

/**
 * 返回 Promise, resolved 结果为保存文件路径
 */
export default function(name: string, path?: string) {
  const [promise, resolve, reject] = createPromise<string>()
  wx.cloud.downloadFile({
    fileID: `${CDN}/${name}`,
    success: ({tempFilePath}) => {
      save(tempFilePath, path ?? name).then((result: {savedFilePath: string}) => {
        resolve(result.savedFilePath)
      }).catch(reject)
    },
    fail: reject
  })
  return promise
}