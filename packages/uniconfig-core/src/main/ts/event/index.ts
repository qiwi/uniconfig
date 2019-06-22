import {isBrowser} from '../base/util'
import {IEventEmitter} from '../interface'
import eventEmitterPolyfill from './polyfill'

export function eventEmitterFactory(): IEventEmitter {
  const Constructor = isBrowser()
    ? eventEmitterPolyfill
    : require('events')

  return new Constructor()
}

export const READY = 'CONFIG_READY'
