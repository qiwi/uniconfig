import plugin, {api} from '../src'
import path from 'path'
import {ASYNC, SYNC} from '@qiwi/uniconfig-core/src/source/source'
import {Config, rollupPlugin, rollbackPlugin} from '@qiwi/uniconfig-core/src'

describe('uniconfig-plugin-api-file', () => {
  const target = path.resolve(__dirname, './foobar.json')

  describe('#readSync', () => {
    it('gets file data as string', () => {
      expect(api.readSync(target)).toEqual(JSON.stringify({ foo: 'bar' }))
    })

    it('gets err as result', () => {
      expect(() => api.readSync('bazqux')).toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(api.read(target)).resolves.toEqual(JSON.stringify({ foo: 'bar' }))
    })

    it('rejects promise with err', () => {
      return expect(api.read('bazqux')).rejects.toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('integration', () => {
    beforeAll(() => {
      rollupPlugin(plugin)
    })

    afterAll(() => {
      rollbackPlugin(plugin)
    })

    const input = {
      data: {
        someParam: '$fromFile:'
      },
      source: {
        fromFile: {
          target,
          api: 'file'
        }
      }
    }

    it('sync', () => {
      const mode = SYNC
      const opts = {mode}
      const config = new Config(input, opts)

      expect(config.context.source.get('fromFile').get()).toBe('{"foo":"bar"}')
      expect(config.get('someParam')).toBe('{"foo":"bar"}')
    })

    it('async', done => {
      const mode = ASYNC
      const opts = {mode}
      const config = new Config(input, opts)

      config.on('CONFIG_READY', () => {
        expect(config.context.source.get('fromFile').get()).toBe('{"foo":"bar"}')
        expect(config.get('someParam')).toBe('{"foo":"bar"}')
        done()
      })
    })
  })
})