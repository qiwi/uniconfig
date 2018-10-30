# @qiwi/uniconfig-plugin-pkg

Uniconfig package.json reader plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-pkg
  yarn add @qiwi/uniconfig-plugin-pkg
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginPkg from '@qiwi/uniconfig-plugin-pkg'
    
rollupPlugin(uniconfigPluginPkg)
const config = uniconfig({pipeline: 'pkg', mode: 'sync'}) 

config.get('version') // '1.2.3'   
config.get('name')    // 'some-package-name'   
```
