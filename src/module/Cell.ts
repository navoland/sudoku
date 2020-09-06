import {Color} from './enum'

export default class extends PIXI.Graphics {
  private _num: PIXI.Text

  opt: IOption
  fixed: boolean
  active: boolean
  items: PIXI.Text[]
  coord: PIXI.IPointData

  constructor(opt: IOption) {
    const {size, lineWidth, fill, alignment, lineColor} = opt
    super()
    this.coord = {x: 0, y: 0}
    this.opt = opt
    this
      .beginFill(fill)
      .lineStyle(lineWidth, lineColor, 1, alignment)
      .drawRect(0, 0, size, size)
      .endFill()

    this.fixed = !!opt.num
    const num = this._num = new PIXI.Text(opt.num ? `${opt.num}` : '', {
      fill: this.fixed ? Color.Black : Color.Blue,
      fontSize: 48
    })
    num.position.set(size / 2)
    num.anchor.set(.5)
    this.addChild(num)

    if (this.fixed) return

    // 候选数字
    this.items = []
    for (let i = 0; i < 9; i++) {
      const x = i % 3
      const y = i / 3 | 0
      const item = new PIXI.Text(`${i + 1}`, {
        fill: Color.Blue,
        fontSize: 20,
      })
      item.visible = false
      item.anchor.set(.5)
      item.position.set((x + .5) * size / 3, (y + .5) * size / 3)
      this.items.push(item)
      this.addChild(item)
    }
  }

  activate(fill = Color.Connect, force?: boolean) {
    if (this.active && !force) return
    this.active = true
    const {size, lineWidth, alignment, lineColor} = this.opt
    this
      .clear()
      .beginFill(fill)
      .lineStyle(lineWidth, lineColor, 1, alignment)
      .drawRect(0, 0, size, size)
      .endFill()
  }

  select(fill = Color.Select) {
    this.activate(fill, true)
  }

  inactivate() {
    if (!this.active) return
    this.active = false
    const {fill, size, lineWidth, alignment, lineColor} = this.opt
    this
      .clear()
      .beginFill(fill)
      .lineStyle(lineWidth, lineColor, 1, alignment)
      .drawRect(0, 0, size, size)
      .endFill()
  }

  set num(v: number) {
    // 隐藏候选数字
    if (this.items) for (const item of this.items) item.visible = false
    const num = this._num
    num.visible = true
    num.text = `${v}`
  }

  get num() {
    return this._num.visible ? +this._num.text : null
  }

  toggle(v: number) {
    // 隐藏钢笔数字
    this._num.visible = false
    let num: PIXI.Text
    for (const item of this.items) {
      if (item.text === `${v}`) {
        num = item
        break
      }
    }
    num.visible = !num.visible
  }

  fix(v: number) {
    this.fixed = true
    this._num.visible = true
    this._num.text = `${v}`
    this._num.style.fill = Color.Black
  }

  unfix() {
    this.fixed = false
    this._num.style.fill = Color.Blue
  }

  erase() {
    this._num.visible = false
    if (this.items) for (const item of this.items) item.visible = false
  }
}

interface IOption {
  num: number
  fill: number
  size: number
  lineWidth: number
  alignment: number
  lineColor: number
}
