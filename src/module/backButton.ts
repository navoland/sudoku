import {animate} from 'popmotion'

import * as sound from './sound'
import {screen, monitor, stage} from '~/core'
import {Color} from './enum'

let btn: IButton

function init() {
  btn = PIXI.Sprite.from('icon.back.png')
  btn.zIndex = 3
  btn.visible = false
  btn.interactive = true
  btn.scale.set(.5 * window.zoom)
  btn.position.set(52)
  btn.tint = Color.Gray
  btn.on('pointerdown', (e: IEvent) => {
    e.stopped = true
    btn.anime?.stop()
    btn.anime = animate({
      from: btn.scale.x,
      to: .6 * window.zoom,
      onUpdate: v => btn.scale.set(v)
    })
  }).on('pointerup', () => {
    btn.anime?.stop()
    btn.anime = animate({
      from: btn.scale.x,
      to: .5 * window.zoom,
      onUpdate: v => btn.scale.set(v)
    })
    sound.play('back.mp3')
    monitor.emit('scene:back')
  }).on('pointerupoutside', () => {
    btn.anime?.stop()
    btn.anime = animate({
      from: btn.scale.x,
      to: .5 * window.zoom,
      onUpdate: v => btn.scale.set(v)
    })
  })

  window.interaction.then(rect => {
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

interface IButton extends PIXI.Sprite {
  anime?: {stop(): void}
}
