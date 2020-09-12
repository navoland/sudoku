import {Color, Grade} from './enum'
import {call} from './wx'

const grades = Object.values(Grade)


const chart: Chart = new PIXI.Graphics()
  .beginFill(0xffcc33, 0)
  .drawRect(0, 0, 600, 640)
  .endFill()

const lines: PIXI.Graphics[] = []

const rows: [PIXI.Sprite, PIXI.Text, PIXI.Text, PIXI.Text][] = []

for (let i = 0; i < 8; i++) {
  const avatar = new PIXI.Sprite(PIXI.Texture.WHITE)
  avatar.anchor.set(0, .5)

  const name = new PIXI.Text('', {fill: Color.Black, fontSize: 28})
  name.anchor.set(0, .5)

  const duration = new PIXI.Text('', {fill: Color.Gray, fontSize: 24})
  duration.anchor.set(1, 0)

  const grade = new PIXI.Text('', {fill: Color.Gray, fontSize: 24})
  grade.anchor.set(1, 1)

  const line = new PIXI.Graphics()
    .beginFill(0xcaccce)
    .drawRect(0, 0, 600, 1)
    .endFill()

  line.position.set(0, (i + 1) * 80 - 1)

  line.visible =
  grade.visible =
  name.visible =
  duration.visible =
  avatar.visible = false

  lines.push(line)
  rows.push([avatar, name, grade, duration])
  chart.addChild(avatar, name, grade, duration, line)
}

chart.load = function() {
  return call({name: 'chart'}).then((data: any[]) => {
    for (let i = 0; i < 8; i++) {
      const [avatar, name, grade, duration] = rows[i]
      const item = data[i]
      avatar.visible =
      name.visible =
      grade.visible =
      duration.visible = !!item

      if (!item || !item.last) continue

      const {user = {}, last, _id} = item
      user.avatar ||= 'avatar.png'
      user.name ||= _id

      avatar.texture = PIXI.Texture.from(user?.avatar || 'avatar.png')
      avatar.width =
      avatar.height = 60
      name.text = user.name.length > 10 ? `${user.name.slice(0, 10)}...` : user.name
      duration.text = `${format(last.duration)}`
      grade.text = `${grades[last.grade]}: 第${last.index + 1}关`

      name.x = 70
      grade.x =
      duration.x = 600

      avatar.y =
      name.y = 40 + i * 80
      grade.y = name.y - 4
      duration.y = name.y + 4

      lines[i].visible =
      avatar.visible =
      name.visible =
      grade.visible =
      duration.visible = true
    }
  }).catch(console.log)
}

interface Chart extends PIXI.Graphics {
  load?(this: Chart): Promise<unknown>
}


export default chart

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
