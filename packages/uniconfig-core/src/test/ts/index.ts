import uniconfig, {
  addPipe,
  Config,
  context,
  factory,
  getPipes,
  IEnvType,
  removePipe,
  rollbackPlugin,
  rollupPlugin,
  createContext
} from '../../main/ts'
import {Context} from '../../main/ts/context'

describe('facade', () => {
  afterAll(context.pipe.flush)
  beforeEach(context.pipe.flush)

  const name = 'test'
  const pipe = {
    async handle() {},
    handleSync() {},
  }
  const pipeAsPlugin = {...pipe, name}
  const plugin = {
    rollup(context: Context) {
      context.pipe.add(name, pipe)
    },
    rollback(context: Context) {
      context.pipe.remove(name)
    },
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
    it('defaultContext is exported from index', () => {
      expect(context).toBeInstanceOf(Context)
    })

    it('createContext factory is exported from index', () => {
      expect(createContext).toEqual(expect.any(Function))
    })
  })

  describe('addPipe', () => {
    it('adds pipe to current context', () => {
      addPipe(name, pipe)

      expect(context.pipe.get(name)).toBe(pipe)
    })

    it('asserts env type if defined, throws error on mismatch', () => {
      expect(() => addPipe(name, pipe, IEnvType.BROWSER))
        .toThrow(new Error('Uniconfig plugin \'test\' requires \'browser\' env only'))

      expect(() => addPipe(name, pipe, IEnvType.NODE))
        .not.toThrow()
    })
  })

  describe('getPipes', () => {
    it('returns the list of registred pipes', () => {
      expect(getPipes()).toEqual([name])
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
