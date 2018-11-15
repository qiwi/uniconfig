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
    otherParam: '$a:b',
    anotherParam: '$a:d.e.f.g'
  },
  source: {
    foo: {
      data: {
        bar: 'baz'
      }
    },
    a: {
      data: {
        b: 'c',
        'd.e.f.g': 'h'
      }
    }
  }
}, {
  pipeline: 'datatree',
  mode: 'sync'
})

config.get('someParam')     // 'baz'
config.get('otherParam')    // 'c'
config.get('anotherParam')  // 'h'
```
