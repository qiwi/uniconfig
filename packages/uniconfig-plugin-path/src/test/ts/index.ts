import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import pathPlugin, {pipe} from '../../main/ts'
import * as path from 'path'

describe('plugin-path', () => {
  const root = path.resolve(__dirname, '../../../../../')
  const cwd = process.cwd()

  afterAll(() => context.pipe.flush())

  it('properly registers `path` (self) and `root` plugins', () => {
    rollupPlugin(pathPlugin)

    expect(context.pipe.get('root')).not.toBeUndefined()
    expect(context.pipe.get('path')).not.toBeUndefined()
  })

  describe('resolves paths', () => {
    const expectedRoot = `${root}/config/default.json`
    const expectedCwd = `${cwd}/config/default.json`

    it('sync', () => {
      const config = new Config({
        context,
        data: ['$root', 'config/default.json'],
        mode: SYNC,
        pipeline: 'path',
      })
      expect(config.get()).toBe(expectedRoot)

      expect(new Config({
        data: ['$root', 'config/default.json'],
        mode: SYNC,
        pipeline: 'path'},
      ).get()).toBe(expectedRoot)

      expect(new Config({
        data: ['$cwd', 'config/default.json'],
        mode: SYNC,
        pipeline: 'path'},
      ).get()).toBe(expectedCwd)

      expect(new Config({
        data: [
          ['$cwd', 'config/default.json'],
          ['$cwd', 'config/ci.json'],
        ],
        mode: SYNC,
        pipeline: 'path'},
      ).get()).toStrictEqual([expectedCwd, `${cwd}/config/ci.json`])

      expect(new Config({
        data: [
          ['$cwd/config/default.json'],
          ['<cwd>/config/ci.json'],
        ],
        mode: SYNC,
        pipeline: 'path'},
      ).get()).toStrictEqual([expectedCwd, `${cwd}/config/ci.json`])
    })

    it('async', async() => {
      const config = new Config({data: ['<root>', 'config/default.json']}, {mode: ASYNC, pipeline: 'path'})
      await expect(config.ready.then((config: Config) => config.get())).resolves.toBe(expectedRoot)

      const cwdConfig = new Config({data: ['<cwd>', 'config/default.json']}, {mode: ASYNC, pipeline: 'path'})
      await expect(cwdConfig.ready.then((config: Config) => config.get())).resolves.toBe(expectedCwd)
    })

    it('handles root aliases as a part of strings', () => {
      expect(pipe.handleSync(context,'<root>/config/default.json')).toBe(expectedRoot)
    })

    it('handles cwd aliases as a part of strings', () => {
      expect(pipe.handleSync(context,'<cwd>/config/default.json')).toBe(expectedCwd)
    })

    it('throws an error when input is invalid', () => {
      expect(() => pipe.handleSync(context,undefined)).toThrow(/^Invalid/)
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(pathPlugin)

    expect(context.pipe.get('root')).toBeUndefined()
    expect(context.pipe.get('path')).toBeUndefined()
  })
})
