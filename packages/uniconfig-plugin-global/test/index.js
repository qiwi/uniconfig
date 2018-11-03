import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import globalPlugin from '../src'

const name = globalPlugin.name

describe('plugin-yaml', () => {
  beforeAll(() => {
    global.FOO = 'bar'
  })

  afterAll(() => {
    context.pipe.flush()
    delete global.FOO
  })

  it('properly registers self', () => {
    rollupPlugin(globalPlugin)

    expect(name).toBe('global')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('fetches global vars', () => {
    it('sync', () => {
      const config = new Config({}, {mode: SYNC, pipeline: name})

      expect(config.get('FOO')).toBe('bar')
    })

    it('async', () => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then(config => config.get('FOO'))).resolves.toBe('bar')
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(globalPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
