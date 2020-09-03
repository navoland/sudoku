import {tween} from '~/util'
import {ContraryDir, Dir} from './enum'

export default class extends PIXI.Container {
  #animes: PIXI.AnimatedSprite[]

  coord = new PIXI.Point()

  constructor() {
    super()
    this.#animes = [
      PIXI.AnimatedSprite.fromFrames([
        'player.4.png', 'player.5.png',
        'player.6.png', 'player.5.png'
      ]),
      PIXI.AnimatedSprite.fromFrames([
        'player.1.png', 'player.3.png',
        'player.1.png', 'player.2.png'
      ]),
      PIXI.AnimatedSprite.fromFrames([
        'player.10.png', 'player.11.png',
        'player.12.png', 'player.11.png'
      ]),
      PIXI.AnimatedSprite.fromFrames([
        'player.7.png', 'player.8.png',
        'player.9.png', 'player.8.png'
      ])
    ]

    for (const item of this.#animes) {
      item.visible = false
      item.animationSpeed = .03
      this.addChild(item)
    }
  }

  walk(dir: Dir, contrary = false) {
    const {size} = GameGlobal
    this.play(contrary ? ContraryDir[Dir[dir]] : dir)
    this.coord.y += dir === Dir.Up ? -1 : dir === Dir.Down ? 1 : 0
    this.coord.x += dir === Dir.Left ? -1 : dir === Dir.Right ? 1 : 0
    return tween({
      target: this,
      x: (this.coord.x + .5) * size,
      y: (this.coord.y + .5) * size,
    }).then(() => {
      this.stop()
    })
  }

  play(dir: Dir) {
    const animes = this.#animes
    for (let i = 0, j = animes.length; i < j; i++) {
      const item = animes[i]
      item.visible = i === dir
      item.gotoAndPlay(0)
    }
  }

  stop() {
    const animes = this.#animes
    for (let i = 0, j = animes.length; i < j; i++) {
      const item = animes[i]
      item.gotoAndStop(3)
    }
  }

  goto(x: number, y: number) {
    const {size} = GameGlobal
    const animes = this.#animes
    this.coord.set(x, y)
    this.position.set((x + .5) * size, (y + .5) * size)
    for (let i = 0, j = animes.length; i < j; i++) {
      const item = animes[i]
      item.visible = i === Dir.Down
      item.gotoAndStop(3)
    }
  }
}
