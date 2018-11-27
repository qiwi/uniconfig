# @qiwi/uniconfig-plugin-ajv

[Ajv](https://github.com/epoberezkin/ajv) validation plugin. 

## Install
```bash
  npm i @qiwi/uniconfig-plugin-ajv
  yarn add @qiwi/uniconfig-plugin-ajv
```

## Usage
```javascript

import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginAjv from '@qiwi/uniconfig-plugin-ajv'
    
rollupPlugin(uniconfigPluginAjv)
const config = uniconfig({
  data: {
    data: {
      foo: 'bar'
    },
    schema: {
      type: 'object',
      required: ['foo'],
      properties: {
        foo: {
          type: 'string',
          minLength: 1
        }
      }
    }
  },
  pipeline: 'ajv',
  mode: 'sync'
}) 

config.get('foo') // 'bar'   
```
