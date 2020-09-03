declare const CDN: string
declare const PROD: boolean
declare const VERSION: string
declare const CLOUD_ID: string

/** for wechat */
declare const canvas: HTMLCanvasElement

declare const GameGlobal: typeof window & {
  /** 加载的字体 */
  font: string
  size: number
  level: number
  stage: PIXI.Container
  customAd: wx.CustomAd
  bannerAd: wx.BannerAd
  interAd: wx.InterstitialAd
  interaction: Promise<wx.IRect>
  design: {
    width: number
    height: number
  }
}

interface IEvent {
  x: number
  y: number
  stopped: boolean
  target?: PIXI.Container
  currentTarget?: PIXI.Container
}

interface IScene {
  hide: () => void
  show: (...args: any[]) => void
}

declare module wx {
  interface IRect {
    width: number
    height: number
    top: number
    left: number
    right: number
    bottom: number
  }

  interface UpdateManager {
    applyUpdate: () => void
    onUpdateReady: (opt: () => void) => void
  }

  function getUpdateManager(): UpdateManager

  /** 显示消息提示框 */
  function showToast(opt: {
    /** 提示的内容 */
    title: string
    /** 图标，默认 success */
    icon?: 'success' | 'loading' | 'none'
    /** 自定义图标的本地路径，image 的优先级高于 icon */
    image?: string
    /** 提示的延迟时间，默认 1500 */
    duration?: number
    /** 是否显示透明蒙层，防止触摸穿透， 默认 false */
    mask?: boolean

    fail?: () => void
    success?: () => void
    complete?: () => void
  }): {errMsg: string}

  function showLoading(opt: {
    title: string
    mask?: boolean
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  function hideLoading(opt?: {
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  function getSystemInfoSync(): {
    pixelRatio: number
    windowWidth: number
    windowHeight: number
  }

  function exitMiniProgram(opt?: {
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  /** 显示模态对话框 */
  function showModal(opt: {
    /** 提示的标题 */
    title: string
    /** 提示的内容 */
    content: string
    /** 是否显示取消按钮 */
    showCancel: boolean
    /** 取消按钮的文字，最多 4 个字符 */
    cancelText: string
    /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    cancelColor: string
    /** 确认按钮的文字，最多 4 个字符 */
    confirmText: string
    /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
    confirmColor: string

    fail?: () => void
    success?: () => void
    complete?: () => void
  })

  /** 显示当前页面的转发按钮 */
  function showShareMenu(opt: {
    /** 是否使用带 shareTicket 的转发，默认 false */
    withShareTicket?: boolean
    /** 需要显示的转发按钮名称列表，默认['shareAppMessage'] */
    menus?: ('shareAppMessage' | 'shareTimeline')[]
    fail?: () => void
    success?: () => void
    complete?: () => void
  })

  /** 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效 */
  function setKeepScreenOn(opt: {
    /** 是否保持屏幕常亮 */
    keepScreenOn: boolean

    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void


  interface IGetNetworkTypeResult {
    networkType: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none'
  }

  /** 获取网络类型 */
  function getNetworkType(opt: {
    success: (opt: IGetNetworkTypeResult) => void
  })


  /** 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。 */
  function previewImage(opt: {
    /** 需要预览的图片链接列表。2.2.3 起支持云文件ID。 */
    urls: string[]

    /** 当前显示图片的链接 */
    current?: string
  }): void

  interface IInnerAudioContext {
    /** 音频资源的地址，用于直接播放。2.2.3 开始支持云文件ID */
    src: string

    /** 开始播放的位置（单位：s），默认为 0 */
    startTime: number

    /** 是否自动开始播放，默认为 false */
    autoplay: boolean

    /** 是否循环播放，默认为 false */
    loop: boolean

    /** 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。从 2.3.0 版本开始此参数不生效，使用 wx.setInnerAudioOption 接口统一设置。 */
    obeyMuteSwitch: boolean

    /** 音量。范围 0~1。默认为 1 */
    volume: number

    /** 播放速度。范围 0.5-2.0，默认为 1。（Android 需要 6 及以上版本） */
    playbackRate: number

    /** 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读） */
    readonly duration: number

    /** 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读） */
    readonly currentTime: number

    /** 当前是是否暂停或停止状态（只读） */
    readonly paused: boolean

    /** 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读） */
    readonly buffered: number

    /** 播放 */
    play()

    /** 暂停。暂停后的音频再播放会从暂停处开始播放 */
    pause()

    /** 停止。停止后的音频再播放会从头开始播放。 */
    stop()

    /** 跳转到指定位置 */
    seek(position: number)

    /** 销毁当前实例 */
    destroy()

    /** 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放 */
    onCanplay(cb: () => {})

    /** 取消监听音频进入可以播放状态的事件 */
    offCanplay(cb: () => {})

    /** 监听音频播放事件 */
    onPlay(cb: () => {})

    /** 取消监听音频播放事件 */
    offPlay(cb: () => {})

    /** 监听音频暂停事件 */
    onPause(cb: () => {})

    /** 取消监听音频暂停事件 */
    offPause(cb: () => {})

    /** 监听音频停止事件 */
    onStop(cb: () => {})

    /** 取消监听音频停止事件 */
    offStop(cb: () => {})

    /** 监听音频自然播放至结束的事件 */
    onEnded(cb: () => {})

    /** 取消监听音频自然播放至结束的事件 */
    offEnded(cb: () => {})

    /** 监听音频播放进度更新事件 */
    onTimeUpdate(cb: () => {})

    /** 取消监听音频播放进度更新事件 */
    offTimeUpdate(cb: () => {})

    /** 监听音频播放错误事件 */
    onError(cb: () => {})

    /** 取消监听音频播放错误事件 */
    offError(cb: () => {})

    /** 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发 */
    onWaiting(cb: () => {})

    /** 取消监听音频加载中事件 */
    offWaiting(cb: () => {})

    /** 监听音频进行跳转操作的事件 */
    onSeeking(cb: () => {})

    /** 取消监听音频进行跳转操作的事件 */
    offSeeking(cb: () => {})

    /** 监听音频完成跳转操作的事件 */
    onSeeked(cb: () => {})

    /** 取消监听音频完成跳转操作的事件 */
    offSeeked(cb: () => {})
  }

  function createInnerAudioContext(): IInnerAudioContext

  function getFileSystemManager(): IFileSystemManager

  function onShow(opt: (opt: {
    scene: string
    query: any
    shareTicket: string
    referrerInfo: {
      appId: string
      extraData: any
    }
  }) => void): void

  function offShow(opt: () => void): void

  function onHide(opt: () => void): void

  function offHide(opt: () => void): void

  function getLaunchOptionsSync(opt: (opt: {
    scene: string
    query: any
    shareTicket: string
    referrerInfo: {
      appId: string
      extraData: any
    }
  }) => void): void

  function onTouchStart(opt: (opt: {
    touches: Touch[]
    changedTouches: Touch[]
    timeStamp: number
  }) => void): void

  function offTouchStart(opt: () => void): void

  function getMenuButtonBoundingClientRect(): IRect
  function shareAppMessage(opt: {
    title?: string
    imageUrl?: string
    query?: string
    imageUrlId?: string
  }): void

  function onShareAppMessage(opt: () => {
    title?: string
    imageUrl?: string
    query?: string
    imageUrlId?: string
  }): void

  function onShareTimeline(opt: () => {
    title?: string
    imageUrl?: string
    query?: string
  }): void

  function showActionSheet(opt: {
    itemList: string[]
    itemColor?: string
    fail?: () => void
    success?: (opt: {tapIndex: number}) => void
    complete?: () => void
  }): void

  interface UserInfo {
    userInfo: {
      nickName: string
      avatarUrl: string
      /** 0: 未知 1: 男 2: 女 */
      gender: 0 | 1 | 2
      country: string
      city: string
      province: string
      language: 'en' | 'zh_CN' | 'zh_TW'
    }
    iv: string
    errMsg?: string
    rawData: string
    signature: string
    encryptedData: string
  }

  function createUserInfoButton(opt: {
    type: 'text' | 'image'
    text?: string
    image?: string
    withCredentials?: boolean
    lang?: 'en' | 'zh_CN' | 'zh_TW'
    style: {
      left: number
      top: number
      width: number
      height: number
      backgroundColor: string
      borderColor?: string
      borderWidth?: number
      borderRadius?: number
      color: string
      textAlign: 'left' | 'center' | 'right'
      fontSize: number
      lineHeight: number
    }
  }): {
    show: () => void
    hide: () => void
    destroy: () => void
    onTap: (opt: (opt: UserInfo) => void) => void
    offTap: () => void
  }

  function getUserInfo(opt: {
    withCredentials?: boolean
    lang?: 'en' | 'zh_CN' | 'zh_TW'
    fail?: () => void
    success?: (opt: UserInfo) => void
    complete?: () => void
  }): void

  function onAudioInterruptionEnd(opt: () => void): void

  interface KVDataList {
    [key: string]: any
    wxgame?: {
      score: number
      upate_time: number
    }
  }

  function setUserCloudStorage(opt: {
    KVDataList: KVDataList[]
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  function getOpenDataContext(): {
    canvas: HTMLCanvasElement
    postMessage: (opt: any) => void
  }

  function loadFont(path: string): string

  function onMessage(opt: any): void

  function getFriendCloudStorage(opt: {
    fail?: () => void,
    complete?: () => void,
    keyList: string[]
    success?: (opt: {
      data: {
        openid: string
        nickname: string
        avatarUrl: string
        KVDataList: {key: string, value: string}[]
      }[]
    }) => void
  }): void

  function getSharedCanvas(): HTMLCanvasElement

  function createImage(): HTMLImageElement
  function createCanvas(): HTMLCanvasElement

  interface GameClubButton {
    show: () => void
    hide: () => void
  }

  function createGameClubButton(opt: {
    type?: 'text' | 'string'
    text?: string
    image?: string
    style: {
      left: number
      right?: number
      top: number
      width: number
      height: number
      backgroundColor?: number
      borderColor?: number
      borderWidth?: number
      borderRadius?: number
      color?: string
      textAlign?: 'left' | 'center' | 'right'
      fontSize?: number
      lineHeight?: number
    }
    icon: 'green' | 'white' | 'dark' | 'light'
  }): GameClubButton

  interface CustomAd {
    show: () => Promise<unknown>
    hide: () => Promise<unknown>
    destroy: () => void
    onError: (opt: (opt: {errMsg: string, errCode: number}) => void) => void
  }

  function createCustomAd(opt: {
    adUnitId: string
    adIntervals?: number
    style?: {
      left?: number
      top?: number
      fixed?: boolean
    }
  }): CustomAd

  interface BannerAd {
    style: {
      top: number
      left: number
      width: number
      height: number
    }
    show: () => Promise<unknown>
    hide: () => Promise<unknown>
    destroy: () => void
    onError: (opt: (opt: {errMsg: string, errCode: number}) => void) => void
    onResize: (opt: (opt: {width: number, height: number}) => void) => void
  }

  function createBannerAd(opt: {
    adUnitId: string
    adIntervals?: number
    style?: {
      top?: number
      left?: number
      width?: number
      height?: number
    }
  }): BannerAd

  function loadSubpackage(opt: {
    name: string
    success?: () => void
    fail?: () => void
    complete?: () => void
  })

  interface InterstitialAd {
    show: () => Promise<unknown>
    hide: () => void
    destroy: () => void
    onLoad: (opt: () => void) => void
    onError: (opt: (opt: {errMsg: string, errCode: number}) => void) => void
    onClose: (opt: () => void) => void
  }

  function createInterstitialAd(opt: {
    adUnitId: string
  }): InterstitialAd
}

declare module wx {
  module cloud {
    /** 调用云函数 */
    function callFunction(opt: {
      name: string
      data: any
    }): void

    function init(opt?: {
      env: string
    }): void

    function downloadFile(opt: {
      fileID: string
      config?: {env: string}
      fail?: () => void
      success?: (opt: {tempFilePath: string, statusCode: number, errMsg: string}) => void
      complete?: () => void
    }): void

    function getTempFileURL(opt: {
      fileList: string[]
    }): Promise<{
      fileList: {
        fileID: string
        tempFileURL: string
        /** 0 为成功 */
        status: number
        errMsg: string
      }[]
    }>

    function callFunction(opt: {
      name: string
      data?: any
      config?: {env: string}
    }): Promise<{
      result: any
      requestID: string
    }>

    interface Document {
      get: () => Promise<any>
    }

    interface Collection {
      doc: (id: string) => Document
    }

    interface Database {
      collection: (name: string) => Collection
    }

    function database(opt: {
      env?: string
      throwOnNotFound?: boolean
    }): Database
  }
}

declare module wx {
  module env {
    const USER_DATA_PATH: string
  }
}

interface IFileSystemManager {
  access(opt: {
    path: string
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  mkdir(opt: {
    dirPath: string
    recursive?: boolean
    fail?: () => void
    success?: () => void
    complete?: () => void
  }): void

  /** 保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。 */
  saveFile(opt: {
    /** 临时存储文件路径 (本地路径) */
    tempFilePath: string

    /** 要存储的文件路径 (本地路径) */
    filePath: string
    fail?: () => void
    success?: (opt: {savedFilePath: string}) => void
    complete?: () => void
  }): void

  readFile(opt: {
    filePath: string
    encoding?: string
    position?: number
    length?: number,
    fail?: () => void
    success?: (opt: {data: string | ArrayBuffer}) => void
    complete?: () => void
  }): void
}
