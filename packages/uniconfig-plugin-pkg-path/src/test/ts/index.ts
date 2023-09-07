import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  SYNC,
  ASYNC,
} from '@qiwi/uniconfig-core'
import pkgPathPlugin from '../../main/ts'
import * as path from 'path'

const name = pkgPathPlugin.name

describe('plugin-pkg-path', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(pkgPathPlugin)

    expect(name).toBe('pkg-path')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('get closest package.json file', () => {
    const expected = path.resolve(__dirname, '../../..')

    it('sync', () => {
      const config = new Config({mode: SYNC, pipeline: name})
      expect(config.get()).toBe(expected)
    })

    it('async', async() => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then((config: Config) => config.get())).resolves.toBe(expected)
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(pkgPathPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
