import file from '../../src/api/file'
import path from 'path'

describe('loader/file', () => {
  const dst = path.resolve(__dirname, '../stub/foobar.json')

  describe('#readSync', () => {
    it('gets file data as string', () => {
      expect(file.readSync(dst)).toEqual(JSON.stringify({ foo: 'bar' }))
    })

    it('gets err as result', () => {
      expect(() => file.readSync('bazqux')).toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(file.read(dst)).resolves.toEqual(JSON.stringify({ foo: 'bar' }))
    })

    it('rejects promise with err', () => {
      return expect(file.read('bazqux')).rejects.toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })
})
