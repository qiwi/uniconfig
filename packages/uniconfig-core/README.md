# @qiwi/uniconfig-core

Core uniconfig layer: basic ifaces, utils, entry point, plugin API

## Install
```bash
  npm i @qiwi/uniconfig-core
  yarn add @qiwi/uniconfig-core
```

# Plugin API
`uniconfig` features may be significantly extended with plugins.
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig'
import uniconfigPluginYaml from '@qiwi/uniconfig-plugin-yaml'    

rollupPlugin(uniconfigPluginYaml)
const config = uniconfig('./foobar.yml')    
```

Each plugin must expose at least two methods to be registered: `rollup` and `rollback`.
```javascript
export interface IContext {
  api: any,
  processor: any,
  parser: any,
  source: any
}

export interface IPlugin {
  rollback(context: IContext): void,
  rollup(context: IContext): void
}
``` 
