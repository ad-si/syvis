module.exports = (expression) => {
	if (expression.type === 'AssignmentExpression') {
		return ['section.assignmentExpression',
			['span.left', walkTree(expression.left)],
			['span.assignment'],
			['span.right', walkTree(expression.right)]
		]
	}
	else {
		return ['p', expression.type]
	}
}
