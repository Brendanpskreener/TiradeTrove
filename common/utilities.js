const { removeStopwords } = require('stopword')

const lameWords = require('./words')

function countWords(messages) {
  const tally = messages.reduce((accumulator, message) => {
    const notFromMe = message.from !== 'Brendan Schreiner'
    const notPlainText = Array.isArray(message.text)
    const noLength = !message.text.length

    //if true, skip them, we dont care
    if (notFromMe || notPlainText || noLength) return accumulator

    const [textEntity] = message.text_entities
    const regex = /[!\?"\.\\\-\+\n\/\&\*\@\#\$\%\^\(\)\{\}\~\,\:\;\=\_\ಥ\<\>]/g

    const words = textEntity.text.toLowerCase()
      .replace(regex, ' ')
      .split(" ")

    const interestingWords = removeStopwords(words, lameWords)

    interestingWords.forEach((word) => {
      //skip empty strings
      if (!word) return
      //tally up the words
      accumulator[word] = accumulator.hasOwnProperty(word) ? accumulator[word] + 1 : 1
    })
    return accumulator
  }, {})
  return tally
}

function getTirades(messages) {
  const tirades = messages
    .filter((message, index, array) => {
      const fromMe = message.from === 'Brendan Schreiner'
      const plainText = !Array.isArray(message.text)
      const hasLength = message.text.length
      const previousMessage = array[index - 1]
      const withinTimeframe = message.date_unixtime - previousMessage?.date_unixtime <= 60
      // const sameAuthor = currentMessage.from === previousMessage?.from

      //previous and current message must be within 60(?) seconds of each other
      return fromMe && plainText && hasLength && withinTimeframe
    })
    .reduce((accumulator, currentMessage) => {
      const date = new Date(currentMessage.date).toDateString()
      if (!accumulator[date]) {
        accumulator[date] = []
      }
      accumulator[date].push(currentMessage.text)
      return accumulator
    }, {})
  return tirades
}

module.exports = { countWords, getTirades }