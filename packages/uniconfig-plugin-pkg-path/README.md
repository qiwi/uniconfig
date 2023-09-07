# @qiwi/uniconfig-plugin-pkg-path

Uniconfig app pkg-path resolver plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-pkg-path
  yarn add @qiwi/uniconfig-plugin-pkg-path
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginRoot from '@qiwi/uniconfig-plugin-root'
    
rollupPlugin(uniconfigPluginRoot)
const config = uniconfig({pipeline: 'pkg-path', mode: 'sync'}) 

config.get()  //  '/Users/antongolub/projects/uniconfig/packages/uniconfig-plugin-pkg-path'
```
