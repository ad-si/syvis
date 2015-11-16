'use strict'

const fs = require('fs')
const path = require('path')

const visualizersPath = path.join(__dirname, 'visualizers')

let visualizerNames = fs.readdirSync(path.join(__dirname, 'visualizers'))
let visualizers = {}


function commentTemplate (comment) {
	return [
		'p&',
		{class: 'comment ' + comment.type.toLowerCase()},
		comment.value.replace(/\n/g, '<br>')
	]
}

visualizerNames
	.filter(name => /.+\.js$/i.test(name))
	.forEach(name => {

		let nameInCamelCase = name
			.replace('.js', '')
			.split('-')
			.map(word => word[0].toUpperCase() + word.substr(1))
			.join('')

		visualizers[nameInCamelCase] = path.join(visualizersPath, name)
	})


function walkTree (node, fileData) {

	if (!node) {
		return ''
	}

	if (Array.isArray(node.leadingComments)) {
		if (node.leadingComments.length) {
			if (node.leadingComments.some(comment => comment.value)) {
				let comments = node.leadingComments
					.map(comment => {
						if (comment.value !== null) {
							let commentArray = commentTemplate(comment)
							comment.value = null
							return commentArray
						}
					})

				return ['div.commentedSection',
					['div.leadingComments', ...comments],
					walkTree(node)
				]
			}
		}
		else {
			delete node.leadingComments
			return walkTree(node)
		}
	}

	if (Array.isArray(node.trailingComments)) {
		if (node.loc.end.line === node.trailingComments[0].loc.end.line) {
			if (
				node.trailingComments[0].value !== null &&
				node.trailingComments[0].type === 'Line'
			) {
				let commentArray = [
					'span.trailing.comment',
					node.trailingComments[0].value.trim()
				]

				node.trailingComments[0].value = null

				return ['div.withTrailingComment',
					walkTree(node),
					commentArray
				]
			}
		}
		else {
			node.trailingComments = 'null'
			return walkTree(node)
		}
	}


	if (Array.isArray(node)) {
		return node.map(walkTree)
	}
	if (node.type === 'Program') {
		return ['section.file',
			['span.label', fileData ? fileData.name : false],
			...node.body.map(walkTree),
			Array.isArray(node.comments) ?
				['div.comments',
					...node.comments
						.filter(comment => comment.value)
						.map(comment => {
							return commentTemplate(comment)
						})
				] :
				true
		]
	}
	if (node.type === 'BlockStatement') {
		return node.body.map(walkTree)
	}


	if (visualizers[node.type]) {
		return require(visualizers[node.type])(node)
	}

	throw new Error(JSON.stringify(node))
}

module.exports = walkTree
