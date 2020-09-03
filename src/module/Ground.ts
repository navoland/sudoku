import {tween} from '~/util'
import {sound} from '.'
import {ContraryDir, Dir} from './enum'
import gamepad from './gamepad'
import Role from './Role'

type Crate = PIXI.Sprite & {
  type?: string
  move?: (dir: Dir) => void
}

type Frame = PIXI.Sprite & {
  type?: string
}

export default class extends PIXI.Graphics {
  /** 箱子 */
  #crates: Crate[]

  /** 位置框 */
  #frames: Frame[]

  #walls: PIXI.IPointData[]

  #role: Role

  #steps: {dir: Dir, crate: Crate}[] = []

  constructor(data: IMap) {
    super()
    const {size} = GameGlobal
    const {width, map, crates, frames, player} = data

    this.#walls = []

    for (let i = 0, j = map.length; i < j; i++) {
      const x = i % width
      const y = i / width | 0
      const v = map[i]

      if (!v) continue

      this
        .beginTextureFill({texture: PIXI.Texture.from(`${v === 1 ? 'wall' : 'ground.green'}.png`)})
        .drawRect(x * size, y * size, size, size)
        .endFill()

      v === 1 && this.#walls.push({x, y})
    }

    this.#crates = crates.map(item => {
      const crate: Crate = PIXI.Sprite.from(`crate.${item.type}.png`)
      crate.position.set((item.x + .5) * size, (item.y + .5) * size)
      crate.type = item.type
      crate.move = async (dir: Dir) => {
        await tween({
          target: crate,
          y: crate.y + (dir === Dir.Up ? -size : dir === Dir.Down ? size : 0),
          x: crate.x + (dir === Dir.Left ? -size : dir === Dir.Right ? size : 0),
        })
        // 是否在框中
        const frame = this.getFrame(crate.x / size | 0, crate.y / size | 0)
        if (!frame || frame.type !== crate.type) return
        sound.play('set.mp3')
      }
      this.addChild(crate)
      return crate
    })

    this.#frames = frames.map(item => {
      const frame: Frame = PIXI.Sprite.from(`frame.${item.type}.png`)
      frame.type = item.type
      frame.position.set((item.x + .5) * size, (item.y + .5) * size)
      this.addChild(frame)
      return frame
    })

    this.#role = new Role()
    this.#role.goto(player.x, player.y)
    this.addChild(this.#role)
    gamepad.on('direction', this._input, this)
    this.on('undo', () => {
      if (!this.#steps.length) return
      sound.play('undo.mp3')
      const step = this.#steps.pop()
      this.emit('step', this.#steps.length)
      this.#role.walk(step.dir, true)
      step.crate?.move(step.dir)
    })
  }

  walkable(dir: Dir) {
    const role = this.#role
    let y = role.coord.y + (dir === Dir.Up ? -1 : dir === Dir.Down ? 1 : 0)
    let x = role.coord.x + (dir === Dir.Left ? -1 : dir === Dir.Right ? 1 : 0)
    let next = this.getChild(x, y)
    if (!next) return true
    if (isCrate(next)) {
      y += dir === Dir.Up ? -1 : dir === Dir.Down ? 1 : 0
      x += dir === Dir.Left ? -1 : dir === Dir.Right ? 1 : 0
      const _next = this.getChild(x, y)
      if (_next) return false
      next.move(dir)
      return next
    }
  }

  getChild(x: number, y: number): PIXI.IPointData | Crate {
    const {size} = GameGlobal
    const crates = this.#crates
    if (!crates) return
    // crates
    for (const crate of crates) {
      const _x = crate.x / size | 0
      const _y = crate.y / size | 0
      if (x === _x && y === _y) return crate
    }
    // walls
    const walls = this.#walls
    if (!walls) return
    for (const wall of walls) {
      if (x === wall.x && y === wall.y) return wall
    }
  }

  getFrame(x: number, y: number) {
    const {size} = GameGlobal
    const frames = this.#frames
    if (!frames) return
    for (const frame of frames) {
      const _x = frame.x / size | 0
      const _y = frame.y / size | 0
      if (x === _x && y === _y) return frame
    }
  }

  /** 是否完成 */
  get done() {
    const {size} = GameGlobal
    const crates = this.#crates
    if (!crates) return false
    for (const crate of crates) {
      const x = crate.x / size | 0
      const y = crate.y / size | 0
      const frame = this.getFrame(x, y)
      if (!frame || frame.type !== crate.type) return false
    }
    return true
  }

  private async _input({direction: dir}: {direction: Dir}) {
    const role = this.#role
    const ok = this.walkable(dir)
    if (!ok) return
    this.#steps.push({dir: ContraryDir[Dir[dir]], crate: isCrate(ok) ? ok : null})
    this.emit('step', this.#steps.length)
    await role.walk(dir)
    if (!this.done) return
    this.emit('done')
    gamepad.off('direction', this._input, this)
  }

  destroy() {
    this.#walls =
    this.#crates =
    this.#frames = null
    gamepad.off('direction', this._input, this)
    super.destroy({children: true})
  }
}

function isCrate(o: unknown): o is Crate {
  return Object.prototype.hasOwnProperty.call(o, 'move')
}
