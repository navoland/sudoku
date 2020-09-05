// import {stage} from '~/core'
import {game, preload} from '~/scene'

GameGlobal.design = {
  width: 750,
  height: 1334
}

preload().then(() => {
  game.show()
}).catch(console.log)
