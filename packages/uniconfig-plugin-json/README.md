# @qiwi/uniconfig-plugin-json

Uniconfig JSON parser plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-yaml
  yarn add @qiwi/uniconfig-plugin-yaml
```


## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginJson from '@qiwi/uniconfig-plugin-json'
    
rollupPlugin(uniconfigPluginJson)
const config = uniconfig('./foobar.json')    
```
