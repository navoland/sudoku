import {createPromise} from '~/util'

const fs = wx.getFileSystemManager()

export const ROOT = wx.env.USER_DATA_PATH

export function access<T>(path: string) {
  const [promise, resolve, reject] = createPromise<T>()
  fs.access({
    path: `${ROOT}/${path}`,
    success: resolve,
    fail: reject
  })
  return promise
}

export function save(src: string, dst: string) {
  const [promise, resolve, reject] = createPromise()
  fs.saveFile({
    tempFilePath: src,
    filePath: `${ROOT}/${dst}`,
    success: resolve,
    fail: reject
  })
  return promise
}

export async function mkdir(path: string, recursive: boolean = true) {
  const [promise, resolve, reject] = createPromise()
  fs.mkdir({
    dirPath: `${ROOT}/${path}`,
    recursive,
    success: resolve,
    fail: reject
  })
  return promise
}

export function read(path: string, opt: {encoding?: string, root?: boolean} = {}) {
  const [promise, resolve, reject] = createPromise<string | ArrayBuffer>()
  fs.readFile({
    filePath: !opt.root ? `${ROOT}/${path}` : path,
    encoding: opt?.encoding,
    success: ({data}) => resolve(data),
    fail: reject
  })
  return promise
}
