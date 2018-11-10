// One chaining call
'a-file.js'.toLowerCase()


// Two chaining calls
'a-file.js'
  .toLowerCase()
  .replace('.js', '')


// Several chaining calls
'a-file.js'
  .toLowerCase()
  .replace('.js', '')
  .split('-')
  .map(word => word[0].toUpperCase() + word.substr(1))
  .join('')
