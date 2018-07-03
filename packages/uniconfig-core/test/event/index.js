import EventEmitter from 'events'
import EventEmitterPolyfill from '../../src/event/polyfill'
import {eventEmitterFactory} from '../../src/event'

describe('event', () => {
  describe('eventEmitterFactory', () => {
    afterAll(() => {
      delete global.window
    })

    it('constructs native emitter in nodejs runtime', () => {
      const emitter = eventEmitterFactory()
      expect(emitter).toBeInstanceOf(EventEmitter)
    })

    it('constructs eePolyfill emitter instance in browser', () => {
      global.window = {document: {}}
      const emitter = eventEmitterFactory()
      expect(emitter).toBeInstanceOf(EventEmitterPolyfill)
    })
  })
})
