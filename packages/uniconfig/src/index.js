import unicore, {rollupPlugin} from '@qiwi/uniconfig-core'
import jsonPlugin from '@qiwi/uniconfig-plugin-json'
import filePlugin from '@qiwi/uniconfig-plugin-api-file'
import datatreePlugin from '@qiwi/uniconfig-plugin-datatree'

rollupPlugin(jsonPlugin)
rollupPlugin(filePlugin)
rollupPlugin(datatreePlugin)

export * from '@qiwi/uniconfig-core'
export default unicore
