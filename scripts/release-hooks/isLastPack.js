const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;

const TOTAL = path.resolve(__dirname, './total.tmp')
const COUNT = path.resolve(__dirname, './count.tmp')
const DECREMENT = path.resolve(__dirname, './decrement.sh')
const DROP_TAG = path.resolve(__dirname, './drop_last_tag.sh')

const total = JSON.parse(fs.readFileSync(TOTAL))
let count = JSON.parse(fs.readFileSync(COUNT))

console.log('release-hooks: current path is ' + __dirname)
if (count > 0) {
  if (count !== total) {
    console.log('release-hooks: drop tag')

    exec(`cd ../..`)
    exec(`sh ${DROP_TAG}`)
    exec(`cd ${__dirname}`)
  }
  exec(`sh ${DECREMENT}`)
  count -= 1
}
const isLastPack = count < 1

console.log('release-hooks: packs left: ', count)
console.log('release-hooks: is the last pack releasing: ', !!isLastPack)

module.exports = isLastPack
