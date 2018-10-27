import {context, Config, rollupPlugin, rollbackPlugin, SYNC} from '@qiwi/uniconfig-core'
import ipPlugin from '../src'

describe('plugin-ip', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers self', () => {
    rollupPlugin(ipPlugin)

    expect(context.pipe.get('ip')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const config = new Config({mode: SYNC, pipeline: 'ip'})

    expect(config.get()).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
  })

  it('supports rollback', () => {
    rollbackPlugin(ipPlugin)

    expect(context.pipe.get('ip')).toBeUndefined()
  })
})
