import {pixelRatio, stage, screen} from '~/core'
import {btnBack, head} from '~/module'
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

  container.addChild(head)
  stage.addChild(container)
}

function refresh() {
  head.refresh({
    grade: store.last.grade,
    index: `${store.last.index + 1} / ${levels[store.last.grade].length}`
  })
  container.visible = true
}

export function show(opt: {grade: number, index: number}) {
  if (!opt) { // restore
    console.log('restore')
  } else { // new
    store.last = {
      grade: opt.grade,
      index: opt.index,
      duration: 0
    }
  }
  btnBack.show()
  if (!container) return init()
  container.visible = true
  refresh()
}

export function hide() {
  btnBack.hide()
  container.visible = false
}
