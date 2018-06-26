import file from '../../src/api/file'
import path from 'path'

xdescribe('loader/file', () => {
  const dst = path.resolve(__dirname, '../stub/foobar.json')

  describe('#sync', () => {
    it('gets file data as string', () => {
      expect(file.sync(dst)).toEqual(JSON.stringify({foo: 'bar'}))
    })

    it('gets err as result', () => {
      expect(() => file.sync('bazqux')).toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('#async', () => {
    it('resolves promise with string', () => {
      return expect(file.async(dst)).resolves.toEqual(JSON.stringify({foo: 'bar'}))
    })

    it('rejects promise with err', () => {
      return expect(file.async('bazqux')).rejects.toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })
})
