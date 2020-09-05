import {stage, screen} from '~/core'
import {grid} from '~/module'
import {easy} from '@/level'

const {min} = Math

let container: PIXI.Container
let numpad: PIXI.Graphics
let toolbar: PIXI.Graphics

function init() {
  container = new PIXI.Container()
  grid.layout(easy[0] as ILevelData)
  grid.position.set(screen.width / 2, 120)
  grid.scale.set(min(
    screen.width / GameGlobal.design.width,
    screen.height / GameGlobal.design.height
  ))
  container.addChild(grid)

  numpad = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 720, 80)
    .endFill()

  const hitArea = new PIXI.Rectangle(-40, -40, 80, 80)
  for (let i = 1; i < 10; i++) {
    const num = new PIXI.Text(`${i}`, {
      fill: 0x2256b0,
      fontSize: 48
    })
    num.name = `${i}`
    num.interactive = true
    num.anchor.set(.5)
    num.hitArea = hitArea
    num.position.set(40 + 80 * (i - 1), 40)
    numpad.addChild(num)
  }

  numpad.interactive = true
  numpad.on('pointerdown', (e: IEvent) => {
    e.stopped = true
    if (e.target === numpad) return
    grid.activeCell.num = +e.target.name
  })

  numpad.pivot.set(numpad.width / 2, numpad.height / 2)
  numpad.position.set(screen.width / 2, grid.y + grid.height + 100)
  numpad.scale.copyFrom(grid.scale)

  toolbar = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 680, 64)
    .endFill()

  toolbar.pivot.set(toolbar.width / 2, 0)
  toolbar.position.set(screen.width / 2, screen.height - 100)

  const pencil = PIXI.Sprite.from('icon.pencil.png')
  pencil.tint = 0x555555
  pencil.scale.set(.5)
  pencil.position.set(toolbar.width / 2, toolbar.height / 2)

  const tip = PIXI.Sprite.from('icon.tip.png')
  tip.tint = 0x555555
  tip.scale.set(.5)
  tip.anchor.set(1, .5)
  tip.position.set(toolbar.width, toolbar.height / 2)
  toolbar.addChild(pencil, tip)

  const eraser = PIXI.Sprite.from('icon.eraser.png')
  eraser.tint = 0x555555
  eraser.scale.set(.5)
  eraser.anchor.set(0, .5)
  eraser.position.set(0, toolbar.height / 2)
  toolbar.addChild(pencil, tip, eraser)
  toolbar.scale.copyFrom(grid.scale)


  container.addChild(numpad, toolbar)
  stage.addChild(container)
}

export function show() {
  if (!container) return init()
  container.visible = true
}

export function hide() {
  container.visible = false
}
