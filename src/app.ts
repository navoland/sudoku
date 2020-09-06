import {monitor, screen} from '~/core'
import {preload, entry, game} from '~/scene'
import {createPromise, store} from './util'

const {min} = Math

GameGlobal.design = {
  width: 750,
  height: 1334
}

GameGlobal.zoom = min(
  screen.width / 750,
  screen.height / 1334,
)

preload().then(() => {
  monitor.emit('scene:go', 'entry')
}).catch(console.log)


// 广告
{
  const interAd = wx.createInterstitialAd({
    adUnitId: 'adunit-e0ecc6cf322cb27a'
  })

  interAd.onError(console.log)

  GameGlobal.interAd = interAd

  monitor.on('wx:show', () => {
    if (store.newbie) {
      store.newbie = false
      return
    }

    GameGlobal.interAd.show().catch(console.log)
  })

  const videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-e0ecc6cf322cb27a',
  })

  videoAd.onError(console.log)
  GameGlobal.videoAd = videoAd
}


// 路由
{
  const stack: {cursor: IScene, args: any[]}[] = []
  monitor.on('scene:go', (name: string, ...args: any[]) => {
    const cursor = {game, entry}[name]
    stack[stack.length - 1]?.cursor.hide()
    cursor.show(...args)
    stack.push({cursor, args})
  }).on('scene:back', () => {
    if (stack.length < 2) return
    stack.pop().cursor.hide()
    const {cursor, args} = stack[stack.length - 1]
    cursor.show(...args)
  })
}

// 等待交互
{
  const [promise, resolve] = createPromise<wx.IRect>()
  GameGlobal.interaction = promise
  const handle = () => {
    wx.offTouchStart(handle)
    resolve(wx.getMenuButtonBoundingClientRect())
  }
  wx.onTouchStart(handle)
}
