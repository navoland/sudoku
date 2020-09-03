import {store} from '~/util'
import {fs} from './wx'

const cache: {[k: string]: wx.IInnerAudioContext} = {}
const prefix = `${fs.ROOT}/sound`

export function play(id: string, opt: {volume?: number, loop?: boolean } = {}) {
  if (store.setting.voice > 2 ) return
  const sound = cache[id] || wx.createInnerAudioContext()
  sound.volume = opt.volume ?? 1
  sound.src = `${prefix}/${id}`
  sound.seek(0)
  sound.play()
  return cache[id] = sound
}

export function load(id: string, opt: {volume?: number, loop?: boolean} = {}) {
  const sound = cache[id] || wx.createInnerAudioContext()
  sound.loop = opt.loop
  sound.volume = opt.volume ?? 1
  sound.src = `${prefix}/${id}`
  return cache[id] = sound
}
