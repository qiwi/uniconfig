# @qiwi/uniconfig-plugin-yaml

Uniconfig YAML parser plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-yaml
  yarn add @qiwi/uniconfig-plugin-yaml
```


## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginYaml from '@qiwi/uniconfig-plugin-yaml'
    
rollupPlugin(uniconfigPluginYaml)
const config = uniconfig('./foobar.yml')    
```
