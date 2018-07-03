// @flow

import type {IAny} from '../interface'

import {echo} from '../core/util'
import json from './json'
import yaml from './yaml'
import uniconfig from './uniconfig'
import detector from './detector'

export {
  echo,
  json,
  yaml,
  uniconfig,
  detector
}

export default function (data: IAny, type: string): void {}
