import uniconfig, {Config} from '@qiwi/uniconfig'
import path from 'path'

describe('legacy-facade', () => {
  describe('factory', () => {
    it('produces new Config instance', () => {
      const opts = {}
      const target = 'foo'
      const config = uniconfig(target, opts)

      expect(config).toBeInstanceOf(Config)
    })
  })

  it('presets `json`, `file` and `datatree` plugins', () => {
    const target = path.resolve(__dirname, './foobar.json')
    const input = {
      data: {
        someParam: '$fromFile:foo'
      },
      sources: {
        fromFile: {
          data: target,
          pipeline: 'file>json'
        }
      }
    }
    const mode = 'sync'
    const opts = {mode, pipeline: 'datatree'}
    const config = new Config(input, opts)

    expect(config.get('someParam')).toBe('bar')
  })
})