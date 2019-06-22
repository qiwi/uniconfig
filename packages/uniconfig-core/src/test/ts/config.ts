//import path from 'path'
import {Config, SYNC, ASYNC, DEFAULT_OPTS} from '../../main/ts'
// import {Config as _Config, context as _context} from '@qiwi/uniconfig-core'
/*import {pipe as filePipe} from '@qiwi/uniconfig-plugin-api-file'
import {pipe as jsonPipe} from '@qiwi/uniconfig-plugin-json'
import {pipe as datatreePipe} from '@qiwi/uniconfig-plugin-datatree'
import {pipe as dotPipe} from '@qiwi/uniconfig-plugin-dot'
import {pipe as pathPipe} from '@qiwi/uniconfig-plugin-path'
import {pipe as envPipe} from '@qiwi/uniconfig-plugin-env'*/
//import {MISSED_VALUE_PATH} from '../../main/ts/base/error'
//import EventEmitterPolyfill from '../../main/ts/event/polyfill'
import {IConfigLegacyOpts} from "../../main/ts/interface";
import EventEmitter from "../../main/ts/event/polyfill";

describe('config-core', () => {
  it('exposes inner constants', () => {
    [SYNC, ASYNC, DEFAULT_OPTS].forEach(v => expect(v).not.toBeUndefined())
  })
})

describe('Config', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts: IConfigLegacyOpts = {tolerateMissed: true}
      const cfg = new Config('path', opts)

      expect(cfg).toBeInstanceOf(Config)
      expect(cfg.opts).toEqual({data: 'path', ...opts, ...DEFAULT_OPTS})
      expect(cfg.id).toEqual(expect.stringMatching(/^\d\.\d+$/))
      expect(cfg.emitter).not.toBeUndefined()
    })

    it('uses default preset if `opt` param is empty', () => {
      const cfg = new Config('path')

      expect(cfg.opts).toEqual({data: 'path', ...DEFAULT_OPTS})
    })

    it('passes emitter from opts if specified', () => {
      const emitter = new EventEmitter()
      const cfg = new Config('path', {emitter})

      expect(cfg.emitter).toEqual(emitter)
    })

    it('supports single argument configuration', () => {
      const data = {foo: 'bar'}
      const opts = {
        data,
        pipeline: '',
        mode: SYNC,
      }
      const cfg = new Config(opts)

      expect(cfg.opts).toEqual({...DEFAULT_OPTS, ...opts})
      expect(cfg.data).toBe(data)
    })
  })
/*
  describe('pipeline', () => {
    beforeAll(() => {
      _context.pipe.add('file', filePipe)
      _context.pipe.add('json', jsonPipe)
      _context.pipe.add('dot', dotPipe)
      _context.pipe.add('path', pathPipe)
      _context.pipe.add('env', envPipe)
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

    it('promises to be ready', () => {
      const mode = ASYNC
      const opts = {mode}
      const config = new Config({foo: 'bar'}, opts)

      return expect(config.ready.then((config: Config) => config.get('foo'))).resolves.toBe('bar')
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

    it('obtains target config by env variable and resolves its data', () => {
      const opts = {
        mode: SYNC,
        data: {
          data: {
            data: {
              target: "$env:BAZ"
            },
            template: "<root>/packages/uniconfig-core/test/stub/{{=it.target}}.json"
          },
          sources: {
            env: {
              pipeline: "env"
            }
          },
        },
        pipeline: 'datatree>dot>path>file>json>datatree'
      }
      const config = new _Config(opts)

      expect(config.get()).toEqual({someParam: 'c'})
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

  describe('static', () => {
    describe('processInjects', () => {
      it('injects data to input', () => {
        const input = {
          foo: '$$1$$',
          bar: '$$2$$',
          BAR: '$$2$$$$2$$',
          baz: '$$3$$',
          qux: '$$qux$$',
          quux: '$$quux$$'
        }
        const injects = {
          injectFoo: {
            from: '$$1$$',
            to: 'foo'
          },
          injectBar: {
            from: /\$\$2\$\$/g,
            to: 'bar'
          },
          injectBaz: {
            from: '$$3$$',
            to: {
              a: {
                b: {
                  c: 'd'
                }
              }
            }
          },
          '$$qux$$': 'qux',
          '$$quux$$': {
            q: {
              uu: 'x'
            }
          }
        }

        expect(Config.processInjects(input, injects)).toEqual({
          foo: 'foo',
          bar: 'bar',
          BAR: 'barbar',
          baz: {
            a: {
              b: {
                c: 'd'
              }
            }
          },
          qux: 'qux',
          quux: {
            q: {
              uu: 'x'
            }
          }
        })
      })

      it('returns value as is if no inject declared', () => {
        const input = {}
        expect(Config.processInjects(input)).toBe(input)
      })
    })
  })*/
})
