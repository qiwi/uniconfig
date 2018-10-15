# @qiwi/uniconfig-plugin-datatree

Uniconfig "Datatree" plugin.

## Install
```bash
  npm i @qiwi/uniconfig-plugin-datatree
  yarn add @qiwi/uniconfig-plugin-datatree
```

# Usage

```javascript
import {Config, addPlugin} from '@qiwi/uniconfig-core'
import dataTreePlugin from '@qiwi/uniconfig-plugin-datatree'

addPlugin(dataTreePlugin)

const config = new Config({
  data: {
    someParam: '$foo:bar',
    otherParam: '$a:b'
  },
  source: {
    foo: {
      data: {
        bar: 'baz'
      }
    },
    a: {
      data: {
        b: 'c'
      }
    }
  }
}, {
  pipeline: 'datatree',
  mode: 'sync'
})

config.get('someParam')   // 'baz'
config.get('otherParam')  // 'c'
```

