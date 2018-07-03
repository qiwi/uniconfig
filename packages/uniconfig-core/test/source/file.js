import path from 'path'
import {FileSource, AbstractSource} from '../../src/source'
import EventEmitter from 'events'
import {ASYNC, FAILURE, INITIAL, READY, SYNC} from '../../src/source/abstract'

const FOOBAR = path.resolve(__dirname, '../stub/foobar.json')

describe('source/file', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const target = 'foo'
      const emitter = new EventEmitter()
      const api = { encoding: 'utf' }
      const opts = {emitter, target, api}
      const source = new FileSource(opts)

      expect(source).toBeInstanceOf(AbstractSource)
      expect(source.status).toBe(INITIAL)
      expect(source.type).toBe('file')
      expect(source.id).toEqual(expect.any(String))
      expect(source.target).toBe(target)
      expect(source.opts).toBe(opts)
      expect(source.emitter).toBe(emitter)
    })
  })

  describe('proto', () => {
    describe('inherited from AbstractSource', () => {
      const cases = ['open', 'emit', 'on', 'setStatus']

      cases.forEach(method => {
        it(method, () => {
          expect(FileSource.prototype[method]).toBe(AbstractSource.prototype[method])
        })
      })
    })

    const emitter = new EventEmitter()
    const target = FOOBAR

    describe('connect', () => {
      it('fetches file synchronously', () => {
        const source = new FileSource({emitter, target, mode: SYNC})

        expect(source.connect()).toBe(source)
        expect(source.data).toEqual({foo: 'bar'})
        expect(source.status).toBe(READY)
      })

      it('fetches file asynchronously', done => {
        const source = new FileSource({emitter, target, mode: ASYNC})
        expect(source.connect()).toBe(source)

        source.on(READY, () => {
          expect(source.data).toEqual({foo: 'bar'})
          expect(source.status).toBe(READY)
          done()
        })
      })

      it('switches status to failed on any error', () => {
        const source = new FileSource({emitter, target: null, mode: SYNC})
        source.connect()

        expect(source.status).toBe(FAILURE)
      })
    })

    describe('getters', () => {
      const source = new FileSource({emitter, target, mode: SYNC})
      source.data = {foo: 'bar'}

      describe('has', () => {
        it('asserts status', () => {
          source.status = INITIAL
          expect(() => source.has('foo')).toThrow('Invalid source status: initial')
        })

        it('returns value if path exists', () => {
          source.status = READY
          expect(source.has('foo')).toBeTruthy()
        })

        it('returns false otherwise', () => {
          source.status = READY
          expect(source.has('baz')).toBeFalsy()
        })
      })

      describe('get', () => {
        it('asserts status', () => {
          source.status = FAILURE
          expect(() => source.get('foo')).toThrow('Invalid source status: failure')
        })

        it('returns value if path exists', () => {
          source.status = READY
          expect(source.get('foo')).toBe('bar')
        })

        it('returns undefined ithrwise', () => {
          source.status = READY
          expect(source.get('baz')).toBeUndefined()
        })
      })
    })
  })
})
