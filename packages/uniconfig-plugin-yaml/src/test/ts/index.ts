import * as path from 'path'
import {context, Config, rollupPlugin, rollbackPlugin, SYNC} from '@qiwi/uniconfig-core'
import datatreePipe from '@qiwi/uniconfig-plugin-datatree'
import filePipe from '@qiwi/uniconfig-plugin-api-file'
import yamlPlugin from '../../main/ts'

describe('plugin-yaml', () => {
  beforeAll(() => {
    rollupPlugin(datatreePipe)
    rollupPlugin(filePipe)
  })

  afterAll(() => context.pipe.flush())

  it('properly registers self', () => {
    rollupPlugin(yamlPlugin)
    expect(context.pipe.get('yaml')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const target = path.resolve(__dirname, './foobar.yml')
    const config = new Config({
      data: {
        baz: '$fromYaml:foo',
      },
      sources: {
        'fromYaml': {
          data: target,
          pipeline: 'file>yaml',
        },
      },
    }, {mode: SYNC, pipeline: 'datatree'})

    expect(config.get('baz')).toBe('bar')
  })

  it('supports rollback', () => {
    rollbackPlugin(yamlPlugin)

    expect(context.pipe.get('yaml')).toBeUndefined()
  })
})
