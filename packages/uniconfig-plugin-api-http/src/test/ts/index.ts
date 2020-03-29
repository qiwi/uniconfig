import {pipe as httpPipe} from '../../main/ts'
import {context} from '@qiwi/uniconfig-core'
import {pick} from 'lodash'

describe('uniconfig-plugin-api-http', () => {
  const removeAd = (body: string) => JSON.stringify(pick(JSON.parse(body), 'data'))
  const target = 'https://reqres.in/api/users/2'
  const expectedData = {
    data: {
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg',
    },
  }

  describe('#handleSync', () => {
    it('gets data as string', () => {
      expect(removeAd(httpPipe.handleSync(context, target))).toBe(JSON.stringify(expectedData))
    })

    it('supports req opts', () => {
      expect(removeAd(httpPipe.handleSync(context,{
        url: target,
        method: 'GET',
      }))).toBe(JSON.stringify(expectedData))
    })

    it('gets err as result', () => {
      expect(() => httpPipe.handleSync(context,'wtf://example.com')).toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('#handle', () => {
    it('resolves promise with string', () => {
      return expect(httpPipe.handle(context, target).then(removeAd)).resolves.toBe(JSON.stringify(expectedData))
    })

    it('rejects promise with err', () => {
      return expect(httpPipe.handle(context, 'wtf://example.com')).rejects.toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })
})
