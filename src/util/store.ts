import {mergeWith} from 'lodash'

let store = {
  version: '1.0.0',

  newbie: true,

  tip: {
    count: 3
  },

  grades: [0, 0, 0, 0],

  last: null as {
    grade: number
    index: number
    duration: number,
    cells: {preset: number, items: number[], value: number}[]
  },

  setting: {voice: 1},

  user: {
    name: null,
    city: null,
    gender: 0,
    avatar: null,
    country: null,
    province: null,
  },
  /** 上一次同步时间 */
  timestamp: null,

  /** 文件缓存列表 */
  file: {} as {[k: string]: string}
}

try {
  mergeWith(store, JSON.parse(localStorage.getItem('store')), (raw, src) => {
    if (Array.isArray(src)) return src
  })
} catch {
  // todo
}

const queue = new WeakSet()
const handle = {
  get(target: any, k: any) {
    let v = target[k]
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = target[k] = new Proxy(v, handle)
      queue.add(v)
    }
    return v
  },

  set(target: any, k: any, v: any) {
    if (target[k] === v) return true
    if (v && typeof v === 'object' && !queue.has(v)) {
      v = new Proxy(v, handle)
      queue.add(v)
    }

    target[k] = v
    localStorage.setItem('store', JSON.stringify(store))
    return true
  }
}

export default new Proxy<typeof store>(store, handle)
