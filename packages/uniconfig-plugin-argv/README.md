# @qiwi/uniconfig-plugin-argv

Script args reader plugin.

## Install
```bash
  npm i @qiwi/uniconfig-plugin-argv
  yarn add @qiwi/uniconfig-plugin-argv
```

## Usage
```javascript
// node yourapp/run.js --foo=bar

import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginArgv from '@qiwi/uniconfig-plugin-argv'
    
rollupPlugin(uniconfigPluginArgv)
const config = uniconfig({pipeline: 'argv', mode: 'sync'}) 

config.get('foo') // 'bar'   
```
