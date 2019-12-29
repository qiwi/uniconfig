import { createContext, Context} from '../../main/ts/context'
import pipeRegistry from '../../main/ts/pipe/pipeRegistry'

describe('context', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const context = createContext()

      expect(context).toBeInstanceOf(Context)
      expect(context.pipe).toBe(pipeRegistry)
    })
  })
})
