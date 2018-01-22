// Empty return

function getDescriptionBroken (name, features) {
  return
    `This is the description of product ${name}.
    It's features are: ${features.join()}`
}

function getDescriptionFixed (name, features) {
  return `This is the description of product ${name}.
    It's features are: ${features.join()}`
}


// Empty loop

broken:
for (let item of [1, 2, 3]);
  console.info(item);

fixed:
for (let item of [1, 2, 3])
  console.info(item);


// Incorrect precedence

const broken = 3 + 4 * 5
const fixed = (3 + 4) * 5
