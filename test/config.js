import Config, {DEFAULT_OPTS} from '../src/config'

describe('Config', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const opts = {foo: 'bar'}
      const cfg = new Config('path', opts)

      expect(cfg).toBeInstanceOf(Config)
      expect(cfg.opts).toEqual({...opts, ...DEFAULT_OPTS})
    })
  })

  describe('proto', () => {
    expect()
  })
})
