# @qiwi/uniconfig-plugin-dot

Uniconfig [doT](http://olado.github.io/doT/) template plugin.

## Install
```bash
  npm i @qiwi/uniconfig-plugin-dot
  yarn add @qiwi/uniconfig-plugin-dot
```

## Usage
```javascript
import uniconfig, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginDot from '@qiwi/uniconfig-plugin-dot'
    
rollupPlugin(uniconfigPluginDot)
const config = uniconfig({
   data: {
     template: '{{=it.foo}}-bar-{{=it.baz}}',
     data: {
       foo: 'FOO',
       baz: 'BAZ'
     }
   },
   mode: 'sync',
   pipeline: 'dot'
 }) 

config.get() // 'FOO-bar-BAZ'   
```
