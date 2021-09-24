import {
  context,
  Config,
  rollupPlugin,
  rollbackPlugin,
  SYNC,
  ASYNC,
} from '@qiwi/uniconfig-core'
import ajvPlugin from '../../main/ts'

const name = ajvPlugin.name

describe('plugin-ajv', () => {
  beforeAll(() => rollupPlugin(ajvPlugin))
  afterAll(() => context.pipe.flush())

  it('properly registers itself', () => {
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
          minLength: 1,
        },
        date: {
          type: 'string',
          format: 'date-time',
        },
      },
    }
    const cases: Array<[string, any, any, string] | [string, any, any]> = [
      [SYNC, {foo: 'bar'}, {}],
      [SYNC, {foo: 1}, {}, '[uniconfig ajv]: data/foo must be string'],
      // // https://github.com/ajv-validator/ajv-formats#options
      // // [SYNC, {foo: 'bar', date: '2000-02-28T20:20:59Z'}, {mode: 'fast', formats: ['date-time']}],
      [SYNC, {foo: 'bar', date: '2000-01-32T20:20:20Z'}, {mode: 'full'}, '[uniconfig ajv]: data/date must match format "date-time"'],

      [ASYNC, {foo: 'bar'}, {}],
      [ASYNC, {foo: 1}, {foo: 1}, '[uniconfig ajv]: data/foo must be string'],
    ]

    cases.forEach(([mode, data, ajvOpts, err]) => {
      const opts = {
        context,
        mode,
        data: {
          data,
          schema,
          opts: ajvOpts,
        },
        pipeline: name,
      }

      if (mode === SYNC) {
        if (err) {
          it(`${mode}: ${err}`, () => {
            expect(() => new Config(opts)).toThrow(new Error(err))
          })
        }
        else {
          it(`${mode} returns valid data as is`, () => {
            expect(new Config(opts).get()).toBe(data)
          })
        }
      }
      else {
        if (err) {
          it(`${mode}: rejects with err ${err}`, () => {
            // tslint:disable-next-line
            return expect(new Config(opts).ready).rejects.toEqual(new Error(err))
          })
        }
        else {
          it(`${mode} resolves valid data as is`, async() => {
            // tslint:disable-next-line
            await expect(new Config(opts).ready.then((config: Config) => config.get())).resolves.toBe(data)
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
