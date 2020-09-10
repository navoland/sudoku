import levels from '@/level'
import {call} from '~/module/wx'
import {pixelRatio, stage, screen} from '~/core'
import {createPromise, delay, store} from '~/util'
import {
  btnBack, head, grid, numpad,
  toolbar, sound, Mode, particle,
} from '~/module'


const {min} = Math

let mode = Mode.Pen
let container: PIXI.Container

async function init() {
  const rect = await window.interaction
  container = new PIXI.Container()
  head.init({
    width: 720,
    height: 60,
    duration: 0,
    grade: store.last.grade,
    index: `${store.last.index + 1} / ${levels[store.last.grade].length}`
  })
  head.pivot.set(head.width / 2, 0)
  head.position.set(screen.width / 2, (rect.bottom + min(rect.top, 20)) * pixelRatio)
  head.scale.set(window.zoom)

  grid.init({
    size: 80,
    data: levels[store.last.grade][store.last.index] as ILevelData
  })
  grid.pivot.set(360, 0)
  grid.position.set(screen.width / 2, head.y + head.height + 20)
  grid.scale.set(window.zoom)
  grid.on('done', () => {
    sound.play('win.mp3')
    next()
  })

  numpad.init()
  numpad.pivot.set(360, 0)
  numpad.position.set(screen.width / 2, grid.y + grid.height + 20)
  numpad.scale.set(window.zoom)
  numpad.on('output', grid.input.bind(grid))

  toolbar.init()
  toolbar.pivot.set(360, 64)
  toolbar.position.set(screen.width / 2, screen.height - 20)
  toolbar.scale.set(window.zoom)
  toolbar.on('output', (v: string) => {
    switch (v) {
      case 'eraser': {
        grid.erase()
        break
      }

      case 'pencil': {
        mode ^= 1
        grid.switch(mode)
        break
      }

      case 'tip': {
        if (store.tip.count > 0) {
          grid.tip()
          toolbar.refresh({count: store.tip.count})
        } else {
          wx.showModal({
            title: '获取提示',
            content: '观看视频广告获取3次提示机会',
            success: async ({confirm}) => {
              if (!confirm) return
              const ok = await showVideoAd()
              if (!ok) return
              store.tip.count += 3
              toolbar.refresh({count: store.tip.count})
            }
          })
        }
        break
      }
    }
  })

  particle.visible = false
  particle.init()

  refresh()
  container.addChild(head, grid, numpad, toolbar, particle)
  stage.addChild(container)
}

function refresh() {
  head.refresh({
    grade: store.last.grade,
    duration: store.last.duration,
    index: `${store.last.index + 1} / ${levels[store.last.grade].length}`
  })
  toolbar.refresh({count: store.tip.count, mode})
  store.last.cells ?
    grid.restore({data: store.last.cells, mode}) :
    grid.refresh({data: levels[store.last.grade][store.last.index] as ILevelData, mode})
}

async function next() {
  const {last} = store
  call({
    name: 'user',
    data: {
      type: 'set',
      user: store.user,
      last: {
        grade: last.grade,
        index: last.index,
        duration: last.duration
      }
    }
  })

  if (++last.index === levels[last.grade].length) {
    last.index--
    wx.showToast({title: '当前难度已通关', icon: 'none'})
  }

  last.cells = null
  last.duration = 0
  particle.start()
  await delay(1)
  refresh()
}

async function showVideoAd() {
  const {videoAd} = window
  const [promise, resolve] = createPromise<boolean>()
  let ok = await videoAd.show().then(() => true).catch(() => false)
  if (ok) {
    const fn = function(info: {isEnded: boolean}) {
      videoAd.offClose(fn)
      resolve(info.isEnded)
    }
    videoAd.onClose(fn)
  } else {
    resolve(false)
    wx.showToast({title: '视频广告加载失败', icon: 'none'})
  }
  return promise
}

export function show(opt: {grade: number, index: number}) {
  opt && (store.last = {
    grade: opt.grade,
    index: opt.index,
    duration: 0,
    cells: null
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
