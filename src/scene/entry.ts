import {stage, screen, monitor} from '~/core'
import {chart, Color, Grade, sound} from '~/module'
import {getUserInfo} from '~/module/wx'
import {store, delay} from '~/util'

const width = 600
const height = chart.height + 260
const grades = Object.values(Grade)

let layout: PIXI.Graphics
let container: PIXI.Container
let btns: PIXI.NineSlicePlane[]

function init() {
  container = new PIXI.Container()
  layout = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, width, height)
    .endFill()
  layout.interactive = true
  layout.on('pointerdown', (e: IEvent) => {
    switch (e.target?.name) {
      case 'btn:new': {
        sound.play('tap.mp3')
        wx.showActionSheet({
          itemList: grades,
          success: ({tapIndex}) => {
            monitor.emit('scene:go', 'game', {
              grade: tapIndex,
              index: store.last?.index || 0
            })
          }
        })
        getUserInfo().then(({userInfo}) => {
          const {user} = store
          user.name = userInfo.nickName
          user.name = userInfo.nickName
          user.avatar = userInfo.avatarUrl
          user.city = userInfo.city
          user.country = userInfo.country
          user.gender = userInfo.gender
          user.province = userInfo.province
        })
        break
      }

      case 'btn:restore': {
        sound.play('tap.mp3')
        monitor.emit('scene:go', 'game')
        break
      }
    }
  })

  btns = [
    new PIXI.NineSlicePlane(PIXI.Texture.from('button.png'), 40, 40, 40, 40),
    new PIXI.NineSlicePlane(PIXI.Texture.from('button.png'), 40, 40, 40, 40),
  ]

  btns.forEach((btn, i) => {
    btn.width = 400
    btn.height = 110
    btn.interactive = true
    btn.pivot.set(btn.width / 2, 0)
    btn.x = width / 2
    btn.y = chart.height + 40 + i * 130
    btn.addChild(new PIXI.Text(''), new PIXI.Text(''))
    layout.addChild(btn)
  })

  chart.load()
  chart.pivot.set(chart.width / 2, 0)
  chart.position.set(width / 2, 0)
  layout.addChild(chart)

  void function loop() {
    if (container.visible) return chart.load().then(() => delay(10)).then(loop)
    delay(10).then(loop)
  }()


  layout.pivot.set(width / 2, height / 2)
  layout.position.set(screen.width / 2, screen.height / 2)
  layout.scale.set(window.zoom)
  container.addChild(layout)
  stage.addChild(container)
  refresh()
}

function refresh() {
  if (store.last) {
    btns.forEach((btn, i) => {
      btn.visible = true
      if (i) {
        btn.tint = Color.White
        btn.name = 'btn:new'
        btn.children.forEach((item: PIXI.Text, i) => {
          if (i) return item.visible = false
          item.text = '新游戏'
          item.style.fontSize = 30
          item.style.fill = Color.Button
          item.anchor.set(.5)
          item.position.set(200, 50)
        })
      } else {
        btn.tint = Color.Button
        btn.name = 'btn:restore'
        btn.children.forEach((item: PIXI.Text, i) => {
          item.visible = true
          item.alpha = i ? .8 : 1
          item.text = i ? `用时: ${format(store.last.duration)} - ${grades[store.last.grade]}` : '继续游戏'
          item.style.fill = Color.White
          item.style.fontSize = i ? 24 : 28
          item.anchor.set(.5, i ? 1 : 0)
          item.position.set(200, i ? 82 : 18)
        })
      }
    })
    return
  }

  // 只有一个
  btns[1].visible = false
  btns[0].tint = Color.Button
  btns[0].name = 'btn:new'
  btns[0].children.forEach((item: PIXI.Text, i) => {
    if (i) return item.visible = false
    item.text = '新游戏'
    item.style.fontSize = 30
    item.style.fill = Color.White
    item.anchor.set(.5)
    item.position.set(200, 50)
  })
}

export function show() {
  if (!container) return init()
  container.visible = true
  refresh()
}

export function hide() {
  container.visible = false
}

function format(i: number) {
  let h = 0, m = 0
  const queue = []
  if (i > 59) {
    m = i / 60 | 0
    i -= m * 60
  }
  if (m > 59) {
    h = m / 60 | 0
    m -= h * 60
  }
  if (h) queue.push(h, 'h')
  if (m) queue.push(m, 'm')
  if (i) queue.push(i, 's')
  return queue.length ? queue.join(' ') : '0 s'
}
