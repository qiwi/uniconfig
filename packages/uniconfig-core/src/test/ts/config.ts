import {resolve} from 'path'
import {
  Config,
  SYNC,
  ASYNC,
  DEFAULT_OPTS,
  IConfigLegacyOpts,
  createContext,
} from '../../main/ts'
import EventEmitter from '../../main/ts/event/polyfill'
import {pipe as filePipe} from '../../../../uniconfig-plugin-api-file/src/main/ts'
import {pipe as jsonPipe} from '../../../../uniconfig-plugin-json/src/main/ts'
import {pipe as datatreePipe} from '../../../../uniconfig-plugin-datatree/src/main/ts'
import {pipe as dotPipe} from '../../../../uniconfig-plugin-dot/src/main/ts'
import {pipe as pathPipe} from '../../../../uniconfig-plugin-path/src/main/ts'
import {pipe as envPipe} from '../../../../uniconfig-plugin-env/src/main/ts'
import {MISSED_VALUE_PATH} from '../../main/ts/base/error'

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
  describe('static', () => {
    describe('processInjects', () => {
      it('injects data to input', () => {
        const input = {
          foo: '$$1$$',
          bar: '$$2$$',
          BAR: '$$2$$$$2$$',
          baz: '$$3$$',
          qux: '$$qux$$',
          quux: '$$quux$$',
        }
        const injects = {
          injectFoo: {
            from: '$$1$$',
            to: 'foo',
          },
          injectBar: {
            from: /\$\$2\$\$/g,
            to: 'bar',
          },
          injectBaz: {
            from: '$$3$$',
            to: {
              a: {
                b: {
                  c: 'd',
                },
              },
            },
          },
          '$$qux$$': 'qux',
          '$$quux$$': {
            q: {
              uu: 'x',
            },
          },
        }

        expect(Config.processInjects(input, injects)).toEqual({
          foo: 'foo',
          bar: 'bar',
          BAR: 'barbar',
          baz: {
            a: {
              b: {
                c: 'd',
              },
            },
          },
          qux: 'qux',
          quux: {
            q: {
              uu: 'x',
            },
          },
        })
      })

      it('returns value as is if no inject declared', () => {
        const input = {}
        expect(Config.processInjects(input)).toBe(input)
      })
    })
  })

  describe('pipeline', () => {
    const context = createContext()
    context.pipe.add('file', filePipe)
    context.pipe.add('json', jsonPipe)
    context.pipe.add('dot', dotPipe)
    context.pipe.add('path', pathPipe)
    context.pipe.add('env', envPipe)
    context.pipe.add('datatree', datatreePipe)

    const target = resolve(__dirname, '../stub/foobar.json')
    const input = {
      data: {
        someParam: '$fromFile:foo',
      },
      sources: {
        fromFile: {
          data: target,
          pipeline: 'file>json',
        },
      },
    }

    it('sync', () => {
      const mode = SYNC
      const opts = {mode, context, pipeline: 'datatree', data: input}
      const config = new Config(opts)

      expect(config.get('someParam')).toBe('bar')
    })

    it('async', done => {
      const mode = ASYNC
      const opts = {mode, context, pipeline: 'datatree', data: input}
      const config = new Config(opts)

      config.on('CONFIG_READY', () => {
        expect(config.get('someParam')).toBe('bar')
        done()
      })
    })

    it('promises to be ready', () => {
      const mode = ASYNC
      const opts = {mode, context, data: {foo: 'bar'}}
      const config = new Config(opts)

      return expect(config.ready.then((config: Config) => config.get('foo'))).resolves.toBe('bar')
    })

    it('processes config with no sources', () => {
      const input = {
        prolog: {
          version: '0.0.1',
        },
        data: {
          foo: 'bar',
        },
      }
      const opts = {mode: SYNC, context, pipeline: 'datatree', data: input}
      const config = new Config(opts)

      expect(config.get('foo')).toBe('bar')
    })

    it('obtains target config by env variable and resolves its data', () => {
      const opts = {
        mode: SYNC,
        context,
        data: {
          data: {
            data: {
              target: "$env:BAZ",
            },
            template: "<root>/packages/uniconfig-core/src/test/stub/{{=it.target}}.json",
          },
          sources: {
            env: {
              pipeline: "env",
            },
          },
        },
        pipeline: 'datatree>dot>path>file>json>datatree',
      }
      const config = new Config(opts)

      expect(config.get()).toEqual({someParam: 'c'})
    })
  })

  describe('proto', () => {
    describe('get', () => {
      const cfg = new Config('path', {})
      cfg.data = {
        foo: {
          bar: 'baz',
        },
        qux: 1,
        udf: undefined,
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
          bar: 'baz',
        },
        qux: 1,
        udf: undefined,
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
      const emitter = new EventEmitter()
      const cfg = new Config('path', {emitter})
      const event = 'foo' + cfg.id

      describe('on', () => {
        it('registers new event handler', () => {
          expect(cfg.on('foo', handler)).toBe(cfg)
          // @ts-ignore
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
          // @ts-ignore
          expect(cfg.emitter.events).toEqual({[event]: []})
        })
      })
    })
  })
})
