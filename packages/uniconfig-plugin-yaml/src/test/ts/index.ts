import * as path from 'path'
import {createContext, Config, rollupPlugin, rollbackPlugin, SYNC} from '@qiwi/uniconfig-core'
import {pipe as datatreePipe} from '@qiwi/uniconfig-plugin-datatree'
import {pipe as filePipe} from '@qiwi/uniconfig-plugin-api-file'
import yamlPlugin from '../../main/ts'

describe('plugin-yaml', () => {
  const context = createContext()
  beforeAll(() => {
    rollupPlugin(datatreePipe, context)
    rollupPlugin(filePipe, context)
  })

  afterAll(() => context.pipe.flush())

  it('properly registers self', () => {
    rollupPlugin(yamlPlugin, context)
    expect(context.pipe.get('yaml')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const target = path.resolve(__dirname, './foobar.yml')
    const config = new Config({
      data: {
        data: {
          baz: '$fromYaml:foo',
        },
        sources: {
          'fromYaml': {
            data: target,
            pipeline: 'file>yaml',
          },
        },
      },
      mode: SYNC,
      pipeline: 'datatree',
      context,
    })

    expect(config.get('baz')).toBe('bar')
  })

  it('supports rollback', () => {
    rollbackPlugin(yamlPlugin, context)

    expect(context.pipe.get('yaml')).toBeUndefined()
  })
})
