import plugin, {api} from '../src'
import {ASYNC, SYNC} from '@qiwi/uniconfig-core/src/source/source'
import jsonApiPlugin from '@qiwi/uniconfig-plugin-json'
import {Config, rollupPlugin, rollbackPlugin} from '@qiwi/uniconfig-core/src'

describe('uniconfig-plugin-api-http', () => {
  const target = 'https://reqres.in/api/users/2'
  const expectedData = {
    data: {
      id: 2,
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
    }
  }

  describe('#readSync', () => {
    it('gets data as string', () => {
      expect(api.readSync(target)).toEqual(JSON.stringify(expectedData))
    })

    it('gets err as result', () => {
      expect(() => api.readSync('wtf://example.com')).toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(api.read(target)).resolves.toEqual(JSON.stringify(expectedData))
    })

    it('rejects promise with err', () => {
      return expect(api.read('wtf://example.com')).rejects.toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('integration', () => {
    beforeAll(() => {
      rollupPlugin(plugin)
      rollupPlugin(jsonApiPlugin)
    })

    afterAll(() => {
      rollbackPlugin(plugin)
      rollbackPlugin(jsonApiPlugin)
    })

    const input = {
      data: {
        someParam: '$fromWeb:data.first_name'
      },
      source: {
        fromWeb: {
          target,
          api: 'http',
          parser: 'json'
        }
      }
    }

    it('sync', () => {
      const mode = SYNC
      const opts = {mode}
      const config = new Config(input, opts)

      expect(config.context.source.get('fromWeb').get('data.first_name')).toBe('Janet')
      expect(config.get('someParam')).toBe('Janet')
    })

    it('async', done => {
      const mode = ASYNC
      const opts = {mode}
      const config = new Config(input, opts)

      config.on('CONFIG_READY', () => {
        expect(config.context.source.get('fromWeb').get('data.first_name')).toBe('Janet')
        expect(config.get('someParam')).toBe('Janet')
        done()
      })
    })
  })
})