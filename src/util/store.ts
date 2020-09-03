let store = {
  version: '1.0.0',
  newbie: true,
  setting: {
    voice: 1,
  },

  score: {
    level: 0,
    step: Number.MAX_SAFE_INTEGER
  },

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
  store = merge(store, JSON.parse(localStorage.getItem('store')))
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


function merge<T>(a: T, b: T) {
  for (const k in b) {
    const oa = isObject(a[k])
    const ob = isObject(b[k])

    if (oa && ob) {
      merge(a[k], b[k])
      continue
    } else if (oa) continue

    b[k] != null && (a[k] = b[k])
  }
  return a
}

function isObject(o: unknown) {
  return Object.prototype.toString.call(o).includes('Object')
}
