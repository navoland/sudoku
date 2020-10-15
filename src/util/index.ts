import createPromise from './createPromise'

export {createPromise}
export {default as store} from './store'

export function delay(t = 0) {
  const [promise, resolve] = createPromise()
  setTimeout(resolve, t * 1e3)
  return promise
}

/**
 * @param {Function} fn 回调函数
 * @return {(t: number) => {}} 函数参数为时间间隔，单位s
 */
export function debounce(fn: Function): (t: number) => void {
  let id: number
  return function(t: number) {
    clearTimeout(id)
    id = setTimeout(fn, t * 1e3)
  }
}
