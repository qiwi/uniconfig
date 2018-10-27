# @qiwi/uniconfig-plugin-ip

Uniconfig IP/host resolver plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-ip
  yarn add @qiwi/uniconfig-plugin-ip
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginIp from '@qiwi/uniconfig-plugin-ip'
    
rollupPlugin(uniconfigPluginIp)
const config = uniconfig({pipeline: 'ip', mode: 'sync'}) 

config.get() // '10.20.10.30'   
```
