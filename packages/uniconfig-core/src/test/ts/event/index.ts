import * as EventEmitter from 'events'
import EventEmitterPolyfill from '../../../main/ts/event/polyfill'
import { eventEmitterFactory } from '../../../main/ts/event'

describe('event', () => {
  describe('eventEmitterFactory', () => {
    const globalAny: any = global;

    afterAll(() => {
      delete globalAny.window
    })

    it('constructs native emitter in nodejs runtime', () => {
      const emitter = eventEmitterFactory()
      expect(emitter).toBeInstanceOf(EventEmitter)
    })

    it('constructs eePolyfill emitter instance in browser', () => {
      globalAny.window = { document: {} }
      const emitter = eventEmitterFactory()
      expect(emitter).toBeInstanceOf(EventEmitterPolyfill)
    })
  })
})
