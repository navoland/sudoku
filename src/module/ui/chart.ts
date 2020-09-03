import {easing} from 'popmotion'
import {screen, stage} from '~/core'
import {delay, tween} from '~/util'
import World from './World'

const width = 600
const height = 1000
const {min} = Math
const point = new PIXI.Point()
const context = wx.getOpenDataContext()

enum Label {
  friend = '好友',
  world = '世界'
}

let container: PIXI.Graphics
let friend: PIXI.Sprite
let tab: keyof typeof Label = 'friend'
let world: World

function init() {
  container = new PIXI.Graphics()
    .beginFill(0, .5)
    .drawShape(screen)
    .endFill()
  container.interactive = true
  stage.addChild(container)

  const area = new PIXI.Graphics()
    .beginFill(0, .5)
    .drawRoundedRect(0, 0, width, height, 8)
    .endFill()
  area.interactive = true
  area.pivot.set(width >> 1, height >> 1)
  area.position.set(screen.width >> 1, screen.height >> 1)
  area.scale.set(min(
    screen.width / GameGlobal.design.width,
    screen.height / GameGlobal.design.height
  ))
  container.addChild(area)

  container.on('tap', (e: IEvent) => {
    const {target} = e
    if (target === container) return hide()
    switch (target.name) {
      case 'label:friend': {
        tab = 'friend'
        friend.visible = true
        world.visible = false
        tween({
          target: slider,
          x: target.x,
          ease: easing.easeInOut
        })
        context.postMessage({type: 'update'})
        break
      }

      case 'label:world': {
        tab = 'world'
        if (!world) {
          world = new World(width, height)
          world.y = 100
          area.addChild(world)
        }
        friend.visible = false
        world.visible = true
        world.update()
        tween({
          target: slider,
          x: target.x,
          ease: easing.easeInOut
        })
        break
      }

      case 'friend': {
        point.set(e.x, e.y)
        target.toLocal(point, undefined, point)
        context.postMessage({type: 'click', x: point.x, y: point.y})
        break
      }
    }
  })

  const slider = new PIXI.Graphics()
    .beginFill(0x00bcd4, .8)
    .drawRoundedRect(0, 0, 200, 6, 3)
    .endFill()

  slider.pivot.set(100, 6)
  slider.position.set()
  area.addChild(slider)

  {
    const items = ['friend', 'world']
    const hitArea = new PIXI.Rectangle(-100, -50, 200, 100)
    items.forEach((item, i) => {
      const label = new PIXI.Text(Label[item], {
        fill: 0xffffff,
        fontSize: 36,
        fontWeight: 'bold'
      })
      label.name = `label:${item}`
      label.interactive = true
      label.anchor.set(.5)
      label.y = 50
      label.hitArea = hitArea
      label.x = width * (.25 + i * .5)
      area.addChild(label)
      if (i) return
      slider.position.set(label.x, 100)
    })
  }

  const canvas = context.canvas
  canvas.width = width
  canvas.height = height - 100
  context.postMessage({type: 'update'})

  friend = PIXI.Sprite.from(context.canvas)
  friend.interactive = true
  friend.name = 'friend'
  friend.position.set(0, 100)

  // 无法得知绘制完成，遂循环
  void async function loop() {
    if (friend.worldVisible) friend.texture.update()
    delay(1).then(loop)
  }()

  area.addChild(friend)
}


export function show() {
  if (!container) return init()
  tab === 'friend' ?
    context.postMessage({type: 'update'}) :
    world.update()
  container.visible = true
}

export function hide() {
  container.visible = false
}
