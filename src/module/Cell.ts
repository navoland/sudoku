export default class extends PIXI.Graphics {
  index: PIXI.IPointData
  active: boolean
  private _num: PIXI.Text
  fixed: boolean
  opt: {fill: number, size: number, lineWidth: number, alignment: number, lineColor: number, num: number}

  constructor(opt: {
    num: number, fill: number, size: number, lineWidth: number,
    alignment: number, lineColor: number}) {
    const {size, lineWidth, fill, alignment, lineColor} = opt
    super()
    this.index = {x: 0, y: 0}
    this.opt = opt
    this
      .beginFill(fill)
      .lineStyle(lineWidth, lineColor, 1, alignment)
      .drawRect(0, 0, size, size)
      .endFill()

    this.fixed = !!opt.num
    const num = this._num = new PIXI.Text(opt.num ? `${opt.num}` : '', {
      fill: this.fixed ? 0x080808 : 0x2256b0,
      fontSize: 48
    })
    num.position.set(size / 2)
    num.anchor.set(.5)
    this.addChild(num)
  }

  activate(fill = 0xe2e7ed) {
    if (this.active) return
    this.active = true
    const {size, lineWidth, alignment, lineColor} = this.opt
    this
      .clear()
      .beginFill(fill)
      .lineStyle(lineWidth, lineColor, 1, alignment)
      .drawRect(0, 0, size, size)
      .endFill()
  }

  select(fill = 0xbbdefb) {
    this.activate(fill)
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
    const num = this._num
    num.text = v.toString()
  }
}
