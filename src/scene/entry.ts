import {stage, screen, monitor} from '~/core'
import {Color, sound, chart} from '~/module'
import {store} from '~/util'

let container: PIXI.Container
let layout: PIXI.Graphics
let btns: PIXI.NineSlicePlane[]

function init() {
  container = new PIXI.Container()
  container.interactive = true
  container.on('pointerdown', (e: IEvent) => {
    if (!e.target?.name) return
    switch (e.target.name) {
      case 'btn:new': {
        wx.showActionSheet({
          itemList: ['容易', '普通', '困难', '专家'],
          success: ({tapIndex}) => {
            sound.play('tap.ogg')
            monitor.emit('scene:go', 'game', {
              difficulty: tapIndex,
              level: store.levels[tapIndex] || 0
            })
          }
        })
        break
      }

      case 'btn:continue': {
        sound.play('tap.ogg')
        monitor.emit('scene:go', 'game', {
          restore: true
        })
        break
      }
    }
  })


  layout = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 600, 940)
    .endFill()

  layout.pivot.set(layout.width / 2, layout.height / 2)
  layout.position.set(screen.width / 2, screen.height / 2)

  chart.pivot.set(chart.width / 2, 0)
  chart.position.set(layout.width / 2, 0)


  btns = [
    new PIXI.NineSlicePlane(PIXI.Texture.from('button.png'), 40, 40, 40, 40),
    new PIXI.NineSlicePlane(PIXI.Texture.from('button.png'), 40, 40, 40, 40)
  ]

  for (let i = 0, j = btns.length; i < j; i++) {
    const btn = btns[i]
    !i && (btn.tint = Color.Button)
    btn.width = 500
    btn.height = 110
    btn.interactive = true
    btn.pivot.set(250, 0)
    btn.position.set(layout.width / 2, chart.y + chart.height + 40 + 140 * i)

    if (!store.record && i) btn.visible = false

    if (j > 1) {
      if (i) {
        const text = new PIXI.Text('新游戏', {
          fill: Color.Button,
          fontSize: 32
        })
        text.anchor.set(.5)
        text.position.set(btn.width / 2, btn.height / 2 - 4)
        btn.name = 'btn:new'
        btn.addChild(text)
      } else { // 继续游戏
        const text = new PIXI.Text('继续游戏', {
          fill: 0xffffff,
          fontSize: 28
        })
        text.anchor.set(.5, 0)
        text.position.set(btn.width / 2, 18)
        btn.name = 'btn:continue'
        btn.addChild(text)

        const info = new PIXI.Text(`用时: ${format(store.record.time || 0)} - ${['容易', '普通', '困难', '专家'][store.record.difficulty]}`, {
          fill: 0xffffff,
          fontSize: 24
        })
        info.alpha = .8
        info.anchor.set(.5, 1)
        info.position.set(btn.width / 2, btn.height - 28)
        btn.addChild(info)
        container.on('show', () => {
          info.text = `用时: ${format(store.record.time || 0)} - ${['容易', '普通', '困难', '专家'][store.record.difficulty]}`
        })
      }
    } else {
      const text = new PIXI.Text('新游戏', {
        fill: 0xffffff,
        fontSize: 32
      })
      btn.name = 'btn:new'
      text.anchor.set(.5)
      text.position.set(btn.width / 2, btn.height / 2 - 4)
      btn.addChild(text)
    }
  }

  layout.addChild(chart, ...btns)
  layout.scale.set(GameGlobal.zoom)
  container.addChild(layout)
  stage.addChild(container)
}


export function show() {
  if (!container) return init()
  container.visible = true
  container.emit('show')
}

export function hide() {
  container.visible = false
}

function format(i: number) {
  let h = 0, m = 0
  const queue = []
  if (i > 59) m = i / 60 | 0
  if (m > 59) h = m / 60 | 0
  i -= h * 3600 + m * 60
  if (h) queue.push(h, '时')
  if (m) queue.push(m, '分')
  if (i) queue.push(i, '秒')
  return queue.join(' ')
}
