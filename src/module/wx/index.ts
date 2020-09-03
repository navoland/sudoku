import {monitor, screen} from '~/core'
import {createPromise} from '~/util'

export * as fs from './fs'
export {default as download} from './download'

wx.cloud.init({
  env: CLOUD_ID
})

wx.onShow(info => {
  monitor.emit('wx:show', info)
})

wx.onHide(() => {
  monitor.emit('wx:hide')
})

wx.onAudioInterruptionEnd(() => {
  monitor.emit('wx:audio:interruption:end')
})

export function call<T>(opt: {name: string, data?: any, config?: {env: string}}): Promise<T> {
  return wx.cloud.callFunction(opt).then(({result}) => result)
}

export function getUserInfo() {
  const [promise, resolve, reject] = createPromise<wx.UserInfo>()
  wx.getUserInfo({
    success: resolve,

    fail: () => {
      wx.showToast({title: '再次点击，授权登录', icon: 'none'})
      const btn = wx.createUserInfoButton({
        type: 'text',
        text: '',
        style: {
          left: 0,
          top: 0,
          width: screen.width,
          height: screen.height,
          lineHeight: 40,
          backgroundColor: 'transparent',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 16,
        }
      })
      btn.onTap(info => {
        btn.destroy()
        if (info.userInfo) resolve(info)
        else reject(info.errMsg)
      })
    }
  })
  return promise
}
