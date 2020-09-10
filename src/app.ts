import {monitor, screen} from '~/core'
import {preload, entry, game} from '~/scene'
import {createPromise} from './util'

const {min} = Math

wx.showLoading({title: '加载资源'})

preload().then(() => {
  monitor.emit('scene:go', 'entry')
}).catch((err: Error) => {
  wx.showToast({title: '资源加载失败', icon: 'none'})
  console.log(err)
}).finally(() => {
  wx.hideLoading()
})

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
  window.interaction = promise
  const handle = () => {
    wx.offTouchStart(handle)
    resolve(wx.getMenuButtonBoundingClientRect())
  }
  wx.onTouchStart(handle)
}

{
  const videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-035f929608f8c858'
  })

  videoAd.onError(console.log)

  window.videoAd = videoAd
}

// 设计尺寸
window.design = {width: 750, height: 1334}
window.zoom = min(screen.width / window.design.width, screen.height / window.design.height)

wx.showShareMenu({
  menus: ['shareAppMessage', 'shareTimeline']
})

wx.onShareAppMessage(() => {
  return {
    title: '数独物语',
    imageUrl: 'cloud://colloc-dev.636f-colloc-dev-1258618978/image/snapshot.png'
  }
})
