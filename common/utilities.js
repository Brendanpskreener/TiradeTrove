function countWords(data) {
  const tally = data.messages.reduce((accumulator, message) => {
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

    words.forEach((word) => {
      //skip empty strings
      if (!word) return
      //tally up the words
      accumulator[word] = accumulator.hasOwnProperty(word) ? accumulator[word] + 1 : 1
    })
    return accumulator
  }, {})
  return tally
}

module.exports = { countWords }