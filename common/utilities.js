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
  const tirades = messages.reduce((accumulator, currentMessage, currentIndex, array) => {
    const fromMe = currentMessage.from === 'Brendan Schreiner'
    const plainText = !Array.isArray(currentMessage.text)
    const hasLength = currentMessage.text.length
    const previousMessage = array[currentIndex - 1]
    // const sameAuthor = currentMessage.from === previousMessage?.from
    const withinTimeframe = currentMessage.date_unixtime - previousMessage?.date_unixtime <= 60

    //prev and curr message must be within 60(?) seconds of each other
    if (fromMe && plainText && hasLength && withinTimeframe) {
      const date = new Date(currentMessage.date).toDateString()
      const message = currentMessage.text
      //accumulator[date] = accumulator[date] ? accumulator[date].push(message) : [message]
      if (accumulator[date]) {
        accumulator[date].push(message)
      } else {
        accumulator[date] = [message]
      }
    }

    return accumulator
  }, {})
  return tirades
}

module.exports = { countWords, getTirades }