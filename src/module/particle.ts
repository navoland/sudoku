import {screen, ticker} from '~/core'

const {random} = Math

const container: Particle = new PIXI.ParticleContainer(1e3, {
  vertices: true,
  position: true,
  tint: true,
  rotation: true,
  uvs: true
})

const stars: Star[] = []

let falling = false

container.init = function() {
  for (let i = 0; i < 80; i++) {
    const star: Star = PIXI.Sprite.from('star.png')
    star.a =
    star.v = 0
    stars.push(star)
    container.addChild(star)
  }

  ticker.add(() => {
    if (!falling) return this.visible = false
    let done = true
    for (const star of stars) {
      star.v += star.a
      star.y += star.v
      if (star.y < screen.height) done = false
    }
    if (done) falling = false
  })
}

container.start = function() {
  if (falling) return
  falling = true
  this.visible = true
  for (const star of stars) {
    star.alpha = 1
    star.x = screen.width * random()
    star.y = -128
    star.a = .1 + random() * .5
    star.tint = random() * 0xffffff
    star.scale.set(.2 + .5 * random())
    star.v = random() * 3
  }
}

interface Star extends PIXI.Sprite {
  v?: number
  a?: number
}

interface Particle extends PIXI.ParticleContainer {
  init?(this: Particle): void
  start?(this: Particle): void
}



export default container
