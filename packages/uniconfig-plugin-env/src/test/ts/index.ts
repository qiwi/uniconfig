import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  SYNC,
} from '@qiwi/uniconfig-core'
import envPlugin from '../../main/ts'

describe('plugin-env', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers self', () => {
    rollupPlugin(envPlugin)

    expect(context.pipe.get('env')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const config = new Config({}, {mode: SYNC, pipeline: 'env'})

    expect(config.get('NODE_ENV')).toBe('test')
  })

  it('supports rollback', () => {
    rollbackPlugin(envPlugin)

    expect(context.pipe.get('env')).toBeUndefined()
  })
})
