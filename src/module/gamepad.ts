import {renderer} from '~/core'
import {Dir} from './enum'

const {abs} = Math
const event: {
  direction?: Dir
} = {}

const touch: {
  x?: number
  y?: number
  t?: number
  down?: boolean
} = {}

/** 为了以后绘制手柄 */
class Gamepad extends PIXI.Container {}

const gamepad = new Gamepad()

renderer.plugins.interaction.on('pointerdown', (e: IEvent) => {
  if (e.stopped || touch.down) return
  touch.x = e.x
  touch.y = e.y
  touch.down = true
  touch.t = performance.now()
}).on('pointerup', (e: IEvent) => {
  if (!touch.down) return
  touch.down = false
  const now = performance.now()
  const dx = e.x - touch.x
  const dy = e.y - touch.y
  const dt = (now - touch.t) / 1e3

  // 时间间隔过大
  if (dt > 3) return

  const _dx = abs(dx)
  const _dy = abs(dy)

  // 滑动间距过小
  if (_dx < 5 && _dy < 5) return

  event.direction = _dx > _dy ?
    dx > 0 ? Dir.Right : Dir.Left :
    dy > 0 ? Dir.Down : Dir.Up

  gamepad.emit('direction', event)
})

export default gamepad
