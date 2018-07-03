import uniconfig from '../src'
import Config from '../src/config'

describe('facade', () => {
  describe('factory', () => {
    it('produces new Config instance', () => {
      const opts = {}
      const target = 'foo'
      const config = uniconfig(target, opts)

      expect(config).toBeInstanceOf(Config)
    })
  })
})
