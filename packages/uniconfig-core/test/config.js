import path from 'path'
import {Config, SYNC, ASYNC, DEFAULT_OPTS} from '../src'
import {Config as _Config, context as _context} from '@qiwi/uniconfig-core'
import {pipe as filePipe} from '@qiwi/uniconfig-plugin-api-file'
import {pipe as jsonPipe} from '@qiwi/uniconfig-plugin-json'
import {pipe as datatreePipe} from '@qiwi/uniconfig-plugin-datatree'
import {MISSED_VALUE_PATH} from '../src/base/error'
import EventEmitterPolyfill from '../src/event/polyfill'

describe('Config', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts = {foo: 'bar'}
      const cfg = new Config('path', opts)

      expect(cfg).toBeInstanceOf(Config)
      expect(cfg.opts).toEqual({...opts, ...DEFAULT_OPTS})
      expect(cfg.id).toEqual(expect.stringMatching(/^\d\.\d+$/))
      expect(cfg.emitter).not.toBeUndefined()
    })

    it('uses default preset if `opt` param is empty', () => {
      const cfg = new Config('path')

      expect(cfg.opts).toEqual(DEFAULT_OPTS)
    })

    it('passes emitter from opts if specified', () => {
      const emitter = {emit: () => {}}
      const cfg = new Config('path', {emitter})

      expect(cfg.emitter).toEqual(emitter)
    })
  })

  describe('pipeline', () => {
    beforeAll(() => {
      _context.pipe.add('file', filePipe)
      _context.pipe.add('json', jsonPipe)
      _context.pipe.add('datatree', datatreePipe)
    })

    afterAll(() => {
      _context.pipe.flush()
    })

    const target = path.resolve(__dirname, './stub/foobar.json')
    const input = {
      data: {
        someParam: '$fromFile:foo'
      },
      sources: {
        fromFile: {
          data: target,
          pipeline: 'file>json'
        }
      }
    }

    it('sync', () => {
      const mode = SYNC
      const opts = {mode, pipeline: 'datatree'}
      const config = new _Config(input, opts)

      expect(config.get('someParam')).toBe('bar')
    })

    it('async', done => {
      const mode = ASYNC
      const opts = {mode, pipeline: 'datatree'}
      const config = new _Config(input, opts)

      config.on('CONFIG_READY', () => {
        expect(config.get('someParam')).toBe('bar')
        done()
      })
    })

    it('processes config with no sources', () => {
      const opts = {mode: SYNC, pipeline: 'datatree'}
      const input = {
        prolog: {
          version: '0.0.1'
        },
        data: {
          foo: 'bar'
        }
      }
      const config = new _Config(input, opts)

      expect(config.get('foo')).toBe('bar')
    })
  })

  describe('proto', () => {
    describe('get', () => {
      const cfg = new Config('path', {})
      cfg.data = {
        foo: {
          bar: 'baz'
        },
        qux: 1,
        udf: undefined
      }

      it('extracts value by full path', () => {
        expect(cfg.get('foo.bar')).toBe('baz')
      })

      it('extracts value by path prefix', () => {
        expect(cfg.get('foo')).toEqual({bar: 'baz'})
      })

      it('returns undefined if value is undefined', () => {
        expect(cfg.get('udf')).toBeUndefined()
      })

      it('returns undefined if not found', () => {
        expect(cfg.get('unknown')).toBeUndefined()
      })

      it('throws exception if not found and `tolerateMissed = false`', () => {
        const cfg = new Config('path', {tolerateMissed: false})

        expect(() => cfg.get('unknown')).toThrow(MISSED_VALUE_PATH)
      })
    })

    describe('has', () => {
      const cfg = new Config('path')
      cfg.data = {
        foo: {
          bar: 'baz'
        },
        qux: 1,
        udf: undefined
      }

      it('returns true if path exists in config data', () => {
        expect(cfg.has('foo.bar')).toBeTruthy()
        expect(cfg.has('foo')).toBeTruthy()
        expect(cfg.has('udf')).toBeTruthy()
      })

      it('returns false otherwise', () => {
        expect(cfg.has('unknown')).toBeFalsy()
      })
    })

    describe('emitter api', () => {
      const handler = jest.fn(() => {})
      const emitter = new EventEmitterPolyfill()
      const cfg = new Config('path', {emitter})
      const event = 'foo' + cfg.id

      describe('on', () => {
        it('registers new event handler', () => {
          expect(cfg.on('foo', handler)).toBe(cfg)
          expect(cfg.emitter.events).toEqual({[event]: [handler]})
        })
      })

      describe('emit', () => {
        it('triggers chain of responsibility', () => {
          expect(cfg.emit('foo', 'foo')).toBeTruthy()
          expect(cfg.emit('bar')).toBeFalsy()

          expect(handler).toHaveBeenCalledWith({type: 'foo', data: 'foo'})
        })
      })

      describe('off', () => {
        it('excludes handler from chain', () => {
          expect(cfg.off('foo', handler)).toBe(cfg)
          expect(cfg.emitter.events).toEqual({[event]: []})
        })
      })
    })
  })
})
