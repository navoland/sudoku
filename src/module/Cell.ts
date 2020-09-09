import {Color} from './enum'

const lineWidth = 1

export default class extends PIXI.Graphics {
  private _highlighted = false
  private _num = new PIXI.Text('', {fontSize: 48})
  private _items: PIXI.Text[] = []

  size: number
  index: number
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

    for (let i = 0; i < 9; i++) {
      const x = i % 3
      const y = i / 3 | 0
      const item = new PIXI.Text(`${i + 1}`, {fill: Color.Blue, fontSize: 20, fontWeight: 'bold'})
      item.visible = false
      item.anchor.set(.5)
      item.position.set((x + .5) * size / 3, (y + .5) * size / 3)
      this._items.push(item)
      this.addChild(item)
    }
  }

  note(v: number) {
    // 隐藏钢笔数字
    this._num.visible = false
    for (const item of this._items) {
      if (+item.text === v) {
        item.visible = !item.visible
        break
      }
    }
  }

  erase() {
    this._num.visible = false
    for (const item of this._items) item.visible = false
  }

  preset(v: number) {
    this.selectable = false
    this._num.visible = true
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
    return this._num.visible && +this._num.text
  }

  set value(v: number) {
    this._num.text = `${v}`
    this._num.style.fill = Color.Blue
    if (this._num.visible) return
    this._num.visible = true
    for (const item of this._items) item.visible = false
  }
}

interface IOption {
  x: number
  y: number
  size: number
}
