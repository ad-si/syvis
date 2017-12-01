/* eslint-disable no-unused-vars, quotes */

const integer = 123
const float = 123.456
const notANumber = NaN
const emptyString = ''
const string = 'This is a string'
const templateString = `This is also just a string`
const templateWithExpressions = `This is a ${'VE' + 'RY'} special string`
const taggedTemplateString = String.raw `Also ${'VE' + 'RY'} special`
const regex = /[0-9]{4}-([a-z]{5})?/gi
const boolean = true
const infinity = Infinity
const undefinedValue = undefined
const nullValue = null
const voidValue = void 0
const typeofValue = typeof 0
const date = new Date('2017-11-29')

const object = {
  key1: 'and value',
  key2: 'another value',
  "string key": 'should look the same',
}
const array = [
  'item 1',
  'item 2',
  'item 3',
]

const arrowFunction = xValue =>
  xValue * xValue
const arrayPattern = ([xValue, yValue]) =>
  xValue + yValue
