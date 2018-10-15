# uniconfig

[![buildStatus](https://img.shields.io/travis/qiwi/uniconfig.svg?maxAge=3600&branch=master)](https://travis-ci.com/qiwi/uniconfig)
[![Coveralls](https://img.shields.io/coveralls/qiwi/uniconfig.svg?maxAge=3600)](https://coveralls.io/github/qiwi/uniconfig)
[![dependencyStatus](https://img.shields.io/david/qiwi/uniconfig.svg?maxAge=3600)](https://david-dm.org/qiwi/uniconfig)
[![devDependencyStatus](https://img.shields.io/david/dev/qiwi/uniconfig.svg?maxAge=3600)](https://david-dm.org/qiwi/uniconfig)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/qiwi/uniconfig)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Greenkeeper badge](https://badges.greenkeeper.io/qiwi/uniconfig.svg)](https://greenkeeper.io/)

Yet another one config processor. Weird. Slow. Our own.

## Install
```javascript
    npm i @qiwi/uniconfig
    yarn add @qiwi/uniconfig
```

## Concept
Config is just a piece of `data` with getters. The `data` is obtained from `ISource` in some way and processed with `IReader` and `IProcessor` respectively.
These operations form the `pipeline`.

## Features
* Declarative definitions
* Multiple source composition
* Modular design
* Ease extensibility

## API
### Library exports
#### `factory`
Produces `IUniconfig` instance.

#### `addPipe`
```javascript
import {transform} from 'lodash-es'
import {addPipe} from '@qiwi/uniconfig-core'

const pipe = data => transform(
  data,
  (result, value, key) => result[key.toUpperCase()] = ('' + value).toUpperCase(),
  {}
)
```
#### `removePipe`
#### `addPlugin`
#### `removePlugin`

### IUniconfig

