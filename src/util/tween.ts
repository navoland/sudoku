import {tween, easing} from 'popmotion'
import {createPromise} from '~/util'

interface IOption {
  [k: string]: any
  target: any,
  duration?: number
  yoyo?: number
  update?: (v: IOption, progress?: number) => boolean
  ease?: (v: number) => number
  sx?: number
  sy?: number
  x?: number
  y?: number
  alpha?: number
  rotation?: number
  loop?: number
}
export default function(opt: IOption) {
  const [promise, resolve] = createPromise()
  const {
    target,
    duration,
    ease,
    update,
    yoyo,
    loop,
    ...attr
  } = opt

  const keys = Object.keys(attr)

  const playback = tween({
    yoyo,
    from: Object.fromEntries(keys.map(k => {
      if (k === 'sx') return [k, target.scale.x]
      else if (k === 'sy') return [k, target.scale.y]
      return [k, target[k]]
    })),
    to: attr as any,
    duration: (duration ?? .2) * 1e3,
    ease: ease || easing.linear,
    loop: loop || 0
  }).start({
    update: (v: any) => {
      if (target._destroyed) return resolve(playback.stop())

      const ok = update?.(v, playback.getProgress())

      if (ok) return

      for (const k in v) {
        if (k === 'sx') target.scale.x = v[k]
        else if (k === 'sy') target.scale.y = v[k]
        else target[k] = v[k]
      }
    },
    complete: resolve
  })

  const _promise: Promise<unknown> & {playback?: typeof playback} = promise

  _promise.playback = playback

  return _promise
}
