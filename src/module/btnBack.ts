import * as sound from './sound'
import {screen, monitor, stage} from '~/core'
import {tween} from '~/util'
import {Color} from './enum'

let btn: PIXI.Sprite

function init() {
  btn = PIXI.Sprite.from('icon.back.png')
  btn.zIndex = 3
  btn.visible = false
  btn.interactive = true
  btn.scale.set(.5)
  btn.position.set(52)
  btn.tint = Color.Gray
  btn.on('pointerdown', (e: IEvent) => {
    e.stopped = true
    tween({
      target: btn,
      sx: .6,
      sy: .6
    })
  }).on('pointerup', () => {
    tween({
      target: btn,
      sx: .5,
      sy: .5
    })
    sound.play('back.ogg')
    monitor.emit('scene:back')
  }).on('pointerupoutside', () => {
    tween({
      target: btn,
      sx: .5,
      sy: .5
    })
  })

  GameGlobal.interaction.then(rect => {
    btn.visible = true
    btn.position.set(
      screen.width - rect.right * 2 + btn.width / 2,
      rect.bottom + rect.top
    )
  })
  stage.addChild(btn)
}

export function show() {
  if (!btn) return init()
  btn.visible = true
}

export function hide() {
  btn.visible = false
}
