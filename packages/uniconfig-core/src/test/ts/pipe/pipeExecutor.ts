import executor from '../../../main/ts/pipe/pipeExecutor'
import { PipeRegistry } from '../../../main/ts/pipe/pipeRegistry'
import { reduce } from '../../../main/ts/base/util'
import {IAnyObject, IContext, IPipeline} from '../../../main/ts/interface'

describe('pipe/pipeExecutor', () => {
  describe('processes pipeline', () => {
    const data = JSON.stringify({ foo: 'bar' })
    const registry = new PipeRegistry()
    const context: IContext = {
      pipe: registry,
    }
    const json = (_context: IContext, data: any) => { return JSON.parse(data) }
    const upper = (_context: IContext, data: IAnyObject) => reduce(data, (m: IAnyObject, v, k: string) => {
      m[k.toUpperCase()] = v.toUpperCase()
      return m
    }, {})
    const spacer = (_context: IContext, data: IAnyObject, sign = '') => reduce(data, (m: IAnyObject, v, k) => {
      m[k.split('').join(sign)] = v.split('').join(sign)
      return m
    }, {})
    const flip = (_context: IContext, data: IAnyObject) => reduce(data, (m: IAnyObject, v, k) => {
      m[v] = k
      return m
    }, {})
    const broken = (_context: IContext, _data: IAnyObject) => {
      throw new Error('Broken pipe')
    }
    const asPipe = (handler: Function) => ({
      handleSync: handler,
      name: handler.name,
      async handle (...args: any[]) { return handler(...args) },
    })

    registry.add('json', asPipe(json))
    registry.add('upper', asPipe(upper))
    registry.add('spacer', asPipe(spacer))
    registry.add('flip', asPipe(flip))
    registry.add('flip', asPipe(flip))
    registry.add('broken', asPipe(broken))

    type ITuple = [any, string | IPipeline, any, boolean];

    const cases: ITuple[] = [
      [data, 'json', { foo: 'bar' }, true],
      [data, 'json>upper>spacer', { FOO: 'BAR' }, true],
      [data, ['json', 'upper', 'spacer'], { FOO: 'BAR' }, true],
      [data, ['json', ['spacer', '_']], { f_o_o: 'b_a_r' }, true],
      [data, '', data, true],
      [data, `json   >  upper
      >
      spacer
      
`, { FOO: 'BAR' }, false],
      [data, '', data, false],
    ]

    cases.forEach(([data, pipeline, expected, sync]) => {
      const mode = sync ? 'sync' : 'async'

      if (sync) {
        it(`[${mode}] ${JSON.stringify(pipeline)}`, () => {
          expect(executor(data, pipeline, mode, context)).toEqual(expected)
        })
      } else {
        it(`[${mode}] ${JSON.stringify(pipeline)}`, async () => {
          await expect(executor(data, pipeline, mode, context)).resolves.toEqual(expected)
        })
      }
    })

    it('throws error if required `some` pipe is not found', () => {
      expect(() => executor(data, 'json>some', 'sync', context)).toThrow('Pipe not found: some')
    })

    it('raises error on failure', () => {
      expect(() => executor(data, 'broken', 'sync', context))
        .toThrow('Broken pipe')

      return expect(executor(data, 'broken', 'async', context))
        .rejects.toEqual(new Error('Broken pipe'))
    })
  })
})
