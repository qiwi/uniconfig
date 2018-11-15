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
    anotherParam: '$a:d.e.f.g',
    lastParam: '$a:i.j.k.l.m.n'
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
        'd.e.f.g': 'h',
        'i.j': {
          k: {
            'l.m.n': 'o'
          }
        }
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
config.get('lastParam')     // 'o'
```
