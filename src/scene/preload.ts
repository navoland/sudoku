import {store, createPromise} from '~/util'
import {fs, download} from '~/module/wx'

const {factory} = dragonBones.PixiFactory
const {mkdir, access, read, ROOT} = fs
const dirs = ['font', 'anime', 'sound', 'texture']
const files = [
  {name: 'texture/ui.png', version: '1.0.0'},
  {name: 'texture/ui.json', version: '1.0.0'},
  {name: 'texture/item.png', version: '1.0.0'},
  {name: 'texture/item.json', version: '1.0.0'},
  {name: 'sound/set.mp3', version: '1.0.0'},
  {name: 'sound/bgm.mp3', version: '1.0.0'},
  {name: 'sound/tap.mp3', version: '1.0.0'},
  {name: 'sound/back.mp3', version: '1.0.0'},
  {name: 'sound/good.mp3', version: '1.0.0'},
  {name: 'sound/undo.mp3', version: '1.0.0'},
  {name: 'sound/replay.mp3', version: '1.0.0'},
  {name: 'sound/amazing.mp3', version: '1.0.0'},
  {name: 'sound/excellent.mp3', version: '1.0.0'},
  {name: 'sound/unbelievable.mp3', version: '1.0.0'},
  {name: 'anime/sokoban_tex.png', version: '1.0.0'},
  {name: 'anime/sokoban_tex.json', version: '1.0.0'},
  {name: 'anime/sokoban_ske.json', version: '1.0.0'},
  {name: 'font/Raleway-SemiBold.ttf', version: '1.0.0'},
]

const forceUpdate = false

export default async function() {
  for (const dir of dirs) {
    const existed = await access(dir).catch(() => false)
    !existed && await mkdir(dir)
  }

  const items = await Promise.all(files.map(async file => {
    const existed = await access(file.name).catch(() => false)

    if (!PROD) return forceUpdate || !existed ? download(file.name) : `${ROOT}/${file.name}`

    const outdated = compare(store.file[file.name], file.version) < 0
    outdated && (store.file[file.name] = file.version)

    if (!existed || outdated) return download(file.name)
    return `${ROOT}/${file.name}`
  }))

  GameGlobal.font = wx.loadFont(`${ROOT}/font/Raleway-SemiBold.ttf`)

  // 解析骨骼动画
  factory.parseDragonBonesData(JSON.parse(await read('anime/sokoban_ske.json', {encoding: 'utf-8'}) as string))
  factory.parseTextureAtlasData(
    JSON.parse(await read('anime/sokoban_tex.json', {encoding: 'utf-8'}) as string),
    PIXI.Texture.from(`${ROOT}/anime/sokoban_tex.png`),
  )

  await Promise.all([
    parse(items[0], items[1]),
    parse(items[2], items[3]),
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
