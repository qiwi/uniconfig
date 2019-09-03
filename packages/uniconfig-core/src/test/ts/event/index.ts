describe('event', () => {
  describe('eventEmitterFactory', () => {
    const globalAny: any = global;

    afterAll(() => {
      delete globalAny.window
    })

    beforeEach(jest.resetModules)

    it('constructs native emitter in nodejs runtime', () => {
      const EventEmitter = require('events')
      const { eventEmitterFactory } = require('../../../main/ts/event')
      const emitter = eventEmitterFactory()

      expect(emitter).toBeInstanceOf(EventEmitter)
    })

    it('constructs eePolyfill emitter instance in browser', () => {
      globalAny.window = { document: {} }

      const { eventEmitterFactory } = require( '../../../main/ts/event')
      const EventEmitterPolyfill = require('../../../main/ts/event/polyfill').default
      const emitter = eventEmitterFactory()

      expect(emitter).toBeInstanceOf(EventEmitterPolyfill)
    })
  })
})
