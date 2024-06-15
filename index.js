//const fs = require('node:fs/promises')
const data = require('./chatLogs/logs.json')

const { countWords } = require('./common/utilities')

const tally = countWords(data)

const descendingOrder = Object.entries(tally).sort(([, a], [, b]) => b - a)
console.log(descendingOrder)
//fs.writeFile('test.json', JSON.stringify(descendingOrder, null, 2))