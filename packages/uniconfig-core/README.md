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
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginFile from '@qiwi/uniconfig-plugin-api-file'    
import uniconfigPluginYaml from '@qiwi/uniconfig-plugin-yaml'    
import uniconfigPluginDatatree from '@qiwi/uniconfig-plugin-datatree'    

rollupPlugin(uniconfigPluginFile)
rollupPlugin(uniconfigPluginYaml)
rollupPlugin(uniconfigPluginDatatree)
const config = uniconfig('./foobar.yml', {mode: 'sync', pipeline: 'file>yaml>datatree'})    
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

### Example
```json
{
  "data": {
    "foo": "bar",
    "baz": 1,
    "host": "$remoteConfig.hostname",
    "port": "$jsonFile.defaultPort"
  },
  "sources": {
     "jsonFile": {"pipeline": "file>json", "data": "./foo.json"},
     "yamlFile": {"pipeline": "file>yaml", "data": "./bar.yaml"},
     "remoteConfig": {"pipeline": "http>json", "data": "https://reqres.in/api/users/2"}
  }
}
```
