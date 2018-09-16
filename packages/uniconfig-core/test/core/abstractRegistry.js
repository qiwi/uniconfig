import AbstractRegistry from '../../src/core/abstractRegistry'

describe('core/abstractRegistry', () => {
  class Registry extends AbstractRegistry {}
  const registry = new Registry()

  describe('constructor', () => {
    it('returns proper instance', () => {
      expect(registry.store).toEqual({})
      expect(registry.type).toEqual('abstract')
    })
  })

  describe('proto', () => {
    const foo = {bar: 'baz'}
    it('`add` registers new item', () => {
      registry.add('foo', foo)
      expect(registry.store.foo).toBe(foo)
    })

    it('`get` returns item by name, undefined if not found', () => {
      registry.add('foo', foo)
      expect(registry.get('foo')).toBe(foo)
      expect(registry.get('baz')).toBeUndefined()
    })

    it('`has` detects item existence by name', () => {
      registry.add('foo', foo)
      expect(registry.has('foo')).toBeTruthy()
      expect(registry.get('baz')).toBeFalsy()
    })

    it('`remove` drops target entry', () => {
      registry.add('foo', foo)
      registry.remove('foo')
      expect(registry.get('foo')).toBeFalsy()
    })

    it('`find` is not implemented by default', () => {
      expect(() => registry.find('foo')).toThrow('uniconfig: not implemented')
    })

    it('`flush` resets store to its initial', () => {
      registry.add('foo', foo)
      registry.flush()

      expect(registry.store).toEqual({})
      expect(registry.get('foo')).toBeFalsy()
    })
  })

  describe('static', () => {
    it('`notImplemented` throws error', () => {
      expect(() => AbstractRegistry.notImplemented()).toThrow('uniconfig: not implemented')
    })
  })
})
