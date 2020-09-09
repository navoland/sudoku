import {Color} from './enum'

const numpad: Numpad = new PIXI.Graphics()

numpad.init = function() {
  this
    .clear()
    .beginFill(0, 0)
    .drawRect(0, 0, 720, 80)
    .endFill()

  const hitArea = new PIXI.Rectangle(-40, -40, 80, 80)

  for (let i = 0; i < 9; i++) {
    const num = new PIXI.Text(`${i + 1}`, {
      fill: Color.Blue,
      fontSize: 48
    })
    num.interactive = true
    num.anchor.set(.5)
    num.hitArea = hitArea
    num.position.set(40 + 80 * i, 40)
    this.addChild(num)
  }

  this.interactive = true
  this.on('pointerdown', (e: IEvent) => {
    if (!(e.target instanceof PIXI.Text)) return
    this.emit('output', +e.target.text)
  })
}

interface Numpad extends PIXI.Graphics {
  init?(this: Numpad): void
}

export default numpad
