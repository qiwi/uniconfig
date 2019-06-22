import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  SYNC,
  ASYNC,
} from '@qiwi/uniconfig-core'
import dotPlugin from '../../main/ts'

describe('plugin-dot', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(dotPlugin)

    expect(context.pipe.get('dot')).not.toBeUndefined()
  })

  describe('processes data', () => {
    const opt = {
      data: {
        template: '{{=it.foo}}-bar-{{=it.baz}}',
        data: {
          foo: 'FOO',
          baz: 'BAZ',
        },
      },
      pipeline: 'dot',
    }

    it('sync', () => {
      const config = new Config({
        ...opt,
        mode: SYNC,
      })
      expect(config.get()).toBe('FOO-bar-BAZ')
    })

    it('async', async() => {
      const config = new Config({
        ...opt,
        mode: ASYNC,
      })
      return expect(config.ready.then((config: Config) => config.get())).resolves.toBe('FOO-bar-BAZ')
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(dotPlugin)

    expect(context.pipe.get('dot')).toBeUndefined()
  })
})
