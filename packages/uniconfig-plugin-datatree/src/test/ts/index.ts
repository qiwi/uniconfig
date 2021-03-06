import {pipe} from '../../main/ts'
import {context} from '@qiwi/uniconfig-core'

describe('uniconfig-plugin-datatree', () => {
  const input = {
    data: {
      someParam: '$foo:bar',
      otherParam: '$a:b',
      anotherParam: '$a:d.e.f.g',
      lastParam: '$a:i.j.k.l.m.n',
      nested: {
        foo: '$foo:bar',
      },
      arr: ['$foo:bar', 1],
    },
    sources: {
      foo: {
        data: {
          bar: 'baz',
        },
      },
      a: {
        data: {
          b: 'c',
          'd.e.f.g': 'h',
          'i.j': {
            k: {
              'l.m.n': 'o',
            },
          },
        },
      },
    },
  }

  describe('#handleSync', () => {
    it('populates input with source data', () => {
      expect(pipe.handleSync(context, input)).toEqual({
        someParam: 'baz',
        otherParam: 'c',
        anotherParam: 'h',
        lastParam: 'o',
        nested: {
          foo: 'baz',
        },
        arr: ['baz', 1],
      })
    })
  })

  describe('#handle', () => {
    it('populates input with source data', async() => {
      await expect(pipe.handle(context, input)).resolves.toEqual({
        someParam: 'baz',
        otherParam: 'c',
        anotherParam: 'h',
        lastParam: 'o',
        nested: {
          foo: 'baz',
        },
        arr: ['baz', 1],
      })
    })
  })
})
