import {pipe} from '../../main/ts'

describe('uniconfig-plugin-datatree', () => {
  const input = {
    data: {
      someParam: '$foo:bar',
      otherParam: '$a:b',
      anotherParam: '$a:d.e.f.g',
      lastParam: '$a:i.j.k.l.m.n',
      nested: {
        foo: '$foo:bar'
      }
    },
    sources: {
      foo: {
        data: {
          bar: 'baz'
        }
      },
      a: {
        data: {
          b: 'c',
          'd.e.f.g': 'h',
          'i.j': {
            k: {
              'l.m.n': 'o'
            }
          }
        }
      },
    }
  }

  describe('#handleSync', () => {
    it('populates input with source data', () => {
      expect(pipe.handleSync(input)).toEqual({
        someParam: 'baz',
        otherParam: 'c',
        anotherParam: 'h',
        lastParam: 'o',
        nested: {
          foo: 'baz'
        }
      })
    })
  })

  describe('#handle', () => {
    it('populates input with source data', async () => {
      await expect(pipe.handle(input)).resolves.toEqual({
        someParam: 'baz',
        otherParam: 'c',
        anotherParam: 'h',
        lastParam: 'o',
        nested: {
          foo: 'baz'
        }
      })
    })
  })
})
