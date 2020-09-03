import {stage} from '~/core'

const g  = new PIXI.Graphics()
  .beginFill(0xffcc33, .5)
  .drawRect(0, 0, 100, 100)
  .endFill()

stage.addChild(g)
