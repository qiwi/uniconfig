# @qiwi/uniconfig-plugin-cwd

Uniconfig package.json cwd plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-cwd
  yarn add @qiwi/uniconfig-plugin-cwd
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginCwd from '@qiwi/uniconfig-plugin-cwd'
    
rollupPlugin(uniconfigPluginCwd)
const config = uniconfig({pipeline: 'cwd', mode: 'sync'}) 

config.get() // '/Users/user/opensource/qiwi/uniconfig'
```
