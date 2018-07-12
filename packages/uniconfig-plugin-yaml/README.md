# @qiwi/uniconfig-plugin-yaml

Uniconfig YAML plugin

## Install
```javascript
    npm i @qiwi/uniconfig-plugin-yaml
    yarn add @qiwi/uniconfig-plugin-yaml
```

# Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig'
import uniconfigPluginYaml from '@qiwi/uniconfig-plugin-yaml'    
rollupPlugin(uniconfigPluginYaml)
const config = uniconfig('./foobar.yml')    
```
