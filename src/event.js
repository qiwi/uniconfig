// @flow

import {isBrowser} from './base'
import type {IEventEmitter} from './interface'
import eventEmitterPolyfill from './eventEmitterPolyfill'

export function eventEmitterFactory (): IEventEmitter {
  const Constructor = isBrowser()
    ? eventEmitterPolyfill
    : require('events')

  return new Constructor()
}

export const READY = 'CONFIG_READY'
