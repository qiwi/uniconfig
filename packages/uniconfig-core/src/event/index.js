// @flow

import {isBrowser} from '../core/util'
import type {IEventEmitter} from '../interface'
import eventEmitterPolyfill from './polyfill'

export function eventEmitterFactory (): IEventEmitter {
  const Constructor = isBrowser()
    ? eventEmitterPolyfill
    : require('events')

  return new Constructor()
}

export const READY = 'CONFIG_READY'