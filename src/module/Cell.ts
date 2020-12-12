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
  /**
   * 四种状态: 错误，选中，相同，联动
   */
  statuses: [number, number, number, number] = new Proxy([0, 0, 0, 0], {
    get: (target, k) => {
      return target[k]
    },

    set: (target, k, v) => {
      target[k] = v
      if (target[0]) this.highlight(Color.Error, true)
      else if (target[1]) this.highlight(Color.Select, true)
      else if (target[2]) this.highlight(Color.Same, true)
      else if (target[3]) this.highlight(Color.Connect, true)
      else this.unhighlight()
      return true
    }
  })

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
    for (const item of this._items) item.visible = false
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

  empty() {
    this.selectable = true
    this.erase()
    this.unhighlight()
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

  get items() {
    return this._items
      .filter(item => item.visible)
      .map(item => +item.text)
  }
}

interface IOption {
  x: number
  y: number
  size: number
}
