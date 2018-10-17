import createContext, {Context} from '../src/context'
import pipeRegistry from '../src/pipe/pipeRegistry'

describe('context', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const context = createContext()

      expect(context).toBeInstanceOf(Context)
      expect(context.pipe).toBe(pipeRegistry)
    })
  })
})
