import {context, Config, rollupPlugin, rollbackPlugin, SYNC, ASYNC} from '@qiwi/uniconfig-core'
import ajvPlugin from '../src'

const name = ajvPlugin.name

describe('plugin-ajv', () => {
  afterAll(() => {
    context.pipe.flush()
  })

  it('properly registers itself', () => {
    rollupPlugin(ajvPlugin)

    expect(name).toBe('ajv')
    expect(context.pipe.get(name)).not.toBeUndefined()
  })

  describe('validates data', () => {
    const schema = {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {
          type: 'string',
          minLength: 1
        },
        date: {
          type: 'string',
          format: 'date-time'
        }
      }
    }
    const cases = [
      [SYNC, { foo: 'bar' }, {}],
      [SYNC, { foo: 1 }, {}, '[uniconfig ajv]: data.foo should be string'],
      [SYNC, { foo: 'bar', date: '2000-01-32T20:20:20Z' }, {format: 'fast'}],
      [SYNC, { foo: 'bar', date: '2000-01-32T20:20:20Z' }, {format: 'full'}, '[uniconfig ajv]: data.date should match format "date-time"'],

      [ASYNC, { foo: 'bar' }, {}],
      [ASYNC, { foo: 1 }, {}, '[uniconfig ajv]: data.foo should be string'],
    ]

    cases.forEach(([mode, data, ajvOpts, err]) => {
      const opts = {
        mode,
        data: {
          data,
          schema,
          opts: ajvOpts
        },
        pipeline: name
      }

      if (mode === SYNC) {
        if (err) {
          it(`${mode}: ${err}`, () => {
            expect(() => new Config(opts)).toThrow(err)
          })
        } else {
          it(`${mode} returns valid data as is`, () => {
            expect(new Config(opts).get()).toBe(data)
          })
        }
      } else {
        if (err) {
          it(`${mode}: rejects with err ${err}`, () => {
            expect(new Config(opts).ready.then(config => config.get())).rejects.toBe(err)
          })
        } else {
          it(`${mode} resolves valid data as is`, () => {
            expect(new Config(opts).ready.then(config => config.get())).resolves.toBe(data)
          })
        }
      }
    })
  })

  it('supports rollback', () => {
    rollbackPlugin(ajvPlugin)

    expect(context.pipe.get(name)).toBeUndefined()
  })
})
