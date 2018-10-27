import uniconfig, {
  factory,
  Config,
  context,
  addPipe,
  removePipe,
  rollupPlugin,
  rollbackPlugin
} from '../src'
import {Context} from '../src/context'

describe('facade', () => {
  afterAll(context.pipe.flush)
  beforeEach(context.pipe.flush)

  const name = 'test'
  const pipe = {
    handle() {},
    handleSync() {}
  }
  const pipeAsPlugin = {...pipe, name}
  const plugin = {
    rollup(context) {
      context.pipe.add(name, pipe)
    },
    rollback(context) {
      context.pipe.remove(name)
    }
  }

  describe('exports factory as default', () => {
    expect(factory).toBe(uniconfig)
  })

  describe('factory', () => {
    it('produces new Config instance', () => {
      const opts = {}
      const target = 'foo'
      const config = uniconfig(target, opts)

      expect(config).toBeInstanceOf(Config)
    })
  })

  describe('context', () => {
    it('is exported from index', () => {
      expect(context).toBeInstanceOf(Context)
    })
  })

  describe('addPipe', () => {
    it('adds pipe to context', () => {
      addPipe(name, pipe)

      expect(context.pipe.get(name)).toBe(pipe)
    })
  })

  describe('removePipe', () => {
    it('removes pipe from context', () => {
      context.pipe.add(name, pipe)
      removePipe(name)

      expect(context.pipe.get(name)).toBeUndefined()
    })
  })

  describe('rollupPlugin', () => {
    it('registers plugin', () => {
      rollupPlugin(plugin)
      expect(context.pipe.get(name)).toEqual(pipe)
    })

    it('registers pipe as plugin', () => {
      rollupPlugin(pipeAsPlugin)
      expect(context.pipe.get(name)).toEqual(pipeAsPlugin)
    })
  })

  describe('rollbackPlugin', () => {
    it('unloads plugin', () => {
      context.pipe.add(name, pipe)
      rollbackPlugin(plugin)

      expect(context.pipe.get(name)).toBeUndefined()
    })

    it('unloads pipe', () => {
      context.pipe.add(name, pipe)
      rollbackPlugin(pipeAsPlugin)

      expect(context.pipe.get(name)).toBeUndefined()
    })
  })
})
