import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import pathPlugin, {resolveRoots, pipe} from '../../main/ts'
import * as path from 'path'

describe('plugin-path', () => {
  const root = path.resolve(__dirname, '../../../../../')

  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers `path` (self) and `root` plugins', () => {
    rollupPlugin(pathPlugin)

    expect(context.pipe.get('root')).not.toBeUndefined()
    expect(context.pipe.get('path')).not.toBeUndefined()
  })

  describe('resolves paths', () => {
    const expected = `${root}/config/default.json`

    it('sync', () => {
      const config = new Config({data: ['$root', 'config/default.json']}, {mode: SYNC, pipeline: 'path'})
      expect(config.get()).toBe(expected)

      expect(new Config({
        data: ['$root', 'config/default.json'],
        mode: SYNC,
        pipeline: 'path'},
      ).get()).toBe(expected)
    })

    it('async', async() => {
      const config = new Config({data: ['<root>', 'config/default.json']}, {mode: ASYNC, pipeline: 'path'})
      return expect(config.ready.then((config: Config) => config.get())).resolves.toBe(expected)
    })

    it('processes root aliases', () => {
      expect(resolveRoots(['<root>', '$root', 'APP_ROOT'])).toEqual([root, root, root])
    })

    it('handles root aliases as a part of strings', () => {
      expect(pipe.handleSync('<root>/config/default.json')).toBe(expected)
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(pathPlugin)

    expect(context.pipe.get('root')).toBeUndefined()
    expect(context.pipe.get('path')).toBeUndefined()
  })
})
