# @qiwi/uniconfig-plugin-path

Uniconfig path resolver plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-path
  yarn add @qiwi/uniconfig-plugin-path
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginPath from '@qiwi/uniconfig-plugin-path'
    
rollupPlugin(uniconfigPluginPath)
const config = uniconfig({data: ['<root>', 'config/default.json']}, {pipeline: 'path'}) 

config.get() // '/Users/antongolub/projects/uniconfig/config/default.json'  
```

## `root` reference
As practice shows, it's quite useful to build paths from the app root. So the `path` plugin works as preset, and adds [root plugin](../uniconfig-plugin-root/README.md) along with it.
Root aliases: `<root>`, `$root` and `APP_ROOT`.
