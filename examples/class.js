class Test extends Date {
  constructor () {
    super()
    this.test = 123
  }

  doSomething () {
    return 'something'
  }

  static doSomethingElse () {
    const name = "John Doe"
    return name
  }

  get something () {
    return this.value
  }
  set something (value) {
    this.value = value
  }
}

const test = function (argument1, argument2) {
  const name = "John Doe"
  return name
}

const test = (argument1, argument2, argument3, argument4) => {
  const name = "John Doe"
  return name
}
