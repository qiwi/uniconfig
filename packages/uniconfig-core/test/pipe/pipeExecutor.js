import executor, {

} from '../../src/pipe/pipeExecutor'
import { PipeRegistry } from '../../src/pipe/pipeRegistry'
import { reduce } from '../../src/base/util'

describe('pipe/pipeExecutor', () => {
  describe('processes pipeline', () => {
    const data = JSON.stringify({ foo: 'bar' })
    const registry = new PipeRegistry()
    const json = (data) => { return JSON.parse(data) }
    const upper = (data) => reduce(data, (m, v, k) => {
      m[k.toUpperCase()] = v.toUpperCase()
      return m
    }, {})
    const spacer = (data, sign = '') => reduce(data, (m, v, k) => {
      m[k.split('').join(sign)] = v.split('').join(sign)
      return m
    }, {})
    const flip = (data) => reduce(data, (m, v, k) => {
      m[v] = k
      return m
    }, {})
    const asPipe = handler => ({
      handleSync: handler,
      async handle (...args) { return handler(...args) }
    })

    registry.add('json', asPipe(json))
    registry.add('upper', asPipe(upper))
    registry.add('spacer', asPipe(spacer))
    registry.add('flip', asPipe(flip))

    const cases = [
      [data, 'json', { foo: 'bar' }, true],
      [data, 'json>upper>spacer', { FOO: 'BAR' }, true],
      [data, ['json', 'upper', 'spacer'], { FOO: 'BAR' }, true],
      [data, ['json', ['spacer', '_']], { f_o_o: 'b_a_r' }, true],
      [data, '', data, true],
      [data, 'json>upper>spacer', { FOO: 'BAR' }, false],
      [data, '', data, false]
    ]

    cases.forEach(([data, pipeline, expected, sync]) => {
      const mode = sync ? 'sync' : 'async'

      if (sync) {
        it(`[${mode}] ${JSON.stringify(pipeline)}`, () => {
          expect(executor(data, pipeline, mode, registry)).toEqual(expected)
        })
      } else {
        it(`[${mode}] ${JSON.stringify(pipeline)}`, async () => {
          await expect(executor(data, pipeline, mode, registry)).resolves.toEqual(expected)
        })
      }
    })

    it('throws error if required `some` pipe is not found', () => {
      expect(() => executor(data, 'json>some', 'sync', registry)).toThrow('Pipe not found: some')
    })
  })
})
