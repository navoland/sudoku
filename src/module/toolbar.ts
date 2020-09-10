import {store} from '~/util'
import {Color} from './enum'

const toolbar: Toolbar = new PIXI.Graphics()

const badge = new PIXI.Text(`${store.tip.count}`, {fill: Color.Blue, fontSize: 48, fontWeight: 'bold'})
badge.anchor.set(.5, 0)

toolbar.init = function() {
  this
    .clear()
    .beginFill(0, 0)
    .drawRect(0, 0, 720, 64)
    .endFill()

  this.interactive = true
  this.on('pointerdown', (e: IEvent) => {
    if (!(e.target instanceof PIXI.Sprite)) return
    const {name} = e.target
    if (name === 'pencil') {
      e.target.tint = e.target.tint === Color.Blue ? Color.Gray : Color.Blue
    }
    this.emit('output', e.target.name)
  })


  void ['eraser', 'pencil', 'tip'].forEach((id, i) => {
    const item = PIXI.Sprite.from(`icon.${id}.png`)
    item.name = id
    item.tint = Color.Gray
    item.interactive = true
    item.scale.set(.5)
    item.position.set(
      i === 0 ? 32 : i === 1 ? 360 : i === 2 ? 720 - 32 : 0,
      32,
    )
    if (id === 'tip') {
      badge.position.set(0, -38)
      item.addChild(badge)
    }
    this.addChild(item)
  })
}

toolbar.refresh = function() {
  badge.text = `${store.tip.count}`
  void ((this.children[1] as PIXI.Sprite).tint = Color.Gray)
}

interface Toolbar extends PIXI.Graphics {
  init?(this: Toolbar): void
  refresh?(this: Toolbar): void
}

export default toolbar
