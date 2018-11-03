# @qiwi/uniconfig-plugin-global

Uniconfig global variables reader plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-global
  yarn add @qiwi/uniconfig-plugin-global
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginGlobal from '@qiwi/uniconfig-plugin-global'

global.DEBUG=true
    
rollupPlugin(uniconfigPluginGlobal)
const config = uniconfig({}, {pipeline: 'global'}) 

config.get('DEBUG') // 'true'   
```
