# @qiwi/uniconfig-plugin-root

Uniconfig app root resolver plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-root
  yarn add @qiwi/uniconfig-plugin-root
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginRoot from '@qiwi/uniconfig-plugin-root'
    
rollupPlugin(uniconfigPluginRoot)
const config = uniconfig({pipeline: 'root', mode: 'sync'}) 

config.get()  //  '/Users/antongolub/projects/uniconfig'
```
