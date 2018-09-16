import path from 'path'
import Source from '../../src/source/source'
import EventEmitter from 'events'
import AbstractSource, { ASYNC, FAILURE, INITIAL, READY, SYNC } from '../../src/source/abstract'
import apiRegistry from '../../src/api/apiRegistry'
import parserRegistry from '../../src/parser/parserRegistry'
import file from '../../src/api/file'
import json from '../../src/parser/json'

const FOOBAR = path.resolve(__dirname, '../stub/foobar.json')

describe('source', () => {
  beforeAll(() => {
    apiRegistry.add('file', file)
    parserRegistry.add('json', json)
  })

  afterAll(() => {
    apiRegistry.flush()
    parserRegistry.flush()
  })

  describe('constructor', () => {
    it('returns proper instance', () => {
      const emitter = new EventEmitter()
      const target = 'foo'
      const api = 'file'
      const parser = 'json'
      const opts = { emitter, target, api, parser }
      const source = new Source(opts)

      expect(source).toBeInstanceOf(Source)
      expect(source.status).toBe(INITIAL)
      expect(source.id).toEqual(expect.any(String))
      expect(source.type).toBe(api + '-' + parser)
      expect(source.target).toBe(target)
      expect(source.opts).toBe(opts)
      expect(source.emitter).toBe(emitter)
    })
  })

  describe('proto', () => {
    const emitter = new EventEmitter()
    const target = FOOBAR
    const parser = 'json'
    const api = 'file'

    describe('connect', () => {
      it('fetches file synchronously', () => {
        const source = new Source({ emitter, target, parser, api, mode: SYNC })

        expect(source.connect()).toBe(source)
        expect(source.data).toEqual({ foo: 'bar' })
        expect(source.status).toBe(READY)
      })

      it('fetches file asynchronously', done => {
        const source = new Source({ emitter, target, parser, api, mode: ASYNC })
        expect(source.connect()).toBe(source)

        source.on(READY, () => {
          expect(source.data).toEqual({ foo: 'bar' })
          expect(source.status).toBe(READY)
          done()
        })
      })

      it('switches status to failed on any error', () => {
        const source = new Source({ emitter, target: null, mode: SYNC, parser, api })
        source.connect()

        expect(source.status).toBe(FAILURE)
      })
    })

    describe('getters', () => {
      let source

      beforeAll(() => {
        source = new Source({ emitter, target, mode: SYNC, parser, api })
        source.data = { foo: 'bar' }
      })

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

        it('returns undefined otherwise', () => {
          source.status = READY
          expect(source.get('baz')).toBeUndefined()
        })
      })
    })
  })
})
