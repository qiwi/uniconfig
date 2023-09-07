import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import pathPlugin, {resolvePaths, pipe} from '../../main/ts'
import * as path from 'path'

describe('plugin-path', () => {
  const root = path.resolve(__dirname, '../../../../../')
  const pkgPath = path.resolve(__dirname, '../../../')

  afterAll(() => context.pipe.flush())

  it('properly registers `path` (self) and `root` plugins', () => {
    rollupPlugin(pathPlugin)

    expect(context.pipe.get('root')).not.toBeUndefined()
    expect(context.pipe.get('path')).not.toBeUndefined()
    expect(context.pipe.get('pkg-path')).not.toBeUndefined()
  })

  describe('resolves paths', () => {
    describe('root', () => {
      const expected = `${root}/config/default.json`

      it('sync', () => {
        const config = new Config({
          context,
          data: ['$root', 'config/default.json'],
          mode: SYNC,
          pipeline: 'path',
        })
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
        expect(resolvePaths(context,['<root>', '$root', 'APP_ROOT'])).toEqual([root, root, root])
      })

      it('handles root aliases as a part of strings', () => {
        expect(pipe.handleSync(context,'<root>/config/default.json')).toBe(expected)
      })
    })
    describe('pkg-path', () => {
      const expected = `${pkgPath}/config/default.json`

      it('sync', () => {
        const config = new Config({
          context,
          data: ['$pkg-path', 'config/default.json'],
          mode: SYNC,
          pipeline: 'path',
        })
        expect(config.get()).toBe(expected)

        expect(new Config({
          data: ['$pkg-path', 'config/default.json'],
          mode: SYNC,
          pipeline: 'path'},
        ).get()).toBe(expected)
      })

      it('async', async() => {
        const config = new Config({data: ['<pkg-path>', 'config/default.json']}, {mode: ASYNC, pipeline: 'path'})
        return expect(config.ready.then((config: Config) => config.get())).resolves.toBe(expected)
      })

      it('processes pkg-path aliases', () => {
        expect(resolvePaths(context,['<pkg-path>', '$pkg-path', 'APP_PKG'])).toEqual([pkgPath, pkgPath, pkgPath])
      })

      it('handles pkg-path aliases as a part of strings', () => {
        expect(pipe.handleSync(context,'<pkg-path>/config/default.json')).toBe(expected)
      })
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(pathPlugin)

    expect(context.pipe.get('root')).toBeUndefined()
    expect(context.pipe.get('path')).toBeUndefined()
    expect(context.pipe.get('pkg-path')).toBeUndefined()
  })
})
