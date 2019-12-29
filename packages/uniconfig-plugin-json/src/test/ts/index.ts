import * as path from 'path'
import {context, Config, rollupPlugin, rollbackPlugin, SYNC} from '@qiwi/uniconfig-core'
import {pipe as datatreePipe} from '@qiwi/uniconfig-plugin-datatree'
import {pipe as filePipe} from '@qiwi/uniconfig-plugin-api-file'
import jsonPlugin, {pipe as jsonPipe} from '../../main/ts'

describe('plugin-json', () => {
  beforeAll(() => {
    context.pipe.add('file', filePipe)
    context.pipe.add('json', jsonPipe)
    context.pipe.add('datatree', datatreePipe)
  })

  afterAll(context.pipe.flush)

  it('properly registers self', () => {
    rollupPlugin(jsonPlugin)
    expect(context.pipe.get('json')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const target = path.resolve(__dirname, './foobar.json')
    const config = new Config({
      data: {
        baz: '$fromJson:foo',
      },
      sources: {
        'fromJson': {
          data: target,
          pipeline: 'file>json',
        },
      },
    }, {mode: SYNC, pipeline: 'datatree'})

    expect(config.get('baz')).toBe('bar')
  })

  it('supports rollback', () => {
    rollbackPlugin(jsonPlugin)

    expect(context.pipe.get('json')).toBeUndefined()
  })
})
