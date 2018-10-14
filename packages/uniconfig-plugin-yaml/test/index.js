import path from 'path'
import parser from '../dist/es6'
import {api as fileApi} from '@qiwi/uniconfig-plugin-api-file'
import {SYNC} from '../../uniconfig-core/src/source/source'
import Config, {rollupPlugin, rollbackPlugin} from '../../uniconfig-core/src'
import parserRegistry from '../../uniconfig-core/src/parser/parserRegistry'
import apiRegistry from '../../uniconfig-core/src/api/apiRegistry'

describe('plugin-yaml', () => {
  beforeAll(() => {
    apiRegistry.add('file', fileApi)
  })

  afterAll(() => {
    apiRegistry.flush()
    parserRegistry.flush()
  })

  it('properly registers self', () => {
    rollupPlugin(parser)

    expect(parserRegistry.get('yaml')).not.toBeUndefined()
  })

  it('processes config source data', () => {
    const target = path.resolve(__dirname, './foobar.yml')
    const config = new Config({
      data: {
        baz: '$fromYaml:foo'
      },
      source: {
        'fromYaml': {target, parser: 'yaml', api: 'file'}
      }
    }, {mode: SYNC})

    expect(config.get('baz')).toBe('bar')
  })

  it('supports rollback', () => {
    rollbackPlugin(parser)

    expect(parserRegistry.get('yaml')).toBeUndefined()
  })
})
