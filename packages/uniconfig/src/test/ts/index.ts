import uniconfig, {Config, getPipes} from '@qiwi/uniconfig'
import * as path from 'path'

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
        someParam: '$fromFile:foo',
      },
      sources: {
        fromFile: {
          data: target,
          pipeline: 'file>json',
        },
      },
    }
    const mode: 'sync' = 'sync'
    const opts = {mode, pipeline: 'datatree'}
    const config = new Config(input, opts)

    expect(config.get('someParam')).toBe('bar')
  })

  it('registers all plugins at once', () => {
    expect(getPipes()).toEqual([
      'ajv',
      'file',
      'http',
      'argv',
      'datatree',
      'dot',
      'dotenv',
      'env',
      'global',
      'ip',
      'json',
      'path',
      'root',
      'pkg',
      'yaml',
    ])
  })
})
