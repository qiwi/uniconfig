import * as path from 'path'
import {createContext, Config, rollupPlugin, rollbackPlugin, SYNC} from '../../../../uniconfig-core'
import {pipe as datatreePipe} from '../../../../uniconfig-plugin-datatree'
import {pipe as filePipe} from '../../../../uniconfig-plugin-api-file'
import jsonPlugin from '../../main/ts'

describe('plugin-json', () => {
  const context = createContext()

  beforeAll(() => {
    context.pipe.add('file', filePipe)
    context.pipe.add('datatree', datatreePipe)
  })

  afterAll(context.pipe.flush)

  it('properly registers self', () => {
    rollupPlugin(jsonPlugin, context)
    expect(context.pipe.get('json')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const target = path.resolve(__dirname, './foobar.json')
    const config = new Config({
      data: {
        data: {
          baz: '$fromJson:foo',
        },
        sources: {
          'fromJson': {
            data: target,
            pipeline: 'file>json',
          },
        }
      },
      mode: SYNC,
      pipeline: 'datatree',
      context
    })

    expect(config.get('baz')).toBe('bar')
  })

  it('supports rollback', () => {
    rollbackPlugin(jsonPlugin, context)

    expect(context.pipe.get('json')).toBeUndefined()
  })
})
