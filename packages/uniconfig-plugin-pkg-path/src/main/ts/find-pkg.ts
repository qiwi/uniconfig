import {join, resolve} from 'node:path'
import {access, constants, existsSync} from 'node:fs'
import {path as ROOT} from 'app-root-path'

const checkFileExists = (s: string) => new Promise(r => access(s, constants.F_OK, e => r(!e)))

export const findClosestPkg = async(dirPath = __dirname) => {
  let currentPath = dirPath
  console.error(3333, process.cwd(), resolve())
  while (true) {
    const iExistFile = await checkFileExists(join(currentPath, 'package.json'))
    if (!iExistFile) {
      currentPath = join(currentPath, '../.')
    }
    else break
    if (currentPath === ROOT) {
      return
    }
  }
  return currentPath
}

export const findClosestPkgSync = (dirPath = __dirname) => {
  let currentPath = dirPath
  while (true) {
    if (!existsSync(join(currentPath, 'package.json'))) {
      currentPath = join(currentPath, '../.')
    }
    else break
    if (currentPath === ROOT) {
      return
    }
  }
  return currentPath
}
