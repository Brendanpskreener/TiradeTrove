const fs = require('node:fs/promises')
const { messages } = require('./chatLogs/logs.json')

const { countWords, getTirades } = require('./common/utilities')

const tally = countWords(messages)
const tirades = getTirades(messages)

//const descendingOrder = Object.entries(tally).sort(([, a], [, b]) => b - a)
console.log(tirades)
//fs.writeFile('test.json', JSON.stringify(descendingOrder, null, 2))
//fs.writeFile('tirades.json', JSON.stringify(tirades, null, 2))                                          