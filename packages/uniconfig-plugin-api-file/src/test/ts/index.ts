import * as path from 'path'
import {context, Config, rollupPlugin, rollbackPlugin, ASYNC, SYNC} from '@qiwi/uniconfig-core'
import filePlugin, {pipe as filePipe} from '../../main/ts'
import {IConfigLegacyOpts} from '@qiwi/uniconfig-core/src/main/ts'

describe('uniconfig-plugin-api-file', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  const target = path.resolve(__dirname, './foobar.json')

  describe('#readSync', () => {
    it('gets file data as string', () => {
      expect(filePipe.handleSync(target)).toEqual(JSON.stringify({foo: 'bar'}))
    })

    it('gets err as result', () => {
      expect(() => filePipe.handleSync('bazqux')).toThrow('ENOENT: no such file or directory, open \'bazqux\'')
    })
  })

  describe('#read', () => {
    it('resolves promise with string', () => {
      return expect(filePipe.handle(target)).resolves.toEqual(JSON.stringify({foo: 'bar'}))
    })

    it('rejects promise with err', () => {
      return expect(filePipe.handle('bazqux')).rejects.toThrow('ENOENT: no such file or directory, open \'bazqux\'')
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
