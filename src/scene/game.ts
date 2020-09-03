import {stage, screen, monitor} from '~/core'
import levels from '@/level'
import {store, tween} from '~/util'
import {gamepad, Ground, sound} from '~/module'
import {btnBack} from '~/module/ui'
import {easing, spring} from 'popmotion'
import {call} from '~/module/wx'

const {min, random} = Math

let step = 0
let ground: Ground
let container: PIXI.Container
let head: {title?: PIXI.Text, step?: PIXI.Text} = {}

function init() {
  container = new PIXI.Container()
  // 底部工具栏
  {
    const toolbar = new PIXI.Graphics()
      .beginFill(0xffcc33, 0)
      .drawRect(0, 0, 448, 96)
      .endFill()

    toolbar.interactive = true
    toolbar.pivot.set(toolbar.width >> 1, toolbar.height >> 1)
    toolbar.position.set(screen.width >> 1, screen.height - 80)
    toolbar.scale.set(min(
      screen.width / GameGlobal.design.width,
      screen.height / GameGlobal.design.height,
    ))

    toolbar.on('pointerdown', (e: IEvent) => {
      const {target} = e
      if (!target.name?.startsWith('btn')) return
      tween({
        target,
        sx: 1,
        sy: 1,
      })
    }).on('pointerup', (e: IEvent) => {
      const {target} = e
      if (!target.name?.startsWith('btn')) return
      tween({
        target,
        sx: .75,
        sy: .75,
      })
      switch (target.name) {
        case 'btn:undo': {
          ground.emit('undo')
          break
        }

        case 'btn:replay': {
          sound.play('replay.mp3')
          ground.off('done')
          ground.destroy()
          setup()
          break
        }

        case 'btn:voice': {
          sound.play('undo.mp3')
          const setting = store.setting
          setting.voice++
          setting.voice > 4 && (store.setting.voice = 1)
          monitor.emit('setting:bgm', setting.voice)
          {(target as PIXI.Sprite).texture = PIXI.Texture.from(`btn.voice.${setting.voice}.png`)}
          break
        }
      }
    }).on('pointerupoutside', (e: IEvent) => {
      const {target} = e
      if (!target.name?.startsWith('btn')) return
      tween({
        target,
        sx: .75,
        sy: .75
      })
    })

    {
      const items = ['voice', 'undo', 'replay']
      items.forEach((item, i) => {
        const btn = PIXI.Sprite.from(`btn.${i ? item : `${item}.${store.setting.voice}`}.png`)
        btn.name = `btn:${item}`
        btn.interactive = true
        btn.scale.set(.75)
        btn.position.set(
          48 + 176 * i,
          48
        )
        toolbar.addChild(btn)
      })
    }

    container.addChild(toolbar)
  }

  // title
  head.title = new PIXI.Text('No.1', {
    fill: 0xffffff,
    fontSize: 40,
    fontFamily: GameGlobal.font,
  })
  head.title.visible = false
  head.title.anchor.set(.5)

  head.step = new PIXI.Text(`Step: ${step}`, {
    fill: 0xffffff,
    fontSize: 32,
    fontFamily: GameGlobal.font,
  })
  head.step.visible = false
  head.step.anchor.set(.5)

  GameGlobal.interaction.then((rect) => {
    head.title.visible = true
    head.title.position.set(
      screen.width >> 1,
      rect.bottom + rect.top
    )
    head.step.visible = true
    head.step.position.set(head.title.x, head.title.y + head.title.height * 1.5)
  })
  setup()
  container.addChild(ground, head.title, head.step)
  stage.addChild(container)

  store.newbie && guide()
}

function setup() {
  step = 0
  head.step.text = `Step: ${step}`
  head.title.text = `No.${GameGlobal.level + 1}`
  ground = new Ground(levels[GameGlobal.level])
  ground.pivot.set(ground.width >> 1, ground.height >> 1)
  ground.scale.set(min(
    1,
    screen.width * .8 / ground.width,
    screen.height * .8 / ground.height
  ))
  ground.position.set(screen.width >> 1, screen.height >> 1)
  ground.on('done', () => {
    const id = [
      'good',
      'amazing',
      'excellent',
      'unbelievable'
    ][random() * 4 | 0]

    const slogan = PIXI.Sprite.from(`text.${id}.png`)
    sound.play(`${id}.mp3`)
    const anime = spring({
      from: {scale: 0, rotation: -.5},
      to: {scale: 1, rotation: 0},
      damping: 5
    }).start({
      update: (v: {scale: number, rotation: number}) => {
        if (!slogan.transform) return anime.stop()
        slogan.scale.set(v.scale)
        slogan.rotation = v.rotation
      },

      complete: () => {
        tween({
          target: slogan,
          sx: 0,
          sy: 0,
          ease: easing.easeOut
        }).then(choose)
      }
    })

    slogan.scale.set(0)
    slogan.position.set(screen.width >> 1, screen.height >> 1)
    container.addChild(slogan)
  }).on('step', (i: number) => {
    step = i
    head.step.text = `Step: ${step}`
  })
  container.addChild(ground)
}

function next() {
  GameGlobal.level++
  GameGlobal.level >= levels.length && (GameGlobal.level = levels.length - 1)

  let updatable = false
  if (store.score.level < GameGlobal.level) {
    updatable = true
    store.score.level = GameGlobal.level
    store.score.step = step
  } else if (store.score.level === GameGlobal.level && step < store.score.step) {
    updatable = true
    store.score.step = step
  }
  // 开放域数据
  updatable && wx.setUserCloudStorage({
    KVDataList: [
      {key: 'score', value: JSON.stringify({
        wxgame: {
          score: store.score.level,
          update_time: Date.now()
        },
        step
      })}
    ]
  })
  // 世界排行榜
  call({
    name: 'newScore',
    data: {level: store.score.level, step}
  }).catch(console.log)

  ground.off('done')
  ground.destroy()
  setup()
}

export function show(level: number) {
  btnBack.show()
  GameGlobal.level = level ?? store.score.level
  if (!container) return init()
  container.visible = true
  ground.off('done')
  ground.destroy()
  setup()
}

export function hide() {
  btnBack.hide()
  container.visible = false
}

function guide() {
  const shadow = new PIXI.Graphics()
    .beginFill(0, .5)
    .drawShape(screen)
    .endFill()

  shadow.zIndex = 9

  const hand = PIXI.Sprite.from('hand.png')
  hand.position.set(screen.width / 2 - 100, screen.height / 2)
  shadow.addChild(hand)

  tween({
    target: hand,
    x: screen.width / 2 + 100,
    loop: Infinity,
    duration: 1,
    ease: easing.easeInOut
  })

  gamepad.once('direction', () => {
    store.newbie = false
    shadow.destroy({children: true})
  })

  stage.addChild(shadow)
}

function choose() {
  // ad
  GameGlobal.interAd.show().catch(console.log)
  GameGlobal.bannerAd.show().catch(console.log)

  const shadow = new PIXI.Graphics()
    .beginFill(0, .5)
    .drawShape(screen)
    .endFill()

  shadow.zIndex = 9
  stage.addChild(shadow)

  const layout = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 260, 560)
    .endFill()

  layout.pivot.set(130, 280)
  layout.scale.set(min(
    screen.width / GameGlobal.design.width,
    screen.height / GameGlobal.design.height
  ))
  layout.position.set(screen.width / 2, screen.height / 2)

  shadow.addChild(layout)

  const medal = PIXI.Sprite.from('medal.png')
  medal.anchor.set(.5, 0)
  medal.position.set(130, 0)
  layout.addChild(medal)
  layout.interactive = true
  layout.on('pointerdown', (e: IEvent) => {
    e.stopped = true
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
      case 'btn:next': {
        shadow.destroy({children: true})
        next()
        GameGlobal.bannerAd.hide()
        break
      }

      case 'btn:share': {
        wx.shareAppMessage({
          title: '同一个世界，同一个箱子',
          imageUrl: 'cloud://sokoban-j5n2j.736f-sokoban-j5n2j-1259687088/img/snapshot.1.png'
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

  const items = ['next', 'share']
  const tex = PIXI.Texture.from('plane.green.png')
  items.forEach((id, i) => {
    const btn = new PIXI.NineSlicePlane(tex, 10, 10, 10, 10)

    btn.width = 260
    btn.height = 80
    btn.interactive = true
    btn.pivot.set(130, 40)
    btn.name = `btn:${id}`
    btn.position.set(130, 360 + i * 160)

    const text = PIXI.Sprite.from(`text.${id}.png`)
    text.scale.set(.6)
    text.position.set(130, 40)
    btn.addChild(text)
    layout.addChild(btn)
  })
}
