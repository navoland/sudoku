import levels from '@/level'
import {delay, store} from '~/util'
import {stage, screen, pixelRatio} from '~/core'
import {Color, Difficulty, grid, Mode, sound, btnBack} from '~/module'

const {min} = Math

let container: PIXI.Container
let numpad: PIXI.Graphics
let toolbar: PIXI.Graphics
let mode: Mode = Mode.Pen
let head: PIXI.Graphics

async function init(opt: {difficulty: Difficulty, level: number, restore: boolean}) {
  const rect = await GameGlobal.interaction
  container = new PIXI.Container()

  if (opt.restore) {
    opt.difficulty = store.record.difficulty
    opt.level = store.record.level
  }


  head = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 720, 60)
    .endFill()

  head.pivot.set(head.width / 2, 0)
  head.position.set(
    screen.width / 2,
    (rect.bottom + min(rect.top, 20)) * pixelRatio
  )
  {
    const difficulty = new PIXI.Text(`难度: ${['容易', '普通', '困难', '专家'][opt.difficulty]}`, {
      fill: Color.Gray,
      fontSize: 26,
    })

    difficulty.anchor.set(0, .5)
    difficulty.position.set(0, head.height / 2)

    const progress = new PIXI.Text(`进度: ${opt.level + 1} / ${levels[opt.difficulty].length}`, {
      fill: Color.Gray,
      fontSize: 26,
    })

    progress.anchor.set(.5, .5)
    progress.position.set(head.width / 2, head.height / 2)

    let time = opt.restore ? store.record.time || 0 : 0
    const elapsed = new PIXI.Text(`用时: 0 秒`, {
      fill: Color.Gray,
      fontSize: 26,
    })
    elapsed.anchor.set(1, .5)
    elapsed.position.set(head.width, head.height / 2)

    void function loop() {
      elapsed.text = `用时: ${format(time)}`
      container.worldVisible && time++
      store.record.time = time
      if (!elapsed.transform) return
      delay(1).then(loop)
    }()

    head.addChild(difficulty, progress, elapsed)
  }

  head.scale.set(GameGlobal.zoom)
  container.addChild(head)

  grid.layout(levels[opt.difficulty][opt.level] as ILevelData, opt.restore)
  grid.position.set(screen.width / 2, head.y + head.height + 20)
  grid.scale.set(GameGlobal.zoom)
  container.addChild(grid)

  numpad = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 720, 80)
    .endFill()

  const hitArea = new PIXI.Rectangle(-40, -40, 80, 80)

  for (let i = 1; i < 10; i++) {
    const num = new PIXI.Text(`${i}`, {
      fill: Color.Blue,
      fontSize: 48
    })
    num.name = `${i}`
    num.interactive = true
    num.anchor.set(.5)
    num.hitArea = hitArea
    num.position.set(40 + 80 * (i - 1), 40)
    numpad.addChild(num)
  }

  numpad.interactive = true
  numpad.on('pointerdown', (e: IEvent) => {
    e.stopped = true
    if (e.target === numpad || !grid.cell) return
    if (mode === Mode.Pen) {
      sound.play('pen.ogg')
      grid.cell.num = +e.target.name
      grid.check() && next()
      grid.save()
      return
    }
    sound.play('pencil.ogg')
    grid.cell.toggle(+e.target.name)
    grid.save()
  })

  numpad.pivot.set(numpad.width / 2, numpad.height / 2)
  numpad.position.set(screen.width / 2, grid.y + grid.height + 100)
  numpad.scale.set(GameGlobal.zoom)

  toolbar = new PIXI.Graphics()
    .beginFill(0, 0)
    .drawRect(0, 0, 680, 64)
    .endFill()

  toolbar.interactive = true
  toolbar.pivot.set(toolbar.width / 2, 0)
  toolbar.position.set(screen.width / 2, screen.height - 100)
  toolbar.on('pointerdown', (e: IEvent) => {
    e.stopped = true
    if (e.target === toolbar) return
    const target = e.target as PIXI.Sprite
    switch (e.target.name) {
      case 'pencil': {
        if (mode === Mode.Pen) {
          sound.play('pencil.ogg')
          mode = Mode.Pencil
          target.tint = Color.Blue
        } else {
          mode = Mode.Pen
          sound.play('pen.ogg')
          target.tint = Color.Gray
        }
        break
      }

      case 'eraser': {
        if (grid.cell) {
          grid.cell.erase()
          sound.play('erase.ogg')
        }
        break
      }

      case 'tip': {
        sound.play('tap.ogg')
        wx.showModal({
          title: '获取提示',
          content: '观看完整视频广告，获取3次提示机会',
          success: () => {
            GameGlobal.videoAd
              .show()
              .catch(() => GameGlobal.videoAd.load())
              .catch((err) => {
                err.errCode === 1002 && wx.showToast({title: '暂无广告资源', icon: 'none'})
              })
          }
        })
        break
      }
    }
  })

  const pencil = PIXI.Sprite.from('icon.pencil.png')
  pencil.interactive = true
  pencil.name = 'pencil'
  pencil.tint = Color.Gray
  pencil.scale.set(.5)
  pencil.position.set(toolbar.width / 2, toolbar.height / 2)

  const tip = PIXI.Sprite.from('icon.tip.png')
  tip.name = 'tip'
  tip.interactive = true
  tip.tint = Color.Gray
  tip.scale.set(.5)
  tip.anchor.set(1, .5)
  tip.position.set(toolbar.width, toolbar.height / 2)
  toolbar.addChild(pencil, tip)

  const eraser = PIXI.Sprite.from('icon.eraser.png')
  eraser.interactive = true
  eraser.name = 'eraser'
  eraser.tint = Color.Gray
  eraser.scale.set(.5)
  eraser.anchor.set(0, .5)
  eraser.position.set(0, toolbar.height / 2)
  toolbar.addChild(pencil, tip, eraser)
  toolbar.scale.set(GameGlobal.zoom)

  container.addChild(numpad, toolbar)
  stage.addChild(container)
}

function next() {
  sound.play('win.ogg')
  const {record} = store
  const current = store.levels[record.difficulty] || 0
  if (current + 1 === levels[record.difficulty].length) wx.showToast({title: '当前模式已通关', icon: 'none'})
  else store.levels[record.difficulty] = current + 1
  {(head.children[1] as PIXI.Text).text = `进度: ${store.levels[record.difficulty] + 1} / ${levels[record.difficulty].length}`}
  grid.update(levels[record.difficulty][store.levels[record.difficulty]] as ILevelData)
}

export function show(opt: {difficulty: Difficulty, level: number, restore: boolean}) {
  btnBack.show()
  !opt.restore && (store.record = {
    level: opt.level,
    difficulty: opt.difficulty,
  })
  if (!container) return init(opt)
  container.visible = true
  !opt.restore && grid.update(levels[opt.difficulty][opt.level] as ILevelData)
}

export function hide() {
  btnBack.hide()
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
