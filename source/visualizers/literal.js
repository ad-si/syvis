const walkTree = require('../walkTree')

module.exports = (node) => [
	'span',
	node.regex ?
		String(node.value) :
		JSON
			.stringify(node.value)
			.replace(/^"(.*)"$/, '$1'),
	{
		class: 'literal' +
			(node.regex ? ' regex' :  ' ' + typeof node.value) +
			(node.value === true ? ' true' : '') +
			(node.value === false ? ' false' : '')
	}
]
