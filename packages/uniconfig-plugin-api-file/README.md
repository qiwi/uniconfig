# @qiwi/uniconfig-plugin-api-file

Uniconfig File API plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-api-file
  yarn add @qiwi/uniconfig-plugin-api-file
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigFileApiPlugin from '@qiwi/uniconfig-plugin-api-file'
import uniconfigJsonParserPlugin from '@qiwi/uniconfig-plugin-parser-json'
    
rollupPlugin(uniconfigFileApiPlugin)
rollupPlugin(uniconfigJsonParserPlugin)

const target = './foo.json'
/** foo.json content:
{
  "foo": "bar"
}
*/

const config = uniconfig({
  data: {
    someParam: '$fromFile:foo'
  },
  source: {
    fromFile: {
      data: '<some path>',
      pipeline: 'file>json'
    }
  }
}, {
  mode: 'sync',
  pipeline: 'datatree'
})    

config.get('someParam') // "bar"

const missingTarget = './foo-missing.json' // this file does not exist
const target2 = './foo2.json'
/** foo2.json content:
 {
  "foo2": "bar2"
}
 */

const config = uniconfig({
  data: {
    someParam: '$fromFile:foo'
  },
  source: {
    fromFile: {
      data: [missingTarget, target2, target], // in this mode the content of the first existing file is returned
      pipeline: 'file>json'
    }
  }
}, {
  mode: 'sync',
  pipeline: 'datatree'
})

config.get('someParam') // "bar2"
```
