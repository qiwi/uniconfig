import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import argvPlugin from '../src'

const name = argvPlugin.name

describe('plugin-argv', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(argvPlugin)

    expect(name).toBe('argv')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('processes config source data', () => {
    it('sync', () => {
      const config = new Config({mode: SYNC, pipeline: name})

      expect(config.get('cache')).toBeFalsy()
      expect(config.get('w')).toBe(1)
      expect(config.get('config')).toBe('jest.config.json')
      expect(config.get('detectOpenHandles')).toBeTruthy()
    })

    it('async', () => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then(config => config.get('config'))).resolves.toBe('jest.config.json')
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(argvPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
