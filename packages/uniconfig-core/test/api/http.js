import http from '../../src/api/http'

describe('api/http', () => {
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
      expect(http.readSync(target)).toEqual(JSON.stringify(expectedData))
    })

    it('gets err as result', () => {
      expect(() => http.readSync('wtf://example.com')).toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(http.read(target)).resolves.toEqual(JSON.stringify(expectedData))
    })

    it('rejects promise with err', () => {
      return expect(http.read('wtf://example.com')).rejects.toThrow('The protocol "wtf" is not supported, cannot load "wtf://example.com"')
    })
  })
})
