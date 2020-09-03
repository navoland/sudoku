import {call} from '../wx'

const lineHeight = 100
const padding = {left: 20, right: 30}

export default class extends PIXI.Container {
  #cursor = 0
  #width = 0
  #height = 0
  #loading =  false

  constructor(width: number, height: number) {
    super()
    this.#width = width
    this.#height = height
  }

  load() {
    if (this.#loading) return
    this.#loading = true
    wx.showLoading({title: '加载数据'})
    return call<{list: any[], next: boolean}>({
      name: 'newChart',
      data: {
        cursor: this.#cursor
      }
    }).then(data => {
      return {
        list: data.list.map((item: any) => ({
          step: item.score?.step,
          level: item.score?.level,
          avatar: item.user.avatar,
          name: item.user.name || item._id
        })),
        next: data.next
      }
    }).catch(console.log).finally(() => {
      this.#loading = false
      wx.hideLoading()
    })
  }

  async update() {
    const data = await this.load()
    this.clear()
    if (!data) return wx.showToast({title: '数据加载失败', icon: 'none'})
    const {list} = data
    if (!list.length) {
      const text = new PIXI.Text('暂无数据', {
        fill: 0xffffff,
        fontSize: 32,
      })
      text.anchor.set(.5)
      text.position.set(this.#width / 2, this.#height / 2)
      return
    }

    for (let i = 0, j = list.length; i < j; i++) {
      const item = list[i]
      const avatar = PIXI.Sprite.from(item.avatar || 'avatar.png')
      if (!avatar.texture.valid) {
        avatar.texture.baseTexture.on('loaded', () => {
          avatar.width =
          avatar.height = 60
          avatar.anchor.set(0, .5)
        })
      } else {
        avatar.width =
        avatar.height = 60
        avatar.anchor.set(0, .5)
      }

      avatar.position.set(padding.left, (i + .5) * lineHeight)


      const name = new PIXI.Text(item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name, {
        fill: 0xffffff,
        fontSize: 30,
      })
      name.anchor.set(0, .5)
      name.position.set(avatar.x + 80, (i + .5) * lineHeight)

      const level = new PIXI.Text(`关卡: ${item.level || 0}`, {
        fill: 0xffffff,
        fontSize: 24,
        fontWeight: 'bold'
      })

      level.anchor.set(1, 1)
      level.position.set(this.#width - padding.right, (i + .5) * lineHeight - 4)

      {(item.step === Number.MAX_SAFE_INTEGER || !item.step) && (item.step = '无')}
      const step = new PIXI.Text(`步数: ${item.step || 0}`, {
        fill: 0xffffff,
        fontSize: 20,
      })

      step.anchor.set(1, 0)
      step.position.set(this.#width - padding.right, (i + .5) * lineHeight + 4)

      this.addChild(avatar, name, level, step)
    }

    //
    if (this.#cursor > 0) {
      const prev = new PIXI.Text('上一页', {
        fill: 0xffffff,
        fontSize: 32,
      })
      prev.anchor.set(.5, .5)
      prev.position.set(this.#width / 2 - (data.next ? 80 : 0), 8.5 * lineHeight)
      prev.interactive = true
      prev.once('tap', () => {
        this.#cursor--
        this.update()
      })
      this.addChild(prev)
    }

    if (data.next) {
      const next = new PIXI.Text('下一页', {
        fill: 0xffffff,
        fontSize: 32,
      })
      next.anchor.set(.5, .5)
      next.position.set(this.#width / 2 + (this.#cursor > 0 ? 80 : 0), 8.5 * lineHeight)
      next.interactive = true
      next.once('tap', () => {
        this.#cursor++
        this.update()
      })
      this.addChild(next)
    }
  }

  clear() {
    this.removeChildren().forEach((item: PIXI.Container) => {
      item.destroy({children: true})
    })
  }
}
