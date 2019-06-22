import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  SYNC,
  ASYNC
} from '@qiwi/uniconfig-core'
import rootPlugin from '../../main/ts'
import * as path from 'path'

const name = rootPlugin.name

describe('plugin-root', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(rootPlugin)

    expect(name).toBe('root')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('gets app root path', () => {
    const expected = path.resolve(__dirname, '../../../../..')

    it('sync', () => {
      const config = new Config({mode: SYNC, pipeline: name})
      expect(config.get()).toBe(expected)
    })

    it('async', async () => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then((config: Config) => config.get())).resolves.toBe(expected)
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(rootPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
