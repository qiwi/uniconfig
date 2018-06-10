import Config, {DEFAULT_OPTS} from '../src/config'
import {MISSED_VALUE_PATH} from '../src/error'

describe('Config', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts = {foo: 'bar'}
      const cfg = new Config('path', opts)

      expect(cfg).toBeInstanceOf(Config)
      expect(cfg.opts).toEqual({...opts, ...DEFAULT_OPTS})
    })

    it('uses default preset if `opt` param is empty', () => {
      const cfg = new Config('path')

      expect(cfg.opts).toEqual(DEFAULT_OPTS)
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
      const cfg = new Config('path', {})
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
  })
})
