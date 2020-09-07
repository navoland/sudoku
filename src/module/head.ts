import {delay, store} from '~/util'
import {Grade, Color} from './enum'

const grades = Object.values(Grade)
const head: Head = new PIXI.Graphics()

head.init = function(opt) {
  const {width, height} = opt
  head
    .clear()
    .beginFill(0xffcc33)
    .drawRect(0, 0, width, height)
    .endFill()

  const grade = new PIXI.Text(`难度: ${grades[opt.grade]}`, {
    fill: Color.Gray,
    fontSize: 26,
  })
  grade.anchor.set(0, .5)
  grade.position.set(0, height / 2)

  const progress = new PIXI.Text(`进度: ${opt.index}`, {
    fill: Color.Gray,
    fontSize: 26,
  })
  progress.anchor.set(.5, .5)
  progress.position.set(width / 2, height / 2)

  const duration = new PIXI.Text(`用时: ${format(store.last.duration)}`)
  duration.anchor.set(1, .5)
  duration.position.set(width, height / 2)

  void function loop() {
    duration.text = `用时: ${format(store.last.duration)}`
    head.worldVisible && store.last.duration++
    if (!duration.transform) return
    delay(1).then(loop)
  }()

  this.addChild(grade, progress, duration)
}

head.refresh = function(opt) {
  head.children.forEach((child: PIXI.Text, i) => {
    switch (i) {
      case 0: {
        child.text = `难度: ${grades[opt.grade]}`
        break
      }

      case 1: {
        child.text = `进度: ${opt.index}`
        break
      }

      case 2: {
        child.text = `用时: ${format(store.last.duration)}`
        break
      }
    }
  })
}

interface IOption {
  width: number
  height: number
  grade: number
  index: string
}

interface Head extends PIXI.Graphics {
  init?(this: Head, opt: IOption): void
  refresh?(this: Head, opt: Partial<IOption>): void
}

export default head

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
