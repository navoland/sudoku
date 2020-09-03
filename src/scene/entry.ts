import {spring} from 'popmotion'
import {stage, screen, monitor} from '~/core'
import {delay, store, tween} from '~/util'
import {sound} from '~/module'
import {chart} from '~/module/ui'
import {call, getUserInfo} from '~/module/wx'

const {factory} = dragonBones.PixiFactory
const {min} = Math
const clubButton = wx.createGameClubButton({
  icon: 'white',
  style: {
    left: 10,
    top: screen.height * .2,
    width: 40,
    height: 40
  }
})
clubButton.hide()

let container: PIXI.Container

async function init() {
  container = new PIXI.Container()
  container.interactive = true
  container.on('pointerdown', (e: IEvent) => {
    const target = e.target
    if (!target.name?.startsWith('btn')) return
    tween({
      target,
      sx: 1.2,
      sy: 1.2
    })
  }).on('pointerup', (e: IEvent) => {
    const target = e.target
    if (!target.name?.startsWith('btn')) return
    tween({
      target,
      sx: 1,
      sy: 1
    })
    switch (target.name) {
      case 'btn:start': {
        monitor.emit('scene:go', 'game')
        sound.play('tap.mp3')
        break
      }

      case 'btn:select': {
        monitor.emit('scene:go', 'selector')
        sound.play('tap.mp3')
        break
      }

      case 'btn:chart': {
        // 数据同步
        getUserInfo().then(({userInfo}) => {
          const {user} = store
          user.name = userInfo.nickName
          user.avatar = userInfo.avatarUrl
          user.city = userInfo.city
          user.country = userInfo.country
          user.gender = userInfo.gender
          user.province = userInfo.province
        }).then(() => {
          chart.show()
        }).finally(() => {
          call<typeof store>({
            name: 'store',
            data: {
              type: 'set',
              data: {
                user: store.user,
                score: store.score,
                setting: store.setting,
              }
            }
          }).then(data => {
            store.user = data.user
            store.score = data.score
            store.setting = data.setting
            store.timestamp = data.timestamp
          })
        })
        break
      }

      case 'btn:more': {
        wx.showActionSheet({
          itemList: ['支持作者'],
          success: ({tapIndex}) => {
            if (tapIndex === 0) wx.previewImage({
              urls: ['cloud://sokoban-j5n2j.736f-sokoban-j5n2j-1259687088/img/favor.jpg']
            })
          }
        })
        break
      }
    }
  }).on('pointerupoutside', (e: IEvent) => {
    const target = e.target
    if (!target.name?.startsWith('btn')) return
    tween({
      target,
      sx: 1,
      sy: 1
    })
  })

  // 背景动画
  {
    const anime = factory.buildArmatureDisplay('root')
    anime.animation.play('idle')
    anime.position.set(screen.width / 2, screen.height / 2)
    anime.scale.set(min(
      screen.width / 1152,
      screen.height / 1152
    ))

    container.addChild(anime)
  }

  // UI布局
  {
    const width = 450
    const height = 714
    const layout = new PIXI.Graphics()
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, width, height)
      .endFill()

    layout.pivot.set(width >> 1, height >> 1)
    layout.position.set(screen.width >> 1, screen.height >> 1)
    layout.scale.set(min(
      screen.width / GameGlobal.design.width,
      screen.height / GameGlobal.design.height
    ))
    container.addChild(layout)

    // slogan
    const slogan = PIXI.Sprite.from('text.slogan.png')
    slogan.position.set(width >> 1, slogan.height >> 1)
    layout.addChild(slogan)

    spring({
      from: .5,
      to: 1,
      damping: 3,
    }).start((v: number) => slogan.scale.set(v))

    // 按钮
    {
      const tex = PIXI.Texture.from('plane.green.png')
      const items = ['start', 'select', 'chart', 'more']
      items.forEach(async (id, i) => {
        const btn = new PIXI.NineSlicePlane(tex, 10, 10, 10, 10)
        btn.alpha = 0
        btn.width = 260
        btn.height = 80
        btn.interactive = true
        btn.pivot.set(130, 40)
        btn.name = `btn:${id}`
        btn.position.set(width >> 1, slogan.y + slogan.height / 2 + 230 + i * 120 + 200)

        const text = PIXI.Sprite.from(`text.${id}.png`)
        text.scale.set(.6)
        text.position.set(130, 40)
        btn.addChild(text)
        layout.addChild(btn)

        await delay(i / 3)

        tween({
          alpha: 1,
          target: btn,
          duration: 1,
          y: btn.y - 200,
        })
      })
    }
  }

  stage.addChild(container)
}

export function show() {
  clubButton.show()
  if (!container) return init()
  container.visible = true
}

export function hide() {
  clubButton.hide()
  container.visible = false
}
