import AbstractSource, {INITIAL, READY, FAILURE} from '../../src/source/abstract'
import EventEmitter from 'events'

describe('source/abstract', () => {
  class Source extends AbstractSource {}

  describe('constructor', () => {
    it('can not be directly instantiated', () => {
      expect(() => new AbstractSource({})).toThrow('Abstract source: cannot be instantiated')
    })

    it('returns proper instance', () => {
      const target = 'foo'
      const emitter = new EventEmitter()
      const mode = 'sync'
      const opts = {
        emitter,
        mode,
        target
      }
      const source = new Source(opts)

      expect(source).toBeInstanceOf(AbstractSource)
      expect(source.status).toBe(INITIAL)
      expect(source.type).toBe('abstract')
      expect(source.id).toEqual(expect.any(String))
      expect(source.target).toBe(target)
      expect(source.opts).toBe(opts)
      expect(source.emitter).toBe(emitter)
    })
  })

  describe('proto', () => {
    const target = 'foo'
    const emitter = new EventEmitter()
    const spy = jest.spyOn(emitter, 'emit').mockImplementation((...args) => {
      return EventEmitter.prototype.emit.apply(emitter, args)
    })
    const mode = 'sync'
    const opts = {
      emitter,
      mode,
      target
    }
    const source = new Source(opts)

    it('`setStatus` updates status field and emits event', () => {
      source.setStatus('FOO')
      expect(spy).toHaveBeenCalledWith('abstract_FOO_' + source.id, {data: undefined, type: 'FOO'})
    })

    it('`emit` translates event to inner emitter', () => {
      source.emit('BAR')
      expect(spy).toHaveBeenCalledWith('abstract_BAR_' + source.id, {data: undefined, type: 'BAR'})
    })

    it('`on` subscribes listener to event', () => {
      const fn = jest.fn(() => {})
      source.on('BAZ', fn)
      source.emit('BAZ')

      expect(fn).toHaveBeenCalledWith({data: undefined, type: 'BAZ'})
    })

    const cases = ['connect', 'get', 'has']

    cases.forEach(method => {
      it('`' + method + '` is not implemented', () => expect(() => source[method]())
        .toThrow('Abstract source: not implemented'))
    })
  })

  describe('static', () => {
    describe('finalize', () => {
      const emitter = new EventEmitter()
      const cases = [
        ['fn succeeds', () => {}, READY],
        ['fn fails', () => { throw new Error() }, FAILURE],
        ['promise resolved', new Promise((resolve) => resolve()), READY],
        ['promise rejected', new Promise((resolve, reject) => reject(new Error())), FAILURE]
      ]

      cases.forEach(([descr, expression, status]) => {
        it(descr, done => {
          const source = new Source({emitter})
          const res = AbstractSource.finalize(source, expression)
          const check = () => {
            expect(source.status).toBe(status)
            done()
          }

          if (typeof expression === 'function') {
            check()
          } else {
            res.then(check)
          }
        })
      })
    })

    describe('assertReady', () => {
      const emitter = new EventEmitter()
      const source = new Source({emitter})

      it('does nothing if `ready`', () => {
        source.status = READY
        expect(AbstractSource.assertReady(source)).toBeUndefined()
      })

      it('throws error otherwise', () => {
        source.status = FAILURE
        expect(() => AbstractSource.assertReady(source)).toThrow('Invalid source status: ' + FAILURE)
      })
    })
  })
})
