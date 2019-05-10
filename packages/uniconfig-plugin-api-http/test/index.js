import httpPlugin, {pipe as httpPipe} from '../src'
import {context, Config, rollupPlugin, rollbackPlugin, ASYNC, SYNC} from '@qiwi/uniconfig-core'
import {pipe as datatreePipe} from '@qiwi/uniconfig-plugin-datatree'
import {pipe as jsonPipe} from '@qiwi/uniconfig-plugin-json'

describe('uniconfig-plugin-api-http', () => {
  const target = 'https://reqres.in/api/users/2'
  const expectedData = {
    data: {
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
    }
  }

  describe('#handleSync', () => {
    it('gets data as string', () => {
      expect(httpPipe.handleSync(target)).toEqual(JSON.stringify(expectedData))
    })

    it('supports req opts', () => {
      expect(httpPipe.handleSync({
        url: target,
        method: 'GET'
      })).toEqual(JSON.stringify(expectedData))
    })

    it('gets err as result', () => {
      expect(() => httpPipe.handleSync('wtf://example.com')).toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('#handle', () => {
    it('resolves promise with string', () => {
      return expect(httpPipe.handle(target)).resolves.toEqual(JSON.stringify(expectedData))
    })

    it('rejects promise with err', () => {
      return expect(httpPipe.handle('wtf://example.com')).rejects.toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('integration', () => {
    beforeAll(() => {
      context.pipe.add('json', jsonPipe)
      context.pipe.add('datatree', datatreePipe)
      rollupPlugin(httpPlugin)
    })

    afterAll(() => {
      context.pipe.flush()
    })

    const input = {
      data: {
        someParam: '$fromWeb:data.first_name'
      },
      sources: {
        fromWeb: {
          data: target,
          pipeline: 'http>json'
        }
      }
    }

    it('sync', () => {
      const mode = SYNC
      const opts = {mode, pipeline: 'datatree'}
      const config = new Config(input, opts)

      expect(config.get('someParam')).toBe('Janet')
    })

    it('async', done => {
      const mode = ASYNC
      const opts = {mode, pipeline: 'datatree'}
      const config = new Config(input, opts)

      config.on('CONFIG_READY', () => {
        expect(config.get('someParam')).toBe('Janet')
        done()
      })
    })
  })
})
