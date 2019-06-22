// @flow

/**
 * Adapted from https://gist.github.com/mudge/5830382
 */

import {IAny, IEventEmitter, IEventListener} from '../interface'

type IListenersMap = {
  [key: string]: Array<IEventListener>
}

export default class EventEmitter implements IEventEmitter {

  events: IListenersMap
  constructor() {
    this.events = {}
  }

  on(event: string, listener: IEventListener): IEventEmitter {
    if (!this.events[event]) {
      this.events[event] = []
    }

    this.events[event].push(listener)

    return this
  }

// Awaits PR merge https://github.com/facebook/flow/pull/6471
// off (name: string, listener: IEventListener): IEventEmitter {
//   return this.removeListener(name, listener)
// }

  removeListener(event: string, listener: IEventListener): IEventEmitter {
    let idx

    if (this.events[event]) {
      idx = this.events[event].indexOf(listener)

      if (idx > -1) {
        this.events[event].splice(idx, 1)
      }
    }

    return this
  }

  once(event: string, listener: IEventListener): IEventEmitter {
    const self = this

    function g(...args: IAny[]) {
      self.removeListener(event, g)
      listener.apply(null, args)
    }

    return this.on(event, g)
  }

  emit(event: string, ...args: IAny[]): boolean {
    if (this.events[event]) {
      const listeners = this.events[event].slice()
      const length = listeners.length

      for (let i = 0; i < length; i++) {
        listeners[i].apply(this, args)
      }
      return listeners.length > 0
    }

    return false
  }

}
