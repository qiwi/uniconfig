import * as path from 'path'
import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  ASYNC,
  SYNC,
  IConfigLegacyOpts,
} from '@qiwi/uniconfig-core'
import filePlugin, {pipe as filePipe} from '../../main/ts'

describe('uniconfig-plugin-api-file', () => {
  afterAll(() => context.pipe.flush())

  const target = path.resolve(__dirname, './foobar.json')
  const target2 = path.resolve(__dirname, './foobarbaz.json')
  const missingTarget = path.resolve(__dirname, './foobar-missing.json')
  const targetContent = JSON.stringify({foo: 'bar'})
  const target2Content = JSON.stringify({foo: 'barbaz'})
  const missingTargets = [missingTarget, path.resolve(__dirname, './foobar-missing2.json'), path.resolve(__dirname, './foobar-missing2.json')]

  describe('#readSync', () => {
    it('gets file data as string', () => {
      expect(filePipe.handleSync(context, target)).toEqual(targetContent)
    })

    it('gets err as result', () => {
      expect(() => filePipe.handleSync(context, 'bazqux')).toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })

    it('gets content of the first accessible file', () => {
      expect(filePipe.handleSync(context, [missingTarget, target, target2]).trim()).toEqual(targetContent)
      expect(filePipe.handleSync(context, [target2, missingTarget, target]).trim()).toEqual(target2Content)
    })

    it('throws an error when all targets are unreachabler', () => {
      expect(() => filePipe.handleSync(context, missingTargets)).toThrow(/^All targets are unreachable/)
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(filePipe.handle(context, target)).resolves.toEqual(targetContent)
    })

    it('gets content of the first accessible file', async() => {
      await expect(filePipe.handle(context, [missingTarget, target, target2]).then(d => d.trim())).resolves.toEqual(targetContent)
      await expect(filePipe.handle(context, [target2, missingTarget, target]).then(d => d.trim())).resolves.toEqual(target2Content)
    })

    it('throws an error when all targets are unreachable', async() => {
      await expect(
        filePipe.handle(
          context,
          missingTargets,
        ),
      ).rejects.toMatchObject({ message: /^All targets are unreachable/ })
    })

    it('rejects promise with err', () => {
      return expect(filePipe.handle(context, 'bazqux')).rejects.toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('integration', () => {
    beforeAll(() => {
      rollupPlugin(filePlugin)
    })

    afterAll(() => {
      rollbackPlugin(filePlugin)
    })

    it('sync', () => {
      const mode = SYNC
      const opts: IConfigLegacyOpts = {mode, pipeline: 'file'}
      const config = new Config(target, opts)

      expect(config.get()).toBe('{"foo":"bar"}')
    })

    it('async', done => {
      const mode = ASYNC
      const opts: IConfigLegacyOpts = {mode, pipeline: 'file'}
      const config = new Config(target, opts)

      config.on('CONFIG_READY', () => {
        expect(config.get()).toBe('{"foo":"bar"}')
        done()
      })
    })
  })
})
