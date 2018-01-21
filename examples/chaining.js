'a-file.js'.toLowerCase()


'a-file.js'
  .toLowerCase()
  .replace('.js', '')


'a-file.js'
  .toLowerCase()
  .replace('.js', '')
  .split('-')
  .map(word => word[0].toUpperCase() + word.substr(1))
  .join('')
