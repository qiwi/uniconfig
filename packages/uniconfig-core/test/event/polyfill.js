import Emitter from '../../src/event/polyfill'

describe('eventEmitterPolyfill', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const emitter = new Emitter()

      expect(emitter).toBeInstanceOf(Emitter)
      expect(emitter.events).toEqual({})
    })
  })

  describe('proto', () => {
    const emitter = new Emitter()

    beforeEach(() => {
      emitter.events = {}
    })

    it('`on` adds listener to target event type', () => {
      const foo = () => {}
      const bar = () => {}

      emitter.on('baz', foo)
      emitter.on('baz', bar)

      expect(emitter.events).toEqual({ baz: [foo, bar] })
    })

    describe('`removeListener`', () => {
      it('excludes target handler from chain', () => {
        const foo = () => {}
        const bar = () => {}

        emitter.on('baz', foo)
        emitter.on('baz', bar)

        expect(emitter.removeListener('baz', foo)).toBe(emitter)
        expect(emitter.events).toEqual({ baz: [bar] })
      })

      it('does nothing if event type is not registered', () => {
        const foo = () => {}

        emitter.on('foo', foo)

        expect(emitter.removeListener('bar')).toBe(emitter)
        expect(emitter.events).toEqual({ foo: [foo] })
      })

      it('does nothing if handler in not found in chain', () => {
        const foo = () => {}
        const bar = () => {}

        emitter.on('foo', foo)

        expect(emitter.removeListener('foo', bar)).toBe(emitter)
        expect(emitter.events).toEqual({ foo: [foo] })
      })
    })

    describe('`emit`', () => {
      const emitter = new Emitter()
      const foo = jest.fn(() => {})
      const bar = jest.fn(() => {})
      const qux = jest.fn(() => {})

      emitter.on('baz', foo)
      emitter.on('baz', bar)
      emitter.on('qux', qux)

      beforeEach(() => {
        foo.mockClear()
        bar.mockClear()
        qux.mockClear()
      })

      it('triggers chain of responsibility', () => {
        expect(emitter.emit('baz', 1, 2, 3)).toBeTruthy()
        expect(foo).toBeCalledWith(1, 2, 3)
        expect(bar).toBeCalledWith(1, 2, 3)
        expect(qux).not.toHaveBeenCalled()
      })

      it('does nothing if no handler is specified for target event', () => {
        expect(emitter.emit('unknown', 1, 2, 3)).toBeFalsy()
        expect(foo).not.toHaveBeenCalled()
        expect(bar).not.toHaveBeenCalled()
        expect(qux).not.toHaveBeenCalled()
      })
    })

    it('`once` registers single-runnable handler', () => {
      const emitter = new Emitter()
      const foo = jest.fn(() => {})

      emitter.once('foo', foo)

      expect(emitter.emit('foo', 1, 2, 3)).toBeTruthy()
      expect(emitter.emit('foo', 1, 2, 3)).toBeFalsy()
      expect(foo).toHaveBeenCalledTimes(1)
      expect(foo).toHaveBeenCalledWith(1, 2, 3)
    })
  })
})
