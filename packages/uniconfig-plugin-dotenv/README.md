# @qiwi/uniconfig-plugin-dotenv

Uniconfig dotenv parser plugin

## Install
```bash
  npm i @qiwi/uniconfig-plugin-dotenv
  yarn add @qiwi/uniconfig-plugin-dotenv
```


## Usage
Imagine `./some.env`
```env
FOO=BAR
BAZ=QUX
```

```javascript
import Config, {rollupPlugin} from '@qiwi/uniconfig-core'
import uniconfigPluginDotenv from '@qiwi/uniconfig-plugin-dotenv'
    
rollupPlugin(uniconfigPluginDotenv)
const config = new Config('./some.env', {mode: SYNC, pipeline: 'file>dotenv'})

config.get('FOO') // 'BAR'  
```
