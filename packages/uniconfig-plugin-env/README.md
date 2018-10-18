# @qiwi/uniconfig-plugin-env

Uniconfig Environment API plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-env
  yarn add @qiwi/uniconfig-plugin-env
```

## Usage
```javascript
// FOO=bar node src/index.js

// index.js:
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginEnv from '@qiwi/uniconfig-plugin-env'
    
rollupPlugin(uniconfigPluginEnv)
const config = uniconfig({}, {pipeline: 'env'}) 

config.get('FOO') // 'bar'   
```
