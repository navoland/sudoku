import {store, createPromise} from '~/util'
import {fs, download} from '~/module/wx'

const {mkdir, access, read, ROOT} = fs
const dirs = ['font', 'anime', 'sound', 'texture']
const files = [
  {name: 'texture/ui.png', version: '1.0.1'},
  {name: 'texture/ui.json', version: '1.0.1'},
  {name: 'sound/tap.mp3', version: '1.0.0'},
  {name: 'sound/pen.mp3', version: '1.0.0'},
  {name: 'sound/win.mp3', version: '1.0.0'},
  {name: 'sound/hint.mp3', version: '1.0.0'},
  {name: 'sound/back.mp3', version: '1.0.0'},
  {name: 'sound/error.mp3', version: '1.0.0'},
  {name: 'sound/erase.mp3', version: '1.0.0'},
  {name: 'sound/pencil.mp3', version: '1.0.0'},
]

export default async function() {
  for (const dir of dirs) {
    const existed = await access(dir).catch(() => false)
    !existed && await mkdir(dir)
  }

  const items = await Promise.all(files.map(async file => {
    const existed = await access<{errMsg: string}>(file.name)
      .then(info => info.errMsg === 'access:ok')
      .catch(() => false)
    const outdated = compare(store.file[file.name], file.version)

    outdated && (store.file[file.name] = file.version)

    if (!existed || outdated) return download(file.name)
    return `${ROOT}/${file.name}`
  }))

  await Promise.all([
    parse(items[0], items[1]),
  ])
}

async function parse(a: string, b: string) {
  const [promise, resolve] = createPromise()
  const data = JSON.parse(await read(b, {encoding: 'utf-8', root: true}).catch(() => null))
  if (!data) throw new Error('图集解析失败')
  new PIXI.Spritesheet(
    PIXI.BaseTexture.from(a),
    data,
  ).parse(resolve)
  return promise
}


function compare(v1: string = '', v2: string = '') {
  const s1 = v1.split('.')
  const s2 = v2.split('.')
  const length = Math.max(s1.length, s2.length)
  for (let i = 0; i < length; i++) {
    const c1 = +s1[i] || 0
    const c2 = +s2[i] || 0
    if (c1 < c2) return -1
    if (c1 > c2) return 1
    if (i === length - 1) return 0
  }
}
