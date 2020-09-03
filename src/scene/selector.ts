/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {stage, screen, monitor} from '~/core'
import {btnBack} from '~/module/ui'
import levels from '@/level'
import {store, tween} from '~/util'
import {sound} from '~/module'

type Item = PIXI.Sprite & {
  index?: number,
  text?: PIXI.Text
}

const {PI, min} = Math
const PI_2 = PI / 2

let cursor: number = 0
let container: PIXI.Graphics
let items: Item[]
let btnNext: PIXI.Sprite
let btnPrev: PIXI.Sprite

function init() {
  const width = 600
  const height = 474

  container = new PIXI.Graphics()
    .beginFill(0xffcc33, 0)
    .drawRect(0, 0, width, height)
    .endFill()

  container.interactive = true
  container.pivot.set(width >> 1, height >> 1)
  container.position.set(screen.width >> 1, screen.height >> 1)
  container.scale.set(min(
    screen.width / GameGlobal.design.width,
    screen.height / GameGlobal.design.height
  ))
  container.on('pointerdown', (e: IEvent) => {
    const {target} = e
    if (!target.name?.startsWith('btn')) return
    if (target.name === 'btn:next' || target.name === 'btn:prev') {
      tween({
        target,
        sx: .75,
        sy: .75
      })
    } else {
      tween({
        target,
        sx: .95,
        sy: .95
      })
    }
  }).on('pointerup', (e: IEvent) => {
    const {target} = e
    if (!target.name?.startsWith('btn')) return
    sound.play('tap.mp3')
    if (target.name === 'btn:next' || target.name === 'btn:prev') {
      tween({
        target,
        sx: .55,
        sy: .55
      })
      cursor += target.name === 'btn:next' ? 1 : -1
      update()
    } else {
      monitor.emit('scene:go', 'game', cursor * 20 + (target as Item).index)
      tween({
        target,
        sx: .75,
        sy: .75
      })

    }
  }).on('pointerupoutside', (e: IEvent) => {
    const {target} = e
    if (!target.name?.startsWith('btn')) return
    if (target.name === 'btn:next' || target.name === 'btn:prev') {
      tween({
        target,
        sx: .55,
        sy: .55
      })
    } else {
      tween({
        target,
        sx: .75,
        sy: .75
      })
    }
  })

  btnNext = PIXI.Sprite.from('btn.arrow.png')
  btnNext.name = 'btn:next'
  btnNext.rotation = PI
  btnNext.interactive = true
  btnNext.scale.set(.55)
  btnNext.position.set(width >> 1, height + 96)

  btnPrev = PIXI.Sprite.from('btn.arrow.png')
  btnPrev.name = 'btn:prev'
  btnPrev.interactive = true
  btnPrev.scale.copyFrom(btnNext.scale)
  btnPrev.position.set(width >> 1, -96)

  container.addChild(btnPrev, btnNext)

  items = []
  for (let i = 0; i < 20; i++) {
    const x = i % 5
    const y = i / 5 | 0
    const item: Item = new PIXI.Sprite()
    const text = new PIXI.Text(`${i + 1 + cursor * 20}`, {
      fontSize: 46,
      fill: 0x607d8b,
      fontFamily: GameGlobal.font
    })
    item.name = 'btn'
    item.index = i
    text.anchor.set(.5)
    item.anchor.set(.5)
    item.scale.set(.75)
    item.position.set(48 + x * 126, 48 + y * 126)
    item.addChild(text)
    item.text = text
    items.push(item)
    container.addChild(item)
  }

  update()

  stage.addChild(container)
}

function update() {
  btnPrev.visible = cursor > 0
  btnNext.visible = cursor < (levels.length / 20 | 0)
  const level = store.score.level
  for (let i = 0, j = items.length; i < j; i++) {
    const item = items[i]
    const locked = (i + cursor * 20) > level
    item.interactive = !locked
    item.texture = PIXI.Texture.from(`btn.${locked ? 'lock' : 'circle'}.png`)
    item.text.visible = !locked
  }
}

export function show() {
  btnBack.show()
  if (!container) return init()
  container.visible = true
  update()
}

export function hide() {
  btnBack.hide()
  container.visible = false
}
