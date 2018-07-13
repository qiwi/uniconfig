const path = require('path')
const exec = require('child_process').execSync;

const DECREMENT = path.resolve(__dirname, './decrement.sh')
const DROP_TAG = path.resolve(__dirname, './drop_last_tag.sh')

console.log('release-hooks [process.env]: ', process.env)

const total = +process.env.RH_TOTAL
let count = +process.env.RH_COUNT

console.log('release-hooks: current path is ' + __dirname)
if (count > 0) {
  try {
    if (count !== total) {
      console.log('release-hooks: drop tag')

      exec(`cd ../..`)
      exec(`sh ${DROP_TAG}`)
      exec(`cd ${__dirname}`)
    }
    exec(`source ${DECREMENT}`, {stdio:['inherit','pipe','pipe']})
    count -= 1

  } catch (err) {
    console.log('release-hooks [error]: ', err)
  }
}
const isLastPack = count < 1

console.log('release-hooks: packs left: ', count)
console.log('release-hooks: is the last pack releasing: ', !!isLastPack)

module.exports = isLastPack
