# @qiwi/uniconfig-plugin-api-http

Uniconfig HTTP API plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-api-http
  yarn add @qiwi/uniconfig-plugin-api-http
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigHttpApiPlugin from '@qiwi/uniconfig-plugin-api-http'
import uniconfigJsonParserPlugin from '@qiwi/uniconfig-plugin-parser-json'
    
rollupPlugin(uniconfigHttpApiPlugin)
rollupPlugin(uniconfigJsonParserPlugin)

const target = 'https://reqres.in/api/users/2'
/** Remote data:
{
    data: {
      id: 2,
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg'
    }
  }
*/
const config = uniconfig({
  data: {
    someParam: '$fromWeb:data.first_name'
  },
  source: {
    fromWeb: {
      target: '',
      api: 'http',
      parser: 'json'
    }
  }
}, {
  mode: 'sync'
})    

config.get('someParam') // "Janet"
```
