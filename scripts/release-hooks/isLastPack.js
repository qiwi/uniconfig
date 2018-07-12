const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec;

const COUNT = path.resolve(__dirname, './count.tmp')
const DECREMENT = path.resolve(__dirname, './decrement.sh')

let count = JSON.parse(fs.readFileSync(COUNT))

if (count > 0) {
  exec(`sh ${DECREMENT}`)
  count -= 1
}
const isLastPack = count < 1

console.log('release-hooks: packs left: ', count)
console.log('release-hooks: is the last pack releasing: ', isLastPack)

module.exports = isLastPack
