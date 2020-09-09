import {pixelRatio, stage, screen} from '~/core'
import {btnBack, head, grid, numpad} from '~/module'
import {store} from '~/util'
import levels from '@/level'

const {min} = Math

let container: PIXI.Container

async function init() {
  const rect = await window.interaction
  container = new PIXI.Container()
  head.init({
    width: 720,
    height: 60,
    grade: store.last.grade,
    index: `${store.last.index + 1} / ${levels[store.last.grade].length}`
  })
  head.pivot.set(head.width / 2, 0)
  head.position.set(screen.width / 2, (rect.bottom + min(rect.top, 20)) * pixelRatio)

  grid.init({
    size: 80
  })
  grid.pivot.set(80 * 4.5, 0)
  grid.position.set(screen.width / 2, head.y + head.height + 20)
  grid.refresh({data: levels[store.last.grade][store.last.index] as ILevelData})

  numpad.init()
  numpad.pivot.set(numpad.width / 2, 0)
  numpad.position.set(screen.width / 2, grid.y + grid.height + 20)
  numpad.on('output', (v: number) => {
    grid.emit('input', v)
  })

  container.addChild(head, grid, numpad)
  stage.addChild(container)
}

function refresh() {
  head.refresh({
    grade: store.last.grade,
    index: `${store.last.index + 1} / ${levels[store.last.grade].length}`
  })
  grid.refresh({
    data: levels[store.last.grade][store.last.index] as ILevelData
  })
}

export function show(opt: {grade: number, index: number}) {
  opt && (store.last = {
    grade: opt.grade,
    index: opt.index,
    duration: 0
  })
  btnBack.show()
  if (!container) return init()
  container.visible = true
  refresh()
}

export function hide() {
  btnBack.hide()
  container.visible = false
}
