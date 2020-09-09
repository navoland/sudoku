import {Color} from './enum'

const lineWidth = 1

export default class extends PIXI.Graphics {
  private _highlighted = false
  private _num = new PIXI.Text('', {fontSize: 48})

  size: number
  selectable = true
  coord = {x: 0, y: 0}

  constructor(opt: IOption) {
    super()
    const {size, x, y} = opt
    this.size = size
    this.coord.x = x
    this.coord.y = y
    this
      .beginFill(Color.White)
      .lineStyle(lineWidth, Color.Border, 1, 0)
      .drawRect(0, 0, size, size)
      .endFill()
    this.position.set(size * x, size * y)

    this._num.anchor.set(.5)
    this._num.position.set(size / 2)
    this.addChild(this._num)
  }

  preset(v: number) {
    this.selectable = false
    this._num.text = `${v}`
    this._num.style.fill = Color.Black
  }

  select() {
    this.highlight(Color.Select, true)
  }

  highlight(color = Color.Connect, force?: boolean) {
    if (this._highlighted && !force) return
    this._highlighted = true
    this
      .clear()
      .beginFill(color)
      .lineStyle(lineWidth, Color.Border, 1, 0)
      .drawRect(0, 0, this.size, this.size)
      .endFill()
  }

  unhighlight() {
    if (!this._highlighted) return
    this._highlighted = false
    this
      .clear()
      .beginFill(Color.White)
      .lineStyle(lineWidth, Color.Border, 1, 0)
      .drawRect(0, 0, this.size, this.size)
      .endFill()
  }

  get value() {
    return +this._num.text
  }
}

interface IOption {
  x: number
  y: number
  size: number
}
