# uniconfig

![stability-unstable](https://img.shields.io/badge/stability-unstable-yellow.svg)
[![Build Status](https://travis-ci.com/qiwi/uniconfig.svg?branch=master)](https://travis-ci.com/qiwi/uniconfig)
[![devDependencyStatus](https://img.shields.io/david/dev/qiwi/uniconfig.svg?maxAge=3600)](https://david-dm.org/qiwi/uniconfig)
[![Maintainability](https://api.codeclimate.com/v1/badges/2b7e955e5e675161fc56/maintainability)](https://codeclimate.com/github/qiwi/uniconfig/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2b7e955e5e675161fc56/test_coverage)](https://codeclimate.com/github/qiwi/uniconfig/test_coverage)
[![Greenkeeper badge](https://badges.greenkeeper.io/qiwi/uniconfig.svg)](https://greenkeeper.io/)
[![CodeStyle](https://img.shields.io/badge/code%20style-tslint--config--qiwi-brightgreen.svg)](https://github.com/qiwi/tslint-config-qiwi)

Yet another one config processor. Weird. Slow. Our own.

## Install
```bash
    npm i @qiwi/uniconfig
    yarn add @qiwi/uniconfig
```

## Concept
Config is just a piece of `data` with getters. The `data` is obtained from `ISource` in some way and processed by registered `IPipe` handlers.
These operations form the `pipeline`.

## Features
* Declarative definitions
* Multiple source composition
* Modular design
* Ease extensibility

## Basic usage
```javascript
import * as path from 'path'
import { Config, rollupPlugin } from '@qiwi/uniconfig-core'
import envPlugin from '@qiwi/uniconfig-plugin-env'
import jsonPlugin from '@qiwi/uniconfig-plugin-json'
import filePlugin from '@qiwi/uniconfig-plugin-api-file'
import datatreePlugin from '@qiwi/uniconfig-plugin-datatree'

rollupPlugin(envPlugin)
rollupPlugin(jsonPlugin)
rollupPlugin(filePlugin)
rollupPlugin(datatreePlugin)

const target = path.resolve(__dirname, '../../config/default.json')
/* default.json
{
  "data": {
    "mode": "$env:ENVIRONMENT_PROFILE_NAME",
    "server": {
      "port": 8080
    },
    "consul": {
      "host": "$env:CONSUL_AGENT_HOST",
      "port": "$env:CONSUL_AGENT_PORT",
      "token": "***"
    }
  },
  "sources": {
    "env": {
      "pipeline": "env"
    }
  }
}
 */

export default new Config({
  data: target,
  mode: 'sync',
  pipeline: 'file>json>datatree' 
})

config.get('consul.host') // '10.10.10.10'
```

## Examples
* [vault](./examples/vault.md)
* [file-by-env](./examples/file-by-env-value.md)

## Plugins
##### Fetchers
* [uniconfig-plugin-api-http](./packages/uniconfig-plugin-api-http/README.md)
* [uniconfig-plugin-api-file](./packages/uniconfig-plugin-api-file/README.md)
* [uniconfig-plugin-env](./packages/uniconfig-plugin-env/README.md)
* [uniconfig-plugin-ip](./packages/uniconfig-plugin-ip/README.md)
* [uniconfig-plugin-pkg](./packages/uniconfig-plugin-pkg/README.md)
* [uniconfig-plugin-root](./packages/uniconfig-plugin-root/README.md)
* [uniconfig-plugin-global](./packages/uniconfig-plugin-global/README.md)
* [uniconfig-plugin-path](./packages/uniconfig-plugin-path/README.md)
* [uniconfig-plugin-argv](./packages/uniconfig-plugin-argv/README.md)
##### Parsers
* [uniconfig-plugin-json](./packages/uniconfig-plugin-json/README.md)
* [uniconfig-plugin-yaml](./packages/uniconfig-plugin-yaml/README.md)
* [uniconfig-plugin-datatree](./packages/uniconfig-plugin-datatree/README.md)
* [uniconfig-plugin-dotenv](./packages/uniconfig-plugin-dotenv/README.md)

##### Template engines
* [uniconfig-plugin-dot](./packages/uniconfig-plugin-dot/README.md)

##### Etc
* [uniconfig-plugin-ajv](./packages/uniconfig-plugin-ajv/README.md)


## API
### Migration from 1.x to 2.x
Update `sources` definitions. Replace `api` and `parser` fields with `pipeline`, and `target` with `data`.
```javascript
const before = {
  "sources": {
    "fromFile": {
      "target": "<some path>",
      "api": "file",
      "parser": "json"
    }
  }
}

const after = {
  "sources": {
    "fromFile": {
      "data": "<some path>",
      "pipeline": "file>json"
    }
  }
}
```

#### `factory`
Produces `IConfig` instance.
```javascript
import {factory} from '@qiwi/uniconfig-core'
...

const config = factory({pipeline: 'env'}) // IConfig
```

#### `addPipe`
```javascript
import {transform} from 'lodash'
import {addPipe, context} from '@qiwi/uniconfig-core'

const formatToUpper = data => transform(
  data,
  (result, value, key) => result[key.toUpperCase()] = ('' + value).toUpperCase(),
  {}
)
const pipe = {
  handleSync(data) {
    return formatToUpper(data)
  },
  handle(data) {
    return Promise.resolve(formatToUpper(data))
  }
}

addPipe('uppercase', pipe)
context.pipe.get('uppercase') // <IPipe>
```

#### `removePipe`
```javascript
removePipe('uppercase')
context.pipe.get('uppercase') // undefined
```

#### `rollupPlugin`
```javascript
import {addPipe, context} from '@qiwi/uniconfig-core'
import envPlugin from '@qiwi/uniconfig-plugin-env'

rollupPlugin(envPlugin)
context.pipe.get('env') // <IPipe>
```

#### `rollbackPlugin`
```javascript
rollbackPlugin(envPlugin)
context.pipe.get('env') // undefined
```
