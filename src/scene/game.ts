import {pixelRatio, stage, screen} from '~/core'
import {btnBack, head, grid, numpad, toolbar, sound} from '~/module'
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
  head.scale.set(window.zoom)

  grid.init({
    size: 80
  })
  grid.pivot.set(360, 0)
  grid.position.set(screen.width / 2, head.y + head.height + 20)
  grid.refresh({data: levels[store.last.grade][store.last.index] as ILevelData})
  grid.scale.set(window.zoom)
  grid.on('done', () => {
    sound.play('win.mp3')
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
        grid.switch()
        break
      }

      case 'tip': {
        if (store.tip.count > 0) {
          grid.tip()
          toolbar.refresh()
        } else {
          wx.showModal({
            title: '获取提示',
            content: '观看视频广告获取3次提示机会',
            success: async () => {
              const {videoAd} = window
              let ok = await videoAd.show().then(() => true).catch(() => null)
              if (ok) {
                const fn = function(info: any) {
                  videoAd.offClose(fn)
                  if (!info.isEnded) return
                  store.tip.count += 3
                  toolbar.refresh()
                }
                videoAd.onClose(fn)
                return
              }
              ok = await videoAd.load().then(() => true).catch(() => null)
              if (!ok) return wx.showToast({title: '广告加载失败', icon: 'none'})
              ok = await videoAd.show().then(() => true).catch(() => null)
              if (ok) {
                const fn = function(info: any) {
                  videoAd.offClose(fn)
                  if (!info.isEnded) return
                  store.tip.count += 3
                  toolbar.refresh()
                }
                videoAd.onClose(fn)
                return
              }
              wx.showToast({title: '广告加载失败', icon: 'none'})
            }
          })
        }
        break
      }
    }
  })

  container.addChild(head, grid, numpad, toolbar)
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
