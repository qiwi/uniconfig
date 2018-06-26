import AbstractSource, {INITIAL} from '../../src/source/abstractSource'
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
})
