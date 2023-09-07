import unicore, {rollupPlugin} from '@qiwi/uniconfig-core'
import ajvPlugin from '@qiwi/uniconfig-plugin-ajv'
import apiFilePlugin from '@qiwi/uniconfig-plugin-api-file'
import apiHttpPlugin from '@qiwi/uniconfig-plugin-api-http'
import argvPlugin from '@qiwi/uniconfig-plugin-argv'
import datatreePlugin from '@qiwi/uniconfig-plugin-datatree'
import dotPlugin from '@qiwi/uniconfig-plugin-dot'
import dotenvPlugin from '@qiwi/uniconfig-plugin-dotenv'
import envPlugin from '@qiwi/uniconfig-plugin-env'
import globalPlugin from '@qiwi/uniconfig-plugin-global'
import ipPlugin from '@qiwi/uniconfig-plugin-ip'
import jsonPlugin from '@qiwi/uniconfig-plugin-json'
import pathPlugin from '@qiwi/uniconfig-plugin-path'
import pkgPlugin from '@qiwi/uniconfig-plugin-pkg'
import rootPlugin from '@qiwi/uniconfig-plugin-root'
import yamlPlugin from '@qiwi/uniconfig-plugin-yaml'
import pkgPathPlugin from '@qiwi/uniconfig-plugin-pkg-path'

rollupPlugin(ajvPlugin)
rollupPlugin(apiFilePlugin)
rollupPlugin(apiHttpPlugin)
rollupPlugin(argvPlugin)
rollupPlugin(datatreePlugin)
rollupPlugin(dotPlugin)
rollupPlugin(dotenvPlugin)
rollupPlugin(envPlugin)
rollupPlugin(globalPlugin)
rollupPlugin(ipPlugin)
rollupPlugin(jsonPlugin)
rollupPlugin(pathPlugin)
rollupPlugin(pkgPlugin)
rollupPlugin(rootPlugin)
rollupPlugin(yamlPlugin)
rollupPlugin(pkgPathPlugin)

export * from '@qiwi/uniconfig-core'
export default unicore
