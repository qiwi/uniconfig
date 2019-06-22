import * as path from 'path'
import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import {pipe as filePipe} from '@qiwi/uniconfig-plugin-api-file'
import dotenvPlugin from '../../main/ts'

describe('plugin-dotenv', () => {
  beforeAll(() => {
    context.pipe.add('file', filePipe)
  })

  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(dotenvPlugin)

    expect(context.pipe.get('dotenv')).not.toBeUndefined()
  })

  describe('processes data', () => {
    const target = path.resolve(__dirname, './foobar.env')

    it('sync', () => {
      const config = new Config(target, {mode: SYNC, pipeline: 'file>dotenv'})

      expect(config.get('FOO')).toBe('BAR')
    })

    it('async', () => {
      const config = new Config(target, {mode: ASYNC, pipeline: 'file>dotenv'})

      return expect(config.ready.then(config => config.get('FOO'))).resolves.toBe('BAR')
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(dotenvPlugin)

    expect(context.pipe.get('dotenv')).toBeUndefined()
  })
})
