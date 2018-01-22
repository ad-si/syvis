for (let index = 0; index < 100; index++) {
  console.info(index)
}


const alphabet = {first: 'a', second: 'b', third: 'c'}

for (const key in alphabet) {
  if (!alphabet.hasOwnProperty(key)) continue
  console.info(key, '=>', alphabet[key])
}


for (const value of [1, 2, 3]) {
  console.info(value)
}


let index = 0
while (index < 100) {
  console.info('one more time')
  index += 1
}


labeledStatement: {
  console.info('outer')

  inner: {
    console.info('inner')

    aLoop:
    for (let value = 0; value < 10; value++) {
      continue aLoop
    }

    if (Math.random > 0.5) break labeledStatement
    else break inner
  }

  console.info('bye (maybe)')
}


let result = ''
let doIndex = 0

do {
  result += doIndex + ' '
  doIndex += 1
}
while (doIndex < 5)

console.info(result)
