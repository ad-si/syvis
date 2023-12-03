export const ifElse = `
const value = 5

if (value < 2) {
  console.info("Smaller")
}
else if (value === 2){
  console.info("Just right!")
}
else {
  console.info("Larger")
}
`

export const addFunction = `
// A simple add function
function add (x, y) {
  return x + y
}
`

export const chaining = `
// Chaining several methods
"a-file.js"
  .toLowerCase()
  .replace(".js", "")
  .split("-")
  .map((word) => word[0].toUpperCase() + word.substr(1))
  .join("")
`

export const loops = `
// Different types of loops

// A simple for loop
for (let index = 0; index < 100; index++) {
  console.info(index)
}

const alphabet = { first: "a", second: "b", third: "c" }

// A for-in loop
for (const key in alphabet) {
  if (!alphabet.hasOwnProperty(key)) continue
  console.info(key, "=>", alphabet[key])
}

// A for-of loop
for (const value of [1, 2, 3]) {
  console.info(value)
}

// A while loop
let index = 0
while (index < 100) {
  console.info("one more time")
  index += 1
}
`
