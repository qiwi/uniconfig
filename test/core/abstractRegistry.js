import AbstractRegistry from '../../src/core/abstractRegistry'

describe('core/abstractRegistry', () => {
  class Registry extends AbstractRegistry {}
  const registry = new Registry()

  describe('constructor', () => {
    it('returns proper instance', () => {
      expect(registry.store).toEqual([])
      expect(registry.index).toEqual({})
    })
  })

  describe('proto', () => {
    const cases = ['register', 'get', 'has']

    cases.forEach(method => {
      it('`' + method + '` is not implemented', () => {
        expect(() => registry[method]('foo')).toThrow('uniconfig: not implemented')
      })
    })

    it('`flush` resets store and index', () => {
      registry.store.push('foo')
      registry.index.foo = 'bar'
      registry.flush()

      expect(registry.store).toEqual([])
      expect(registry.index).toEqual({})
    })
  })

  describe('static', () => {
    it('`notImplemented` throws error', () => {
      expect(() => AbstractRegistry.notImplemented()).toThrow('uniconfig: not implemented')
    })
  })
})
