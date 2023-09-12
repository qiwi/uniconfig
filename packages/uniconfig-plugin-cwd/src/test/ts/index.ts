import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import cwdPlugin from '../../main/ts'

const name = cwdPlugin.name

describe('plugin-cwd', () => {
  afterAll(() => context.pipe.flush())

  it('properly registers self', () => {
    rollupPlugin(cwdPlugin)

    expect(name).toBe('cwd')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('returns process.cwd()', () => {
    it('sync', () => {
      const config = new Config({mode: SYNC, pipeline: name})
      expect(config.get()).toEqual(process.cwd())
    })

    it('async', async() => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then((config: Config) => config.get())).resolves.toEqual(process.cwd())
    })

  })

  it('supports rollback', () => {
    rollbackPlugin(cwdPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
