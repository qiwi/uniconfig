import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import pkgPlugin from '../src'

const name = pkgPlugin.name

describe('plugin-pkg', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers self', () => {
    rollupPlugin(pkgPlugin)

    expect(name).toBe('pkg')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('gets package.json data', () => {
    const expected = {
      workspaces: [ 'packages/*' ],
      scripts:
        {
          clean: 'lerna clean --yes && lerna run clean',
          build: 'yarn clean && lerna run --stream build'
        }
    }

    it('sync', () => {
      const config = new Config({mode: SYNC, pipeline: name})
      expect(config.get()).toMatchObject(expected)
    })

    it('async', async () => {
      const config = new Config({mode: ASYNC, pipeline: name})

      return expect(config.ready.then(config => config.get())).resolves.toMatchObject(expected)
    })

  })

  it('supports rollback', () => {
    rollbackPlugin(pkgPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
