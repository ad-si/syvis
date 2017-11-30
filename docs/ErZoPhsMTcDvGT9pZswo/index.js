require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"../walkTree":[function(require,module,exports){
(function (__dirname){

const path = require('path')

const visualizersPath = path.join(__dirname, 'visualizers')

const visualizerNames = [".DS_Store","array-expression.js","array-pattern.js","arrow-function-expression.js","assignment-expression.js","assignment-pattern.js","await-expression.js","binary-expression.js","break-statement.js","call-expression.js","catch-clause.js","class-body.js","class-declaration.js","class-expression.js","conditional-expression.js","expression-statement.js","for-of-statement.js","for-statement.js","function-declaration.js","function-expression.js","identifier.js","if-statement.js","literal.js","logical-expression.js","member-expression.js","method-definition.js","new-expression.js","object-expression.js","object-pattern.js","property-comment.js","property.js","return-statement.js","spread-element.js","super.js","template-element.js","template-literal.js","this-expression.js","throw-statement.js","try-statement.js","unary-expression.js","update-expression.js","variable-declaration.js","variable-declarator.js","while-statement.js"]

const visualizers = {}
visualizerNames
  .filter(name => /.+\.js$/i.test(name))
  .forEach(name => {

    const nameInCamelCase = name
      .replace('.js', '')
      .split('-')
      .map(capitalize)
      .join('')

    visualizers[nameInCamelCase] = path.join(visualizersPath, name)
  })


function capitalize (word) {
  return word[0].toUpperCase() + word.substr(1)
}


function hasLeadingComments (element) {
  return element.hasOwnProperty('leadingComments')
}


function commentTemplate (comment) {
  return [
    'p&',
    {class: 'comment ' + comment.type.toLowerCase()},
    comment.value.replace(/\n/g, '<br>'),
  ]
}


function walkTree (node, fileData) {
  if (!node || (Array.isArray(node) && !node.length)) {
    return ''
  }

  // Convert comments in objects to a table friendly format
  if (
      node.type === 'ObjectExpression' &&
      node.properties.some(hasLeadingComments)
    ) {

    node.properties.forEach((property, propertyIndex) => {
      if (!hasLeadingComments(property)) return

      node.properties.splice(
        propertyIndex,
        0,
        property.leadingComments.map(comment => ({
          type: 'PropertyComment',
          value: comment.value,
        }))
      )
      delete property.leadingComments
    })
  }


  if (Array.isArray(node.leadingComments)) {
    if (node.leadingComments.length) {
      if (node.leadingComments.some(comment => comment.value)) {
        const comments = node.leadingComments
          .map(comment => {
            if (comment.value === null) return ''
            const commentArray = commentTemplate(comment)
            comment.value = null
            return commentArray
          })

        return ['.commentedSection',
          ['.leadingComments', ...comments],
          walkTree(node, fileData),
        ]
      }
    }
    else {
      delete node.leadingComments
      return walkTree(node, fileData)
    }
  }

  if (Array.isArray(node.trailingComments)) {
    if (node.loc.end.line === node.trailingComments[0].loc.end.line) {
      if (
        node.trailingComments[0].value !== null &&
        node.trailingComments[0].type === 'Line'
      ) {
        const commentArray = [
          'span.trailing.comment',
          node.trailingComments[0].value.trim(),
        ]

        node.trailingComments[0].value = null

        return ['.withTrailingComment',
          walkTree(node, fileData),
          commentArray,
        ]
      }
    }
    else {
      node.trailingComments = 'null'
      return walkTree(node, fileData)
    }
  }


  if (Array.isArray(node) && node.length) {
    return node.map(walkTree)
  }

  if (node.type === 'Program') {
    let shebang = ''

    if (fileData.shebang) {
      shebang = ['.shebang', fileData.shebang]
    }

    return ['section.file',
      shebang,
      ['span.label', fileData ? fileData.name : false],
      ...node.body.map(walkTree),
      Array.isArray(node.comments)
        ? [
          '.comments',
          ...node.comments
            .filter(comment => comment.value)
            .map(comment => {
              return commentTemplate(comment)
            }),
        ]
        : true,
    ]
  }

  if (node.type === 'BlockStatement') {
    if (node.body.length) {
      return node.body.map(walkTree)
    }
    else {
      return ''
    }
  }


  if (visualizers[node.type]) {
    return require(visualizers[node.type])(node)
  }
  else {
    return ['p.error', node.type]
  }
}

module.exports = walkTree



}).call(this,"/source")

},{"path":2}],1:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
/* istanbul ignore next */
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
/* istanbul ignore next */
	else if(typeof exports === 'object')
		exports["esprima"] = factory();
	else
		root["esprima"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/* istanbul ignore if */
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	  Copyright JS Foundation and other contributors, https://js.foundation/

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	var comment_handler_1 = __webpack_require__(1);
	var jsx_parser_1 = __webpack_require__(3);
	var parser_1 = __webpack_require__(8);
	var tokenizer_1 = __webpack_require__(15);
	function parse(code, options, delegate) {
	    var commentHandler = null;
	    var proxyDelegate = function (node, metadata) {
	        if (delegate) {
	            delegate(node, metadata);
	        }
	        if (commentHandler) {
	            commentHandler.visit(node, metadata);
	        }
	    };
	    var parserDelegate = (typeof delegate === 'function') ? proxyDelegate : null;
	    var collectComment = false;
	    if (options) {
	        collectComment = (typeof options.comment === 'boolean' && options.comment);
	        var attachComment = (typeof options.attachComment === 'boolean' && options.attachComment);
	        if (collectComment || attachComment) {
	            commentHandler = new comment_handler_1.CommentHandler();
	            commentHandler.attach = attachComment;
	            options.comment = true;
	            parserDelegate = proxyDelegate;
	        }
	    }
	    var isModule = false;
	    if (options && typeof options.sourceType === 'string') {
	        isModule = (options.sourceType === 'module');
	    }
	    var parser;
	    if (options && typeof options.jsx === 'boolean' && options.jsx) {
	        parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
	    }
	    else {
	        parser = new parser_1.Parser(code, options, parserDelegate);
	    }
	    var program = isModule ? parser.parseModule() : parser.parseScript();
	    var ast = program;
	    if (collectComment && commentHandler) {
	        ast.comments = commentHandler.comments;
	    }
	    if (parser.config.tokens) {
	        ast.tokens = parser.tokens;
	    }
	    if (parser.config.tolerant) {
	        ast.errors = parser.errorHandler.errors;
	    }
	    return ast;
	}
	exports.parse = parse;
	function parseModule(code, options, delegate) {
	    var parsingOptions = options || {};
	    parsingOptions.sourceType = 'module';
	    return parse(code, parsingOptions, delegate);
	}
	exports.parseModule = parseModule;
	function parseScript(code, options, delegate) {
	    var parsingOptions = options || {};
	    parsingOptions.sourceType = 'script';
	    return parse(code, parsingOptions, delegate);
	}
	exports.parseScript = parseScript;
	function tokenize(code, options, delegate) {
	    var tokenizer = new tokenizer_1.Tokenizer(code, options);
	    var tokens;
	    tokens = [];
	    try {
	        while (true) {
	            var token = tokenizer.getNextToken();
	            if (!token) {
	                break;
	            }
	            if (delegate) {
	                token = delegate(token);
	            }
	            tokens.push(token);
	        }
	    }
	    catch (e) {
	        tokenizer.errorHandler.tolerate(e);
	    }
	    if (tokenizer.errorHandler.tolerant) {
	        tokens.errors = tokenizer.errors();
	    }
	    return tokens;
	}
	exports.tokenize = tokenize;
	var syntax_1 = __webpack_require__(2);
	exports.Syntax = syntax_1.Syntax;
	// Sync with *.json manifests.
	exports.version = '4.0.0';


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var syntax_1 = __webpack_require__(2);
	var CommentHandler = (function () {
	    function CommentHandler() {
	        this.attach = false;
	        this.comments = [];
	        this.stack = [];
	        this.leading = [];
	        this.trailing = [];
	    }
	    CommentHandler.prototype.insertInnerComments = function (node, metadata) {
	        //  innnerComments for properties empty block
	        //  `function a() {/** comments **\/}`
	        if (node.type === syntax_1.Syntax.BlockStatement && node.body.length === 0) {
	            var innerComments = [];
	            for (var i = this.leading.length - 1; i >= 0; --i) {
	                var entry = this.leading[i];
	                if (metadata.end.offset >= entry.start) {
	                    innerComments.unshift(entry.comment);
	                    this.leading.splice(i, 1);
	                    this.trailing.splice(i, 1);
	                }
	            }
	            if (innerComments.length) {
	                node.innerComments = innerComments;
	            }
	        }
	    };
	    CommentHandler.prototype.findTrailingComments = function (metadata) {
	        var trailingComments = [];
	        if (this.trailing.length > 0) {
	            for (var i = this.trailing.length - 1; i >= 0; --i) {
	                var entry_1 = this.trailing[i];
	                if (entry_1.start >= metadata.end.offset) {
	                    trailingComments.unshift(entry_1.comment);
	                }
	            }
	            this.trailing.length = 0;
	            return trailingComments;
	        }
	        var entry = this.stack[this.stack.length - 1];
	        if (entry && entry.node.trailingComments) {
	            var firstComment = entry.node.trailingComments[0];
	            if (firstComment && firstComment.range[0] >= metadata.end.offset) {
	                trailingComments = entry.node.trailingComments;
	                delete entry.node.trailingComments;
	            }
	        }
	        return trailingComments;
	    };
	    CommentHandler.prototype.findLeadingComments = function (metadata) {
	        var leadingComments = [];
	        var target;
	        while (this.stack.length > 0) {
	            var entry = this.stack[this.stack.length - 1];
	            if (entry && entry.start >= metadata.start.offset) {
	                target = entry.node;
	                this.stack.pop();
	            }
	            else {
	                break;
	            }
	        }
	        if (target) {
	            var count = target.leadingComments ? target.leadingComments.length : 0;
	            for (var i = count - 1; i >= 0; --i) {
	                var comment = target.leadingComments[i];
	                if (comment.range[1] <= metadata.start.offset) {
	                    leadingComments.unshift(comment);
	                    target.leadingComments.splice(i, 1);
	                }
	            }
	            if (target.leadingComments && target.leadingComments.length === 0) {
	                delete target.leadingComments;
	            }
	            return leadingComments;
	        }
	        for (var i = this.leading.length - 1; i >= 0; --i) {
	            var entry = this.leading[i];
	            if (entry.start <= metadata.start.offset) {
	                leadingComments.unshift(entry.comment);
	                this.leading.splice(i, 1);
	            }
	        }
	        return leadingComments;
	    };
	    CommentHandler.prototype.visitNode = function (node, metadata) {
	        if (node.type === syntax_1.Syntax.Program && node.body.length > 0) {
	            return;
	        }
	        this.insertInnerComments(node, metadata);
	        var trailingComments = this.findTrailingComments(metadata);
	        var leadingComments = this.findLeadingComments(metadata);
	        if (leadingComments.length > 0) {
	            node.leadingComments = leadingComments;
	        }
	        if (trailingComments.length > 0) {
	            node.trailingComments = trailingComments;
	        }
	        this.stack.push({
	            node: node,
	            start: metadata.start.offset
	        });
	    };
	    CommentHandler.prototype.visitComment = function (node, metadata) {
	        var type = (node.type[0] === 'L') ? 'Line' : 'Block';
	        var comment = {
	            type: type,
	            value: node.value
	        };
	        if (node.range) {
	            comment.range = node.range;
	        }
	        if (node.loc) {
	            comment.loc = node.loc;
	        }
	        this.comments.push(comment);
	        if (this.attach) {
	            var entry = {
	                comment: {
	                    type: type,
	                    value: node.value,
	                    range: [metadata.start.offset, metadata.end.offset]
	                },
	                start: metadata.start.offset
	            };
	            if (node.loc) {
	                entry.comment.loc = node.loc;
	            }
	            node.type = type;
	            this.leading.push(entry);
	            this.trailing.push(entry);
	        }
	    };
	    CommentHandler.prototype.visit = function (node, metadata) {
	        if (node.type === 'LineComment') {
	            this.visitComment(node, metadata);
	        }
	        else if (node.type === 'BlockComment') {
	            this.visitComment(node, metadata);
	        }
	        else if (this.attach) {
	            this.visitNode(node, metadata);
	        }
	    };
	    return CommentHandler;
	}());
	exports.CommentHandler = CommentHandler;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Syntax = {
	    AssignmentExpression: 'AssignmentExpression',
	    AssignmentPattern: 'AssignmentPattern',
	    ArrayExpression: 'ArrayExpression',
	    ArrayPattern: 'ArrayPattern',
	    ArrowFunctionExpression: 'ArrowFunctionExpression',
	    AwaitExpression: 'AwaitExpression',
	    BlockStatement: 'BlockStatement',
	    BinaryExpression: 'BinaryExpression',
	    BreakStatement: 'BreakStatement',
	    CallExpression: 'CallExpression',
	    CatchClause: 'CatchClause',
	    ClassBody: 'ClassBody',
	    ClassDeclaration: 'ClassDeclaration',
	    ClassExpression: 'ClassExpression',
	    ConditionalExpression: 'ConditionalExpression',
	    ContinueStatement: 'ContinueStatement',
	    DoWhileStatement: 'DoWhileStatement',
	    DebuggerStatement: 'DebuggerStatement',
	    EmptyStatement: 'EmptyStatement',
	    ExportAllDeclaration: 'ExportAllDeclaration',
	    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
	    ExportNamedDeclaration: 'ExportNamedDeclaration',
	    ExportSpecifier: 'ExportSpecifier',
	    ExpressionStatement: 'ExpressionStatement',
	    ForStatement: 'ForStatement',
	    ForOfStatement: 'ForOfStatement',
	    ForInStatement: 'ForInStatement',
	    FunctionDeclaration: 'FunctionDeclaration',
	    FunctionExpression: 'FunctionExpression',
	    Identifier: 'Identifier',
	    IfStatement: 'IfStatement',
	    ImportDeclaration: 'ImportDeclaration',
	    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	    ImportSpecifier: 'ImportSpecifier',
	    Literal: 'Literal',
	    LabeledStatement: 'LabeledStatement',
	    LogicalExpression: 'LogicalExpression',
	    MemberExpression: 'MemberExpression',
	    MetaProperty: 'MetaProperty',
	    MethodDefinition: 'MethodDefinition',
	    NewExpression: 'NewExpression',
	    ObjectExpression: 'ObjectExpression',
	    ObjectPattern: 'ObjectPattern',
	    Program: 'Program',
	    Property: 'Property',
	    RestElement: 'RestElement',
	    ReturnStatement: 'ReturnStatement',
	    SequenceExpression: 'SequenceExpression',
	    SpreadElement: 'SpreadElement',
	    Super: 'Super',
	    SwitchCase: 'SwitchCase',
	    SwitchStatement: 'SwitchStatement',
	    TaggedTemplateExpression: 'TaggedTemplateExpression',
	    TemplateElement: 'TemplateElement',
	    TemplateLiteral: 'TemplateLiteral',
	    ThisExpression: 'ThisExpression',
	    ThrowStatement: 'ThrowStatement',
	    TryStatement: 'TryStatement',
	    UnaryExpression: 'UnaryExpression',
	    UpdateExpression: 'UpdateExpression',
	    VariableDeclaration: 'VariableDeclaration',
	    VariableDeclarator: 'VariableDeclarator',
	    WhileStatement: 'WhileStatement',
	    WithStatement: 'WithStatement',
	    YieldExpression: 'YieldExpression'
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
/* istanbul ignore next */
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var character_1 = __webpack_require__(4);
	var JSXNode = __webpack_require__(5);
	var jsx_syntax_1 = __webpack_require__(6);
	var Node = __webpack_require__(7);
	var parser_1 = __webpack_require__(8);
	var token_1 = __webpack_require__(13);
	var xhtml_entities_1 = __webpack_require__(14);
	token_1.TokenName[100 /* Identifier */] = 'JSXIdentifier';
	token_1.TokenName[101 /* Text */] = 'JSXText';
	// Fully qualified element name, e.g. <svg:path> returns "svg:path"
	function getQualifiedElementName(elementName) {
	    var qualifiedName;
	    switch (elementName.type) {
	        case jsx_syntax_1.JSXSyntax.JSXIdentifier:
	            var id = elementName;
	            qualifiedName = id.name;
	            break;
	        case jsx_syntax_1.JSXSyntax.JSXNamespacedName:
	            var ns = elementName;
	            qualifiedName = getQualifiedElementName(ns.namespace) + ':' +
	                getQualifiedElementName(ns.name);
	            break;
	        case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
	            var expr = elementName;
	            qualifiedName = getQualifiedElementName(expr.object) + '.' +
	                getQualifiedElementName(expr.property);
	            break;
	        /* istanbul ignore next */
	        default:
	            break;
	    }
	    return qualifiedName;
	}
	var JSXParser = (function (_super) {
	    __extends(JSXParser, _super);
	    function JSXParser(code, options, delegate) {
	        return _super.call(this, code, options, delegate) || this;
	    }
	    JSXParser.prototype.parsePrimaryExpression = function () {
	        return this.match('<') ? this.parseJSXRoot() : _super.prototype.parsePrimaryExpression.call(this);
	    };
	    JSXParser.prototype.startJSX = function () {
	        // Unwind the scanner before the lookahead token.
	        this.scanner.index = this.startMarker.index;
	        this.scanner.lineNumber = this.startMarker.line;
	        this.scanner.lineStart = this.startMarker.index - this.startMarker.column;
	    };
	    JSXParser.prototype.finishJSX = function () {
	        // Prime the next lookahead.
	        this.nextToken();
	    };
	    JSXParser.prototype.reenterJSX = function () {
	        this.startJSX();
	        this.expectJSX('}');
	        // Pop the closing '}' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	    };
	    JSXParser.prototype.createJSXNode = function () {
	        this.collectComments();
	        return {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    };
	    JSXParser.prototype.createJSXChildNode = function () {
	        return {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    };
	    JSXParser.prototype.scanXHTMLEntity = function (quote) {
	        var result = '&';
	        var valid = true;
	        var terminated = false;
	        var numeric = false;
	        var hex = false;
	        while (!this.scanner.eof() && valid && !terminated) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === quote) {
	                break;
	            }
	            terminated = (ch === ';');
	            result += ch;
	            ++this.scanner.index;
	            if (!terminated) {
	                switch (result.length) {
	                    case 2:
	                        // e.g. '&#123;'
	                        numeric = (ch === '#');
	                        break;
	                    case 3:
	                        if (numeric) {
	                            // e.g. '&#x41;'
	                            hex = (ch === 'x');
	                            valid = hex || character_1.Character.isDecimalDigit(ch.charCodeAt(0));
	                            numeric = numeric && !hex;
	                        }
	                        break;
	                    default:
	                        valid = valid && !(numeric && !character_1.Character.isDecimalDigit(ch.charCodeAt(0)));
	                        valid = valid && !(hex && !character_1.Character.isHexDigit(ch.charCodeAt(0)));
	                        break;
	                }
	            }
	        }
	        if (valid && terminated && result.length > 2) {
	            // e.g. '&#x41;' becomes just '#x41'
	            var str = result.substr(1, result.length - 2);
	            if (numeric && str.length > 1) {
	                result = String.fromCharCode(parseInt(str.substr(1), 10));
	            }
	            else if (hex && str.length > 2) {
	                result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
	            }
	            else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
	                result = xhtml_entities_1.XHTMLEntities[str];
	            }
	        }
	        return result;
	    };
	    // Scan the next JSX token. This replaces Scanner#lex when in JSX mode.
	    JSXParser.prototype.lexJSX = function () {
	        var cp = this.scanner.source.charCodeAt(this.scanner.index);
	        // < > / : = { }
	        if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
	            var value = this.scanner.source[this.scanner.index++];
	            return {
	                type: 7 /* Punctuator */,
	                value: value,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: this.scanner.index - 1,
	                end: this.scanner.index
	            };
	        }
	        // " '
	        if (cp === 34 || cp === 39) {
	            var start = this.scanner.index;
	            var quote = this.scanner.source[this.scanner.index++];
	            var str = '';
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source[this.scanner.index++];
	                if (ch === quote) {
	                    break;
	                }
	                else if (ch === '&') {
	                    str += this.scanXHTMLEntity(quote);
	                }
	                else {
	                    str += ch;
	                }
	            }
	            return {
	                type: 8 /* StringLiteral */,
	                value: str,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // ... or .
	        if (cp === 46) {
	            var n1 = this.scanner.source.charCodeAt(this.scanner.index + 1);
	            var n2 = this.scanner.source.charCodeAt(this.scanner.index + 2);
	            var value = (n1 === 46 && n2 === 46) ? '...' : '.';
	            var start = this.scanner.index;
	            this.scanner.index += value.length;
	            return {
	                type: 7 /* Punctuator */,
	                value: value,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // `
	        if (cp === 96) {
	            // Only placeholder, since it will be rescanned as a real assignment expression.
	            return {
	                type: 10 /* Template */,
	                value: '',
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: this.scanner.index,
	                end: this.scanner.index
	            };
	        }
	        // Identifer can not contain backslash (char code 92).
	        if (character_1.Character.isIdentifierStart(cp) && (cp !== 92)) {
	            var start = this.scanner.index;
	            ++this.scanner.index;
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source.charCodeAt(this.scanner.index);
	                if (character_1.Character.isIdentifierPart(ch) && (ch !== 92)) {
	                    ++this.scanner.index;
	                }
	                else if (ch === 45) {
	                    // Hyphen (char code 45) can be part of an identifier.
	                    ++this.scanner.index;
	                }
	                else {
	                    break;
	                }
	            }
	            var id = this.scanner.source.slice(start, this.scanner.index);
	            return {
	                type: 100 /* Identifier */,
	                value: id,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        return this.scanner.lex();
	    };
	    JSXParser.prototype.nextJSXToken = function () {
	        this.collectComments();
	        this.startMarker.index = this.scanner.index;
	        this.startMarker.line = this.scanner.lineNumber;
	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        var token = this.lexJSX();
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        if (this.config.tokens) {
	            this.tokens.push(this.convertToken(token));
	        }
	        return token;
	    };
	    JSXParser.prototype.nextJSXText = function () {
	        this.startMarker.index = this.scanner.index;
	        this.startMarker.line = this.scanner.lineNumber;
	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        var start = this.scanner.index;
	        var text = '';
	        while (!this.scanner.eof()) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === '{' || ch === '<') {
	                break;
	            }
	            ++this.scanner.index;
	            text += ch;
	            if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                ++this.scanner.lineNumber;
	                if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
	                    ++this.scanner.index;
	                }
	                this.scanner.lineStart = this.scanner.index;
	            }
	        }
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        var token = {
	            type: 101 /* Text */,
	            value: text,
	            lineNumber: this.scanner.lineNumber,
	            lineStart: this.scanner.lineStart,
	            start: start,
	            end: this.scanner.index
	        };
	        if ((text.length > 0) && this.config.tokens) {
	            this.tokens.push(this.convertToken(token));
	        }
	        return token;
	    };
	    JSXParser.prototype.peekJSXToken = function () {
	        var state = this.scanner.saveState();
	        this.scanner.scanComments();
	        var next = this.lexJSX();
	        this.scanner.restoreState(state);
	        return next;
	    };
	    // Expect the next JSX token to match the specified punctuator.
	    // If not, an exception will be thrown.
	    JSXParser.prototype.expectJSX = function (value) {
	        var token = this.nextJSXToken();
	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Return true if the next JSX token matches the specified punctuator.
	    JSXParser.prototype.matchJSX = function (value) {
	        var next = this.peekJSXToken();
	        return next.type === 7 /* Punctuator */ && next.value === value;
	    };
	    JSXParser.prototype.parseJSXIdentifier = function () {
	        var node = this.createJSXNode();
	        var token = this.nextJSXToken();
	        if (token.type !== 100 /* Identifier */) {
	            this.throwUnexpectedToken(token);
	        }
	        return this.finalize(node, new JSXNode.JSXIdentifier(token.value));
	    };
	    JSXParser.prototype.parseJSXElementName = function () {
	        var node = this.createJSXNode();
	        var elementName = this.parseJSXIdentifier();
	        if (this.matchJSX(':')) {
	            var namespace = elementName;
	            this.expectJSX(':');
	            var name_1 = this.parseJSXIdentifier();
	            elementName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_1));
	        }
	        else if (this.matchJSX('.')) {
	            while (this.matchJSX('.')) {
	                var object = elementName;
	                this.expectJSX('.');
	                var property = this.parseJSXIdentifier();
	                elementName = this.finalize(node, new JSXNode.JSXMemberExpression(object, property));
	            }
	        }
	        return elementName;
	    };
	    JSXParser.prototype.parseJSXAttributeName = function () {
	        var node = this.createJSXNode();
	        var attributeName;
	        var identifier = this.parseJSXIdentifier();
	        if (this.matchJSX(':')) {
	            var namespace = identifier;
	            this.expectJSX(':');
	            var name_2 = this.parseJSXIdentifier();
	            attributeName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_2));
	        }
	        else {
	            attributeName = identifier;
	        }
	        return attributeName;
	    };
	    JSXParser.prototype.parseJSXStringLiteralAttribute = function () {
	        var node = this.createJSXNode();
	        var token = this.nextJSXToken();
	        if (token.type !== 8 /* StringLiteral */) {
	            this.throwUnexpectedToken(token);
	        }
	        var raw = this.getTokenRaw(token);
	        return this.finalize(node, new Node.Literal(token.value, raw));
	    };
	    JSXParser.prototype.parseJSXExpressionAttribute = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        this.finishJSX();
	        if (this.match('}')) {
	            this.tolerateError('JSX attributes must only be assigned a non-empty expression');
	        }
	        var expression = this.parseAssignmentExpression();
	        this.reenterJSX();
	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
	    };
	    JSXParser.prototype.parseJSXAttributeValue = function () {
	        return this.matchJSX('{') ? this.parseJSXExpressionAttribute() :
	            this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
	    };
	    JSXParser.prototype.parseJSXNameValueAttribute = function () {
	        var node = this.createJSXNode();
	        var name = this.parseJSXAttributeName();
	        var value = null;
	        if (this.matchJSX('=')) {
	            this.expectJSX('=');
	            value = this.parseJSXAttributeValue();
	        }
	        return this.finalize(node, new JSXNode.JSXAttribute(name, value));
	    };
	    JSXParser.prototype.parseJSXSpreadAttribute = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        this.expectJSX('...');
	        this.finishJSX();
	        var argument = this.parseAssignmentExpression();
	        this.reenterJSX();
	        return this.finalize(node, new JSXNode.JSXSpreadAttribute(argument));
	    };
	    JSXParser.prototype.parseJSXAttributes = function () {
	        var attributes = [];
	        while (!this.matchJSX('/') && !this.matchJSX('>')) {
	            var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() :
	                this.parseJSXNameValueAttribute();
	            attributes.push(attribute);
	        }
	        return attributes;
	    };
	    JSXParser.prototype.parseJSXOpeningElement = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('<');
	        var name = this.parseJSXElementName();
	        var attributes = this.parseJSXAttributes();
	        var selfClosing = this.matchJSX('/');
	        if (selfClosing) {
	            this.expectJSX('/');
	        }
	        this.expectJSX('>');
	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
	    };
	    JSXParser.prototype.parseJSXBoundaryElement = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('<');
	        if (this.matchJSX('/')) {
	            this.expectJSX('/');
	            var name_3 = this.parseJSXElementName();
	            this.expectJSX('>');
	            return this.finalize(node, new JSXNode.JSXClosingElement(name_3));
	        }
	        var name = this.parseJSXElementName();
	        var attributes = this.parseJSXAttributes();
	        var selfClosing = this.matchJSX('/');
	        if (selfClosing) {
	            this.expectJSX('/');
	        }
	        this.expectJSX('>');
	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
	    };
	    JSXParser.prototype.parseJSXEmptyExpression = function () {
	        var node = this.createJSXChildNode();
	        this.collectComments();
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        return this.finalize(node, new JSXNode.JSXEmptyExpression());
	    };
	    JSXParser.prototype.parseJSXExpressionContainer = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        var expression;
	        if (this.matchJSX('}')) {
	            expression = this.parseJSXEmptyExpression();
	            this.expectJSX('}');
	        }
	        else {
	            this.finishJSX();
	            expression = this.parseAssignmentExpression();
	            this.reenterJSX();
	        }
	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
	    };
	    JSXParser.prototype.parseJSXChildren = function () {
	        var children = [];
	        while (!this.scanner.eof()) {
	            var node = this.createJSXChildNode();
	            var token = this.nextJSXText();
	            if (token.start < token.end) {
	                var raw = this.getTokenRaw(token);
	                var child = this.finalize(node, new JSXNode.JSXText(token.value, raw));
	                children.push(child);
	            }
	            if (this.scanner.source[this.scanner.index] === '{') {
	                var container = this.parseJSXExpressionContainer();
	                children.push(container);
	            }
	            else {
	                break;
	            }
	        }
	        return children;
	    };
	    JSXParser.prototype.parseComplexJSXElement = function (el) {
	        var stack = [];
	        while (!this.scanner.eof()) {
	            el.children = el.children.concat(this.parseJSXChildren());
	            var node = this.createJSXChildNode();
	            var element = this.parseJSXBoundaryElement();
	            if (element.type === jsx_syntax_1.JSXSyntax.JSXOpeningElement) {
	                var opening = element;
	                if (opening.selfClosing) {
	                    var child = this.finalize(node, new JSXNode.JSXElement(opening, [], null));
	                    el.children.push(child);
	                }
	                else {
	                    stack.push(el);
	                    el = { node: node, opening: opening, closing: null, children: [] };
	                }
	            }
	            if (element.type === jsx_syntax_1.JSXSyntax.JSXClosingElement) {
	                el.closing = element;
	                var open_1 = getQualifiedElementName(el.opening.name);
	                var close_1 = getQualifiedElementName(el.closing.name);
	                if (open_1 !== close_1) {
	                    this.tolerateError('Expected corresponding JSX closing tag for %0', open_1);
	                }
	                if (stack.length > 0) {
	                    var child = this.finalize(el.node, new JSXNode.JSXElement(el.opening, el.children, el.closing));
	                    el = stack[stack.length - 1];
	                    el.children.push(child);
	                    stack.pop();
	                }
	                else {
	                    break;
	                }
	            }
	        }
	        return el;
	    };
	    JSXParser.prototype.parseJSXElement = function () {
	        var node = this.createJSXNode();
	        var opening = this.parseJSXOpeningElement();
	        var children = [];
	        var closing = null;
	        if (!opening.selfClosing) {
	            var el = this.parseComplexJSXElement({ node: node, opening: opening, closing: closing, children: children });
	            children = el.children;
	            closing = el.closing;
	        }
	        return this.finalize(node, new JSXNode.JSXElement(opening, children, closing));
	    };
	    JSXParser.prototype.parseJSXRoot = function () {
	        // Pop the opening '<' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	        this.startJSX();
	        var element = this.parseJSXElement();
	        this.finishJSX();
	        return element;
	    };
	    JSXParser.prototype.isStartOfExpression = function () {
	        return _super.prototype.isStartOfExpression.call(this) || this.match('<');
	    };
	    return JSXParser;
	}(parser_1.Parser));
	exports.JSXParser = JSXParser;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// See also tools/generate-unicode-regex.js.
	var Regex = {
	    // Unicode v8.0.0 NonAsciiIdentifierStart:
	    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
	    // Unicode v8.0.0 NonAsciiIdentifierPart:
	    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
	};
	exports.Character = {
	    /* tslint:disable:no-bitwise */
	    fromCodePoint: function (cp) {
	        return (cp < 0x10000) ? String.fromCharCode(cp) :
	            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
	                String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
	    },
	    // https://tc39.github.io/ecma262/#sec-white-space
	    isWhiteSpace: function (cp) {
	        return (cp === 0x20) || (cp === 0x09) || (cp === 0x0B) || (cp === 0x0C) || (cp === 0xA0) ||
	            (cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0);
	    },
	    // https://tc39.github.io/ecma262/#sec-line-terminators
	    isLineTerminator: function (cp) {
	        return (cp === 0x0A) || (cp === 0x0D) || (cp === 0x2028) || (cp === 0x2029);
	    },
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    isIdentifierStart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5F) ||
	            (cp >= 0x41 && cp <= 0x5A) ||
	            (cp >= 0x61 && cp <= 0x7A) ||
	            (cp === 0x5C) ||
	            ((cp >= 0x80) && Regex.NonAsciiIdentifierStart.test(exports.Character.fromCodePoint(cp)));
	    },
	    isIdentifierPart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5F) ||
	            (cp >= 0x41 && cp <= 0x5A) ||
	            (cp >= 0x61 && cp <= 0x7A) ||
	            (cp >= 0x30 && cp <= 0x39) ||
	            (cp === 0x5C) ||
	            ((cp >= 0x80) && Regex.NonAsciiIdentifierPart.test(exports.Character.fromCodePoint(cp)));
	    },
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    isDecimalDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39); // 0..9
	    },
	    isHexDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39) ||
	            (cp >= 0x41 && cp <= 0x46) ||
	            (cp >= 0x61 && cp <= 0x66); // a..f
	    },
	    isOctalDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x37); // 0..7
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var jsx_syntax_1 = __webpack_require__(6);
	/* tslint:disable:max-classes-per-file */
	var JSXClosingElement = (function () {
	    function JSXClosingElement(name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
	        this.name = name;
	    }
	    return JSXClosingElement;
	}());
	exports.JSXClosingElement = JSXClosingElement;
	var JSXElement = (function () {
	    function JSXElement(openingElement, children, closingElement) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXElement;
	        this.openingElement = openingElement;
	        this.children = children;
	        this.closingElement = closingElement;
	    }
	    return JSXElement;
	}());
	exports.JSXElement = JSXElement;
	var JSXEmptyExpression = (function () {
	    function JSXEmptyExpression() {
	        this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
	    }
	    return JSXEmptyExpression;
	}());
	exports.JSXEmptyExpression = JSXEmptyExpression;
	var JSXExpressionContainer = (function () {
	    function JSXExpressionContainer(expression) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
	        this.expression = expression;
	    }
	    return JSXExpressionContainer;
	}());
	exports.JSXExpressionContainer = JSXExpressionContainer;
	var JSXIdentifier = (function () {
	    function JSXIdentifier(name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
	        this.name = name;
	    }
	    return JSXIdentifier;
	}());
	exports.JSXIdentifier = JSXIdentifier;
	var JSXMemberExpression = (function () {
	    function JSXMemberExpression(object, property) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
	        this.object = object;
	        this.property = property;
	    }
	    return JSXMemberExpression;
	}());
	exports.JSXMemberExpression = JSXMemberExpression;
	var JSXAttribute = (function () {
	    function JSXAttribute(name, value) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
	        this.name = name;
	        this.value = value;
	    }
	    return JSXAttribute;
	}());
	exports.JSXAttribute = JSXAttribute;
	var JSXNamespacedName = (function () {
	    function JSXNamespacedName(namespace, name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
	        this.namespace = namespace;
	        this.name = name;
	    }
	    return JSXNamespacedName;
	}());
	exports.JSXNamespacedName = JSXNamespacedName;
	var JSXOpeningElement = (function () {
	    function JSXOpeningElement(name, selfClosing, attributes) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
	        this.name = name;
	        this.selfClosing = selfClosing;
	        this.attributes = attributes;
	    }
	    return JSXOpeningElement;
	}());
	exports.JSXOpeningElement = JSXOpeningElement;
	var JSXSpreadAttribute = (function () {
	    function JSXSpreadAttribute(argument) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
	        this.argument = argument;
	    }
	    return JSXSpreadAttribute;
	}());
	exports.JSXSpreadAttribute = JSXSpreadAttribute;
	var JSXText = (function () {
	    function JSXText(value, raw) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXText;
	        this.value = value;
	        this.raw = raw;
	    }
	    return JSXText;
	}());
	exports.JSXText = JSXText;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JSXSyntax = {
	    JSXAttribute: 'JSXAttribute',
	    JSXClosingElement: 'JSXClosingElement',
	    JSXElement: 'JSXElement',
	    JSXEmptyExpression: 'JSXEmptyExpression',
	    JSXExpressionContainer: 'JSXExpressionContainer',
	    JSXIdentifier: 'JSXIdentifier',
	    JSXMemberExpression: 'JSXMemberExpression',
	    JSXNamespacedName: 'JSXNamespacedName',
	    JSXOpeningElement: 'JSXOpeningElement',
	    JSXSpreadAttribute: 'JSXSpreadAttribute',
	    JSXText: 'JSXText'
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var syntax_1 = __webpack_require__(2);
	/* tslint:disable:max-classes-per-file */
	var ArrayExpression = (function () {
	    function ArrayExpression(elements) {
	        this.type = syntax_1.Syntax.ArrayExpression;
	        this.elements = elements;
	    }
	    return ArrayExpression;
	}());
	exports.ArrayExpression = ArrayExpression;
	var ArrayPattern = (function () {
	    function ArrayPattern(elements) {
	        this.type = syntax_1.Syntax.ArrayPattern;
	        this.elements = elements;
	    }
	    return ArrayPattern;
	}());
	exports.ArrayPattern = ArrayPattern;
	var ArrowFunctionExpression = (function () {
	    function ArrowFunctionExpression(params, body, expression) {
	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = false;
	    }
	    return ArrowFunctionExpression;
	}());
	exports.ArrowFunctionExpression = ArrowFunctionExpression;
	var AssignmentExpression = (function () {
	    function AssignmentExpression(operator, left, right) {
	        this.type = syntax_1.Syntax.AssignmentExpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return AssignmentExpression;
	}());
	exports.AssignmentExpression = AssignmentExpression;
	var AssignmentPattern = (function () {
	    function AssignmentPattern(left, right) {
	        this.type = syntax_1.Syntax.AssignmentPattern;
	        this.left = left;
	        this.right = right;
	    }
	    return AssignmentPattern;
	}());
	exports.AssignmentPattern = AssignmentPattern;
	var AsyncArrowFunctionExpression = (function () {
	    function AsyncArrowFunctionExpression(params, body, expression) {
	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = true;
	    }
	    return AsyncArrowFunctionExpression;
	}());
	exports.AsyncArrowFunctionExpression = AsyncArrowFunctionExpression;
	var AsyncFunctionDeclaration = (function () {
	    function AsyncFunctionDeclaration(id, params, body) {
	        this.type = syntax_1.Syntax.FunctionDeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return AsyncFunctionDeclaration;
	}());
	exports.AsyncFunctionDeclaration = AsyncFunctionDeclaration;
	var AsyncFunctionExpression = (function () {
	    function AsyncFunctionExpression(id, params, body) {
	        this.type = syntax_1.Syntax.FunctionExpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return AsyncFunctionExpression;
	}());
	exports.AsyncFunctionExpression = AsyncFunctionExpression;
	var AwaitExpression = (function () {
	    function AwaitExpression(argument) {
	        this.type = syntax_1.Syntax.AwaitExpression;
	        this.argument = argument;
	    }
	    return AwaitExpression;
	}());
	exports.AwaitExpression = AwaitExpression;
	var BinaryExpression = (function () {
	    function BinaryExpression(operator, left, right) {
	        var logical = (operator === '||' || operator === '&&');
	        this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return BinaryExpression;
	}());
	exports.BinaryExpression = BinaryExpression;
	var BlockStatement = (function () {
	    function BlockStatement(body) {
	        this.type = syntax_1.Syntax.BlockStatement;
	        this.body = body;
	    }
	    return BlockStatement;
	}());
	exports.BlockStatement = BlockStatement;
	var BreakStatement = (function () {
	    function BreakStatement(label) {
	        this.type = syntax_1.Syntax.BreakStatement;
	        this.label = label;
	    }
	    return BreakStatement;
	}());
	exports.BreakStatement = BreakStatement;
	var CallExpression = (function () {
	    function CallExpression(callee, args) {
	        this.type = syntax_1.Syntax.CallExpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return CallExpression;
	}());
	exports.CallExpression = CallExpression;
	var CatchClause = (function () {
	    function CatchClause(param, body) {
	        this.type = syntax_1.Syntax.CatchClause;
	        this.param = param;
	        this.body = body;
	    }
	    return CatchClause;
	}());
	exports.CatchClause = CatchClause;
	var ClassBody = (function () {
	    function ClassBody(body) {
	        this.type = syntax_1.Syntax.ClassBody;
	        this.body = body;
	    }
	    return ClassBody;
	}());
	exports.ClassBody = ClassBody;
	var ClassDeclaration = (function () {
	    function ClassDeclaration(id, superClass, body) {
	        this.type = syntax_1.Syntax.ClassDeclaration;
	        this.id = id;
	        this.superClass = superClass;
	        this.body = body;
	    }
	    return ClassDeclaration;
	}());
	exports.ClassDeclaration = ClassDeclaration;
	var ClassExpression = (function () {
	    function ClassExpression(id, superClass, body) {
	        this.type = syntax_1.Syntax.ClassExpression;
	        this.id = id;
	        this.superClass = superClass;
	        this.body = body;
	    }
	    return ClassExpression;
	}());
	exports.ClassExpression = ClassExpression;
	var ComputedMemberExpression = (function () {
	    function ComputedMemberExpression(object, property) {
	        this.type = syntax_1.Syntax.MemberExpression;
	        this.computed = true;
	        this.object = object;
	        this.property = property;
	    }
	    return ComputedMemberExpression;
	}());
	exports.ComputedMemberExpression = ComputedMemberExpression;
	var ConditionalExpression = (function () {
	    function ConditionalExpression(test, consequent, alternate) {
	        this.type = syntax_1.Syntax.ConditionalExpression;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return ConditionalExpression;
	}());
	exports.ConditionalExpression = ConditionalExpression;
	var ContinueStatement = (function () {
	    function ContinueStatement(label) {
	        this.type = syntax_1.Syntax.ContinueStatement;
	        this.label = label;
	    }
	    return ContinueStatement;
	}());
	exports.ContinueStatement = ContinueStatement;
	var DebuggerStatement = (function () {
	    function DebuggerStatement() {
	        this.type = syntax_1.Syntax.DebuggerStatement;
	    }
	    return DebuggerStatement;
	}());
	exports.DebuggerStatement = DebuggerStatement;
	var Directive = (function () {
	    function Directive(expression, directive) {
	        this.type = syntax_1.Syntax.ExpressionStatement;
	        this.expression = expression;
	        this.directive = directive;
	    }
	    return Directive;
	}());
	exports.Directive = Directive;
	var DoWhileStatement = (function () {
	    function DoWhileStatement(body, test) {
	        this.type = syntax_1.Syntax.DoWhileStatement;
	        this.body = body;
	        this.test = test;
	    }
	    return DoWhileStatement;
	}());
	exports.DoWhileStatement = DoWhileStatement;
	var EmptyStatement = (function () {
	    function EmptyStatement() {
	        this.type = syntax_1.Syntax.EmptyStatement;
	    }
	    return EmptyStatement;
	}());
	exports.EmptyStatement = EmptyStatement;
	var ExportAllDeclaration = (function () {
	    function ExportAllDeclaration(source) {
	        this.type = syntax_1.Syntax.ExportAllDeclaration;
	        this.source = source;
	    }
	    return ExportAllDeclaration;
	}());
	exports.ExportAllDeclaration = ExportAllDeclaration;
	var ExportDefaultDeclaration = (function () {
	    function ExportDefaultDeclaration(declaration) {
	        this.type = syntax_1.Syntax.ExportDefaultDeclaration;
	        this.declaration = declaration;
	    }
	    return ExportDefaultDeclaration;
	}());
	exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
	var ExportNamedDeclaration = (function () {
	    function ExportNamedDeclaration(declaration, specifiers, source) {
	        this.type = syntax_1.Syntax.ExportNamedDeclaration;
	        this.declaration = declaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return ExportNamedDeclaration;
	}());
	exports.ExportNamedDeclaration = ExportNamedDeclaration;
	var ExportSpecifier = (function () {
	    function ExportSpecifier(local, exported) {
	        this.type = syntax_1.Syntax.ExportSpecifier;
	        this.exported = exported;
	        this.local = local;
	    }
	    return ExportSpecifier;
	}());
	exports.ExportSpecifier = ExportSpecifier;
	var ExpressionStatement = (function () {
	    function ExpressionStatement(expression) {
	        this.type = syntax_1.Syntax.ExpressionStatement;
	        this.expression = expression;
	    }
	    return ExpressionStatement;
	}());
	exports.ExpressionStatement = ExpressionStatement;
	var ForInStatement = (function () {
	    function ForInStatement(left, right, body) {
	        this.type = syntax_1.Syntax.ForInStatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	        this.each = false;
	    }
	    return ForInStatement;
	}());
	exports.ForInStatement = ForInStatement;
	var ForOfStatement = (function () {
	    function ForOfStatement(left, right, body) {
	        this.type = syntax_1.Syntax.ForOfStatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	    }
	    return ForOfStatement;
	}());
	exports.ForOfStatement = ForOfStatement;
	var ForStatement = (function () {
	    function ForStatement(init, test, update, body) {
	        this.type = syntax_1.Syntax.ForStatement;
	        this.init = init;
	        this.test = test;
	        this.update = update;
	        this.body = body;
	    }
	    return ForStatement;
	}());
	exports.ForStatement = ForStatement;
	var FunctionDeclaration = (function () {
	    function FunctionDeclaration(id, params, body, generator) {
	        this.type = syntax_1.Syntax.FunctionDeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return FunctionDeclaration;
	}());
	exports.FunctionDeclaration = FunctionDeclaration;
	var FunctionExpression = (function () {
	    function FunctionExpression(id, params, body, generator) {
	        this.type = syntax_1.Syntax.FunctionExpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return FunctionExpression;
	}());
	exports.FunctionExpression = FunctionExpression;
	var Identifier = (function () {
	    function Identifier(name) {
	        this.type = syntax_1.Syntax.Identifier;
	        this.name = name;
	    }
	    return Identifier;
	}());
	exports.Identifier = Identifier;
	var IfStatement = (function () {
	    function IfStatement(test, consequent, alternate) {
	        this.type = syntax_1.Syntax.IfStatement;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return IfStatement;
	}());
	exports.IfStatement = IfStatement;
	var ImportDeclaration = (function () {
	    function ImportDeclaration(specifiers, source) {
	        this.type = syntax_1.Syntax.ImportDeclaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return ImportDeclaration;
	}());
	exports.ImportDeclaration = ImportDeclaration;
	var ImportDefaultSpecifier = (function () {
	    function ImportDefaultSpecifier(local) {
	        this.type = syntax_1.Syntax.ImportDefaultSpecifier;
	        this.local = local;
	    }
	    return ImportDefaultSpecifier;
	}());
	exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
	var ImportNamespaceSpecifier = (function () {
	    function ImportNamespaceSpecifier(local) {
	        this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
	        this.local = local;
	    }
	    return ImportNamespaceSpecifier;
	}());
	exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
	var ImportSpecifier = (function () {
	    function ImportSpecifier(local, imported) {
	        this.type = syntax_1.Syntax.ImportSpecifier;
	        this.local = local;
	        this.imported = imported;
	    }
	    return ImportSpecifier;
	}());
	exports.ImportSpecifier = ImportSpecifier;
	var LabeledStatement = (function () {
	    function LabeledStatement(label, body) {
	        this.type = syntax_1.Syntax.LabeledStatement;
	        this.label = label;
	        this.body = body;
	    }
	    return LabeledStatement;
	}());
	exports.LabeledStatement = LabeledStatement;
	var Literal = (function () {
	    function Literal(value, raw) {
	        this.type = syntax_1.Syntax.Literal;
	        this.value = value;
	        this.raw = raw;
	    }
	    return Literal;
	}());
	exports.Literal = Literal;
	var MetaProperty = (function () {
	    function MetaProperty(meta, property) {
	        this.type = syntax_1.Syntax.MetaProperty;
	        this.meta = meta;
	        this.property = property;
	    }
	    return MetaProperty;
	}());
	exports.MetaProperty = MetaProperty;
	var MethodDefinition = (function () {
	    function MethodDefinition(key, computed, value, kind, isStatic) {
	        this.type = syntax_1.Syntax.MethodDefinition;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.static = isStatic;
	    }
	    return MethodDefinition;
	}());
	exports.MethodDefinition = MethodDefinition;
	var Module = (function () {
	    function Module(body) {
	        this.type = syntax_1.Syntax.Program;
	        this.body = body;
	        this.sourceType = 'module';
	    }
	    return Module;
	}());
	exports.Module = Module;
	var NewExpression = (function () {
	    function NewExpression(callee, args) {
	        this.type = syntax_1.Syntax.NewExpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return NewExpression;
	}());
	exports.NewExpression = NewExpression;
	var ObjectExpression = (function () {
	    function ObjectExpression(properties) {
	        this.type = syntax_1.Syntax.ObjectExpression;
	        this.properties = properties;
	    }
	    return ObjectExpression;
	}());
	exports.ObjectExpression = ObjectExpression;
	var ObjectPattern = (function () {
	    function ObjectPattern(properties) {
	        this.type = syntax_1.Syntax.ObjectPattern;
	        this.properties = properties;
	    }
	    return ObjectPattern;
	}());
	exports.ObjectPattern = ObjectPattern;
	var Property = (function () {
	    function Property(kind, key, computed, value, method, shorthand) {
	        this.type = syntax_1.Syntax.Property;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.method = method;
	        this.shorthand = shorthand;
	    }
	    return Property;
	}());
	exports.Property = Property;
	var RegexLiteral = (function () {
	    function RegexLiteral(value, raw, pattern, flags) {
	        this.type = syntax_1.Syntax.Literal;
	        this.value = value;
	        this.raw = raw;
	        this.regex = { pattern: pattern, flags: flags };
	    }
	    return RegexLiteral;
	}());
	exports.RegexLiteral = RegexLiteral;
	var RestElement = (function () {
	    function RestElement(argument) {
	        this.type = syntax_1.Syntax.RestElement;
	        this.argument = argument;
	    }
	    return RestElement;
	}());
	exports.RestElement = RestElement;
	var ReturnStatement = (function () {
	    function ReturnStatement(argument) {
	        this.type = syntax_1.Syntax.ReturnStatement;
	        this.argument = argument;
	    }
	    return ReturnStatement;
	}());
	exports.ReturnStatement = ReturnStatement;
	var Script = (function () {
	    function Script(body) {
	        this.type = syntax_1.Syntax.Program;
	        this.body = body;
	        this.sourceType = 'script';
	    }
	    return Script;
	}());
	exports.Script = Script;
	var SequenceExpression = (function () {
	    function SequenceExpression(expressions) {
	        this.type = syntax_1.Syntax.SequenceExpression;
	        this.expressions = expressions;
	    }
	    return SequenceExpression;
	}());
	exports.SequenceExpression = SequenceExpression;
	var SpreadElement = (function () {
	    function SpreadElement(argument) {
	        this.type = syntax_1.Syntax.SpreadElement;
	        this.argument = argument;
	    }
	    return SpreadElement;
	}());
	exports.SpreadElement = SpreadElement;
	var StaticMemberExpression = (function () {
	    function StaticMemberExpression(object, property) {
	        this.type = syntax_1.Syntax.MemberExpression;
	        this.computed = false;
	        this.object = object;
	        this.property = property;
	    }
	    return StaticMemberExpression;
	}());
	exports.StaticMemberExpression = StaticMemberExpression;
	var Super = (function () {
	    function Super() {
	        this.type = syntax_1.Syntax.Super;
	    }
	    return Super;
	}());
	exports.Super = Super;
	var SwitchCase = (function () {
	    function SwitchCase(test, consequent) {
	        this.type = syntax_1.Syntax.SwitchCase;
	        this.test = test;
	        this.consequent = consequent;
	    }
	    return SwitchCase;
	}());
	exports.SwitchCase = SwitchCase;
	var SwitchStatement = (function () {
	    function SwitchStatement(discriminant, cases) {
	        this.type = syntax_1.Syntax.SwitchStatement;
	        this.discriminant = discriminant;
	        this.cases = cases;
	    }
	    return SwitchStatement;
	}());
	exports.SwitchStatement = SwitchStatement;
	var TaggedTemplateExpression = (function () {
	    function TaggedTemplateExpression(tag, quasi) {
	        this.type = syntax_1.Syntax.TaggedTemplateExpression;
	        this.tag = tag;
	        this.quasi = quasi;
	    }
	    return TaggedTemplateExpression;
	}());
	exports.TaggedTemplateExpression = TaggedTemplateExpression;
	var TemplateElement = (function () {
	    function TemplateElement(value, tail) {
	        this.type = syntax_1.Syntax.TemplateElement;
	        this.value = value;
	        this.tail = tail;
	    }
	    return TemplateElement;
	}());
	exports.TemplateElement = TemplateElement;
	var TemplateLiteral = (function () {
	    function TemplateLiteral(quasis, expressions) {
	        this.type = syntax_1.Syntax.TemplateLiteral;
	        this.quasis = quasis;
	        this.expressions = expressions;
	    }
	    return TemplateLiteral;
	}());
	exports.TemplateLiteral = TemplateLiteral;
	var ThisExpression = (function () {
	    function ThisExpression() {
	        this.type = syntax_1.Syntax.ThisExpression;
	    }
	    return ThisExpression;
	}());
	exports.ThisExpression = ThisExpression;
	var ThrowStatement = (function () {
	    function ThrowStatement(argument) {
	        this.type = syntax_1.Syntax.ThrowStatement;
	        this.argument = argument;
	    }
	    return ThrowStatement;
	}());
	exports.ThrowStatement = ThrowStatement;
	var TryStatement = (function () {
	    function TryStatement(block, handler, finalizer) {
	        this.type = syntax_1.Syntax.TryStatement;
	        this.block = block;
	        this.handler = handler;
	        this.finalizer = finalizer;
	    }
	    return TryStatement;
	}());
	exports.TryStatement = TryStatement;
	var UnaryExpression = (function () {
	    function UnaryExpression(operator, argument) {
	        this.type = syntax_1.Syntax.UnaryExpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = true;
	    }
	    return UnaryExpression;
	}());
	exports.UnaryExpression = UnaryExpression;
	var UpdateExpression = (function () {
	    function UpdateExpression(operator, argument, prefix) {
	        this.type = syntax_1.Syntax.UpdateExpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = prefix;
	    }
	    return UpdateExpression;
	}());
	exports.UpdateExpression = UpdateExpression;
	var VariableDeclaration = (function () {
	    function VariableDeclaration(declarations, kind) {
	        this.type = syntax_1.Syntax.VariableDeclaration;
	        this.declarations = declarations;
	        this.kind = kind;
	    }
	    return VariableDeclaration;
	}());
	exports.VariableDeclaration = VariableDeclaration;
	var VariableDeclarator = (function () {
	    function VariableDeclarator(id, init) {
	        this.type = syntax_1.Syntax.VariableDeclarator;
	        this.id = id;
	        this.init = init;
	    }
	    return VariableDeclarator;
	}());
	exports.VariableDeclarator = VariableDeclarator;
	var WhileStatement = (function () {
	    function WhileStatement(test, body) {
	        this.type = syntax_1.Syntax.WhileStatement;
	        this.test = test;
	        this.body = body;
	    }
	    return WhileStatement;
	}());
	exports.WhileStatement = WhileStatement;
	var WithStatement = (function () {
	    function WithStatement(object, body) {
	        this.type = syntax_1.Syntax.WithStatement;
	        this.object = object;
	        this.body = body;
	    }
	    return WithStatement;
	}());
	exports.WithStatement = WithStatement;
	var YieldExpression = (function () {
	    function YieldExpression(argument, delegate) {
	        this.type = syntax_1.Syntax.YieldExpression;
	        this.argument = argument;
	        this.delegate = delegate;
	    }
	    return YieldExpression;
	}());
	exports.YieldExpression = YieldExpression;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var assert_1 = __webpack_require__(9);
	var error_handler_1 = __webpack_require__(10);
	var messages_1 = __webpack_require__(11);
	var Node = __webpack_require__(7);
	var scanner_1 = __webpack_require__(12);
	var syntax_1 = __webpack_require__(2);
	var token_1 = __webpack_require__(13);
	var ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
	var Parser = (function () {
	    function Parser(code, options, delegate) {
	        if (options === void 0) { options = {}; }
	        this.config = {
	            range: (typeof options.range === 'boolean') && options.range,
	            loc: (typeof options.loc === 'boolean') && options.loc,
	            source: null,
	            tokens: (typeof options.tokens === 'boolean') && options.tokens,
	            comment: (typeof options.comment === 'boolean') && options.comment,
	            tolerant: (typeof options.tolerant === 'boolean') && options.tolerant
	        };
	        if (this.config.loc && options.source && options.source !== null) {
	            this.config.source = String(options.source);
	        }
	        this.delegate = delegate;
	        this.errorHandler = new error_handler_1.ErrorHandler();
	        this.errorHandler.tolerant = this.config.tolerant;
	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
	        this.scanner.trackComment = this.config.comment;
	        this.operatorPrecedence = {
	            ')': 0,
	            ';': 0,
	            ',': 0,
	            '=': 0,
	            ']': 0,
	            '||': 1,
	            '&&': 2,
	            '|': 3,
	            '^': 4,
	            '&': 5,
	            '==': 6,
	            '!=': 6,
	            '===': 6,
	            '!==': 6,
	            '<': 7,
	            '>': 7,
	            '<=': 7,
	            '>=': 7,
	            '<<': 8,
	            '>>': 8,
	            '>>>': 8,
	            '+': 9,
	            '-': 9,
	            '*': 11,
	            '/': 11,
	            '%': 11
	        };
	        this.lookahead = {
	            type: 2 /* EOF */,
	            value: '',
	            lineNumber: this.scanner.lineNumber,
	            lineStart: 0,
	            start: 0,
	            end: 0
	        };
	        this.hasLineTerminator = false;
	        this.context = {
	            isModule: false,
	            await: false,
	            allowIn: true,
	            allowStrictDirective: true,
	            allowYield: true,
	            firstCoverInitializedNameError: null,
	            isAssignmentTarget: false,
	            isBindingElement: false,
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            labelSet: {},
	            strict: false
	        };
	        this.tokens = [];
	        this.startMarker = {
	            index: 0,
	            line: this.scanner.lineNumber,
	            column: 0
	        };
	        this.lastMarker = {
	            index: 0,
	            line: this.scanner.lineNumber,
	            column: 0
	        };
	        this.nextToken();
	        this.lastMarker = {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    }
	    Parser.prototype.throwError = function (messageFormat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = Array.prototype.slice.call(arguments, 1);
	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastMarker.index;
	        var line = this.lastMarker.line;
	        var column = this.lastMarker.column + 1;
	        throw this.errorHandler.createError(index, line, column, msg);
	    };
	    Parser.prototype.tolerateError = function (messageFormat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = Array.prototype.slice.call(arguments, 1);
	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastMarker.index;
	        var line = this.scanner.lineNumber;
	        var column = this.lastMarker.column + 1;
	        this.errorHandler.tolerateError(index, line, column, msg);
	    };
	    // Throw an exception because of the token.
	    Parser.prototype.unexpectedTokenError = function (token, message) {
	        var msg = message || messages_1.Messages.UnexpectedToken;
	        var value;
	        if (token) {
	            if (!message) {
	                msg = (token.type === 2 /* EOF */) ? messages_1.Messages.UnexpectedEOS :
	                    (token.type === 3 /* Identifier */) ? messages_1.Messages.UnexpectedIdentifier :
	                        (token.type === 6 /* NumericLiteral */) ? messages_1.Messages.UnexpectedNumber :
	                            (token.type === 8 /* StringLiteral */) ? messages_1.Messages.UnexpectedString :
	                                (token.type === 10 /* Template */) ? messages_1.Messages.UnexpectedTemplate :
	                                    messages_1.Messages.UnexpectedToken;
	                if (token.type === 4 /* Keyword */) {
	                    if (this.scanner.isFutureReservedWord(token.value)) {
	                        msg = messages_1.Messages.UnexpectedReserved;
	                    }
	                    else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
	                        msg = messages_1.Messages.StrictReservedWord;
	                    }
	                }
	            }
	            value = token.value;
	        }
	        else {
	            value = 'ILLEGAL';
	        }
	        msg = msg.replace('%0', value);
	        if (token && typeof token.lineNumber === 'number') {
	            var index = token.start;
	            var line = token.lineNumber;
	            var lastMarkerLineStart = this.lastMarker.index - this.lastMarker.column;
	            var column = token.start - lastMarkerLineStart + 1;
	            return this.errorHandler.createError(index, line, column, msg);
	        }
	        else {
	            var index = this.lastMarker.index;
	            var line = this.lastMarker.line;
	            var column = this.lastMarker.column + 1;
	            return this.errorHandler.createError(index, line, column, msg);
	        }
	    };
	    Parser.prototype.throwUnexpectedToken = function (token, message) {
	        throw this.unexpectedTokenError(token, message);
	    };
	    Parser.prototype.tolerateUnexpectedToken = function (token, message) {
	        this.errorHandler.tolerate(this.unexpectedTokenError(token, message));
	    };
	    Parser.prototype.collectComments = function () {
	        if (!this.config.comment) {
	            this.scanner.scanComments();
	        }
	        else {
	            var comments = this.scanner.scanComments();
	            if (comments.length > 0 && this.delegate) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var node = void 0;
	                    node = {
	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
	                        value: this.scanner.source.slice(e.slice[0], e.slice[1])
	                    };
	                    if (this.config.range) {
	                        node.range = e.range;
	                    }
	                    if (this.config.loc) {
	                        node.loc = e.loc;
	                    }
	                    var metadata = {
	                        start: {
	                            line: e.loc.start.line,
	                            column: e.loc.start.column,
	                            offset: e.range[0]
	                        },
	                        end: {
	                            line: e.loc.end.line,
	                            column: e.loc.end.column,
	                            offset: e.range[1]
	                        }
	                    };
	                    this.delegate(node, metadata);
	                }
	            }
	        }
	    };
	    // From internal representation to an external structure
	    Parser.prototype.getTokenRaw = function (token) {
	        return this.scanner.source.slice(token.start, token.end);
	    };
	    Parser.prototype.convertToken = function (token) {
	        var t = {
	            type: token_1.TokenName[token.type],
	            value: this.getTokenRaw(token)
	        };
	        if (this.config.range) {
	            t.range = [token.start, token.end];
	        }
	        if (this.config.loc) {
	            t.loc = {
	                start: {
	                    line: this.startMarker.line,
	                    column: this.startMarker.column
	                },
	                end: {
	                    line: this.scanner.lineNumber,
	                    column: this.scanner.index - this.scanner.lineStart
	                }
	            };
	        }
	        if (token.type === 9 /* RegularExpression */) {
	            var pattern = token.pattern;
	            var flags = token.flags;
	            t.regex = { pattern: pattern, flags: flags };
	        }
	        return t;
	    };
	    Parser.prototype.nextToken = function () {
	        var token = this.lookahead;
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        this.collectComments();
	        if (this.scanner.index !== this.startMarker.index) {
	            this.startMarker.index = this.scanner.index;
	            this.startMarker.line = this.scanner.lineNumber;
	            this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        }
	        var next = this.scanner.lex();
	        this.hasLineTerminator = (token.lineNumber !== next.lineNumber);
	        if (next && this.context.strict && next.type === 3 /* Identifier */) {
	            if (this.scanner.isStrictModeReservedWord(next.value)) {
	                next.type = 4 /* Keyword */;
	            }
	        }
	        this.lookahead = next;
	        if (this.config.tokens && next.type !== 2 /* EOF */) {
	            this.tokens.push(this.convertToken(next));
	        }
	        return token;
	    };
	    Parser.prototype.nextRegexToken = function () {
	        this.collectComments();
	        var token = this.scanner.scanRegExp();
	        if (this.config.tokens) {
	            // Pop the previous token, '/' or '/='
	            // This is added from the lookahead token.
	            this.tokens.pop();
	            this.tokens.push(this.convertToken(token));
	        }
	        // Prime the next lookahead.
	        this.lookahead = token;
	        this.nextToken();
	        return token;
	    };
	    Parser.prototype.createNode = function () {
	        return {
	            index: this.startMarker.index,
	            line: this.startMarker.line,
	            column: this.startMarker.column
	        };
	    };
	    Parser.prototype.startNode = function (token) {
	        return {
	            index: token.start,
	            line: token.lineNumber,
	            column: token.start - token.lineStart
	        };
	    };
	    Parser.prototype.finalize = function (marker, node) {
	        if (this.config.range) {
	            node.range = [marker.index, this.lastMarker.index];
	        }
	        if (this.config.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                },
	                end: {
	                    line: this.lastMarker.line,
	                    column: this.lastMarker.column
	                }
	            };
	            if (this.config.source) {
	                node.loc.source = this.config.source;
	            }
	        }
	        if (this.delegate) {
	            var metadata = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                    offset: marker.index
	                },
	                end: {
	                    line: this.lastMarker.line,
	                    column: this.lastMarker.column,
	                    offset: this.lastMarker.index
	                }
	            };
	            this.delegate(node, metadata);
	        }
	        return node;
	    };
	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.
	    Parser.prototype.expect = function (value) {
	        var token = this.nextToken();
	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
	    Parser.prototype.expectCommaSeparator = function () {
	        if (this.config.tolerant) {
	            var token = this.lookahead;
	            if (token.type === 7 /* Punctuator */ && token.value === ',') {
	                this.nextToken();
	            }
	            else if (token.type === 7 /* Punctuator */ && token.value === ';') {
	                this.nextToken();
	                this.tolerateUnexpectedToken(token);
	            }
	            else {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
	            }
	        }
	        else {
	            this.expect(',');
	        }
	    };
	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.
	    Parser.prototype.expectKeyword = function (keyword) {
	        var token = this.nextToken();
	        if (token.type !== 4 /* Keyword */ || token.value !== keyword) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Return true if the next token matches the specified punctuator.
	    Parser.prototype.match = function (value) {
	        return this.lookahead.type === 7 /* Punctuator */ && this.lookahead.value === value;
	    };
	    // Return true if the next token matches the specified keyword
	    Parser.prototype.matchKeyword = function (keyword) {
	        return this.lookahead.type === 4 /* Keyword */ && this.lookahead.value === keyword;
	    };
	    // Return true if the next token matches the specified contextual keyword
	    // (where an identifier is sometimes a keyword depending on the context)
	    Parser.prototype.matchContextualKeyword = function (keyword) {
	        return this.lookahead.type === 3 /* Identifier */ && this.lookahead.value === keyword;
	    };
	    // Return true if the next token is an assignment operator
	    Parser.prototype.matchAssign = function () {
	        if (this.lookahead.type !== 7 /* Punctuator */) {
	            return false;
	        }
	        var op = this.lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '**=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    };
	    // Cover grammar support.
	    //
	    // When an assignment expression position starts with an left parenthesis, the determination of the type
	    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
	    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
	    //
	    // There are three productions that can be parsed in a parentheses pair that needs to be determined
	    // after the outermost pair is closed. They are:
	    //
	    //   1. AssignmentExpression
	    //   2. BindingElements
	    //   3. AssignmentTargets
	    //
	    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
	    // binding element or assignment target.
	    //
	    // The three productions have the relationship:
	    //
	    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
	    //
	    // with a single exception that CoverInitializedName when used directly in an Expression, generates
	    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
	    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
	    //
	    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
	    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
	    // the CoverInitializedName check is conducted.
	    //
	    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
	    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
	    // pattern. The CoverInitializedName check is deferred.
	    Parser.prototype.isolateCoverGrammar = function (parseFunction) {
	        var previousIsBindingElement = this.context.isBindingElement;
	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
	        this.context.isBindingElement = true;
	        this.context.isAssignmentTarget = true;
	        this.context.firstCoverInitializedNameError = null;
	        var result = parseFunction.call(this);
	        if (this.context.firstCoverInitializedNameError !== null) {
	            this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
	        }
	        this.context.isBindingElement = previousIsBindingElement;
	        this.context.isAssignmentTarget = previousIsAssignmentTarget;
	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError;
	        return result;
	    };
	    Parser.prototype.inheritCoverGrammar = function (parseFunction) {
	        var previousIsBindingElement = this.context.isBindingElement;
	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
	        this.context.isBindingElement = true;
	        this.context.isAssignmentTarget = true;
	        this.context.firstCoverInitializedNameError = null;
	        var result = parseFunction.call(this);
	        this.context.isBindingElement = this.context.isBindingElement && previousIsBindingElement;
	        this.context.isAssignmentTarget = this.context.isAssignmentTarget && previousIsAssignmentTarget;
	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.context.firstCoverInitializedNameError;
	        return result;
	    };
	    Parser.prototype.consumeSemicolon = function () {
	        if (this.match(';')) {
	            this.nextToken();
	        }
	        else if (!this.hasLineTerminator) {
	            if (this.lookahead.type !== 2 /* EOF */ && !this.match('}')) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            this.lastMarker.index = this.startMarker.index;
	            this.lastMarker.line = this.startMarker.line;
	            this.lastMarker.column = this.startMarker.column;
	        }
	    };
	    // https://tc39.github.io/ecma262/#sec-primary-expression
	    Parser.prototype.parsePrimaryExpression = function () {
	        var node = this.createNode();
	        var expr;
	        var token, raw;
	        switch (this.lookahead.type) {
	            case 3 /* Identifier */:
	                if ((this.context.isModule || this.context.await) && this.lookahead.value === 'await') {
	                    this.tolerateUnexpectedToken(this.lookahead);
	                }
	                expr = this.matchAsyncFunction() ? this.parseFunctionExpression() : this.finalize(node, new Node.Identifier(this.nextToken().value));
	                break;
	            case 6 /* NumericLiteral */:
	            case 8 /* StringLiteral */:
	                if (this.context.strict && this.lookahead.octal) {
	                    this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.StrictOctalLiteral);
	                }
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(token.value, raw));
	                break;
	            case 1 /* BooleanLiteral */:
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(token.value === 'true', raw));
	                break;
	            case 5 /* NullLiteral */:
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(null, raw));
	                break;
	            case 10 /* Template */:
	                expr = this.parseTemplateLiteral();
	                break;
	            case 7 /* Punctuator */:
	                switch (this.lookahead.value) {
	                    case '(':
	                        this.context.isBindingElement = false;
	                        expr = this.inheritCoverGrammar(this.parseGroupExpression);
	                        break;
	                    case '[':
	                        expr = this.inheritCoverGrammar(this.parseArrayInitializer);
	                        break;
	                    case '{':
	                        expr = this.inheritCoverGrammar(this.parseObjectInitializer);
	                        break;
	                    case '/':
	                    case '/=':
	                        this.context.isAssignmentTarget = false;
	                        this.context.isBindingElement = false;
	                        this.scanner.index = this.startMarker.index;
	                        token = this.nextRegexToken();
	                        raw = this.getTokenRaw(token);
	                        expr = this.finalize(node, new Node.RegexLiteral(token.regex, raw, token.pattern, token.flags));
	                        break;
	                    default:
	                        expr = this.throwUnexpectedToken(this.nextToken());
	                }
	                break;
	            case 4 /* Keyword */:
	                if (!this.context.strict && this.context.allowYield && this.matchKeyword('yield')) {
	                    expr = this.parseIdentifierName();
	                }
	                else if (!this.context.strict && this.matchKeyword('let')) {
	                    expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
	                }
	                else {
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    if (this.matchKeyword('function')) {
	                        expr = this.parseFunctionExpression();
	                    }
	                    else if (this.matchKeyword('this')) {
	                        this.nextToken();
	                        expr = this.finalize(node, new Node.ThisExpression());
	                    }
	                    else if (this.matchKeyword('class')) {
	                        expr = this.parseClassExpression();
	                    }
	                    else {
	                        expr = this.throwUnexpectedToken(this.nextToken());
	                    }
	                }
	                break;
	            default:
	                expr = this.throwUnexpectedToken(this.nextToken());
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-array-initializer
	    Parser.prototype.parseSpreadElement = function () {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
	        return this.finalize(node, new Node.SpreadElement(arg));
	    };
	    Parser.prototype.parseArrayInitializer = function () {
	        var node = this.createNode();
	        var elements = [];
	        this.expect('[');
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nextToken();
	                elements.push(null);
	            }
	            else if (this.match('...')) {
	                var element = this.parseSpreadElement();
	                if (!this.match(']')) {
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    this.expect(',');
	                }
	                elements.push(element);
	            }
	            else {
	                elements.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new Node.ArrayExpression(elements));
	    };
	    // https://tc39.github.io/ecma262/#sec-object-initializer
	    Parser.prototype.parsePropertyMethod = function (params) {
	        this.context.isAssignmentTarget = false;
	        this.context.isBindingElement = false;
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = params.simple;
	        var body = this.isolateCoverGrammar(this.parseFunctionSourceElements);
	        if (this.context.strict && params.firstRestricted) {
	            this.tolerateUnexpectedToken(params.firstRestricted, params.message);
	        }
	        if (this.context.strict && params.stricted) {
	            this.tolerateUnexpectedToken(params.stricted, params.message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        return body;
	    };
	    Parser.prototype.parsePropertyMethodFunction = function () {
	        var isGenerator = false;
	        var node = this.createNode();
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var params = this.parseFormalParameters();
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
	    };
	    Parser.prototype.parsePropertyMethodAsyncFunction = function () {
	        var node = this.createNode();
	        var previousAllowYield = this.context.allowYield;
	        var previousAwait = this.context.await;
	        this.context.allowYield = false;
	        this.context.await = true;
	        var params = this.parseFormalParameters();
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        this.context.await = previousAwait;
	        return this.finalize(node, new Node.AsyncFunctionExpression(null, params.params, method));
	    };
	    Parser.prototype.parseObjectPropertyKey = function () {
	        var node = this.createNode();
	        var token = this.nextToken();
	        var key;
	        switch (token.type) {
	            case 8 /* StringLiteral */:
	            case 6 /* NumericLiteral */:
	                if (this.context.strict && token.octal) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictOctalLiteral);
	                }
	                var raw = this.getTokenRaw(token);
	                key = this.finalize(node, new Node.Literal(token.value, raw));
	                break;
	            case 3 /* Identifier */:
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 4 /* Keyword */:
	                key = this.finalize(node, new Node.Identifier(token.value));
	                break;
	            case 7 /* Punctuator */:
	                if (token.value === '[') {
	                    key = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    this.expect(']');
	                }
	                else {
	                    key = this.throwUnexpectedToken(token);
	                }
	                break;
	            default:
	                key = this.throwUnexpectedToken(token);
	        }
	        return key;
	    };
	    Parser.prototype.isPropertyKey = function (key, value) {
	        return (key.type === syntax_1.Syntax.Identifier && key.name === value) ||
	            (key.type === syntax_1.Syntax.Literal && key.value === value);
	    };
	    Parser.prototype.parseObjectProperty = function (hasProto) {
	        var node = this.createNode();
	        var token = this.lookahead;
	        var kind;
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var shorthand = false;
	        var isAsync = false;
	        if (token.type === 3 /* Identifier */) {
	            var id = token.value;
	            this.nextToken();
	            computed = this.match('[');
	            isAsync = !this.hasLineTerminator && (id === 'async') &&
	                !this.match(':') && !this.match('(') && !this.match('*');
	            key = isAsync ? this.parseObjectPropertyKey() : this.finalize(node, new Node.Identifier(id));
	        }
	        else if (this.match('*')) {
	            this.nextToken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	        }
	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
	        if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'get' && lookaheadPropertyKey) {
	            kind = 'get';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            this.context.allowYield = false;
	            value = this.parseGetterMethod();
	        }
	        else if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'set' && lookaheadPropertyKey) {
	            kind = 'set';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseSetterMethod();
	        }
	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseGeneratorMethod();
	            method = true;
	        }
	        else {
	            if (!key) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            kind = 'init';
	            if (this.match(':') && !isAsync) {
	                if (!computed && this.isPropertyKey(key, '__proto__')) {
	                    if (hasProto.value) {
	                        this.tolerateError(messages_1.Messages.DuplicateProtoProperty);
	                    }
	                    hasProto.value = true;
	                }
	                this.nextToken();
	                value = this.inheritCoverGrammar(this.parseAssignmentExpression);
	            }
	            else if (this.match('(')) {
	                value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
	                method = true;
	            }
	            else if (token.type === 3 /* Identifier */) {
	                var id = this.finalize(node, new Node.Identifier(token.value));
	                if (this.match('=')) {
	                    this.context.firstCoverInitializedNameError = this.lookahead;
	                    this.nextToken();
	                    shorthand = true;
	                    var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    value = this.finalize(node, new Node.AssignmentPattern(id, init));
	                }
	                else {
	                    shorthand = true;
	                    value = id;
	                }
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	        }
	        return this.finalize(node, new Node.Property(kind, key, computed, value, method, shorthand));
	    };
	    Parser.prototype.parseObjectInitializer = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var properties = [];
	        var hasProto = { value: false };
	        while (!this.match('}')) {
	            properties.push(this.parseObjectProperty(hasProto));
	            if (!this.match('}')) {
	                this.expectCommaSeparator();
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.ObjectExpression(properties));
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literals
	    Parser.prototype.parseTemplateHead = function () {
	        assert_1.assert(this.lookahead.head, 'Template literal must start with a template head');
	        var node = this.createNode();
	        var token = this.nextToken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    Parser.prototype.parseTemplateElement = function () {
	        if (this.lookahead.type !== 10 /* Template */) {
	            this.throwUnexpectedToken();
	        }
	        var node = this.createNode();
	        var token = this.nextToken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    Parser.prototype.parseTemplateLiteral = function () {
	        var node = this.createNode();
	        var expressions = [];
	        var quasis = [];
	        var quasi = this.parseTemplateHead();
	        quasis.push(quasi);
	        while (!quasi.tail) {
	            expressions.push(this.parseExpression());
	            quasi = this.parseTemplateElement();
	            quasis.push(quasi);
	        }
	        return this.finalize(node, new Node.TemplateLiteral(quasis, expressions));
	    };
	    // https://tc39.github.io/ecma262/#sec-grouping-operator
	    Parser.prototype.reinterpretExpressionAsPattern = function (expr) {
	        switch (expr.type) {
	            case syntax_1.Syntax.Identifier:
	            case syntax_1.Syntax.MemberExpression:
	            case syntax_1.Syntax.RestElement:
	            case syntax_1.Syntax.AssignmentPattern:
	                break;
	            case syntax_1.Syntax.SpreadElement:
	                expr.type = syntax_1.Syntax.RestElement;
	                this.reinterpretExpressionAsPattern(expr.argument);
	                break;
	            case syntax_1.Syntax.ArrayExpression:
	                expr.type = syntax_1.Syntax.ArrayPattern;
	                for (var i = 0; i < expr.elements.length; i++) {
	                    if (expr.elements[i] !== null) {
	                        this.reinterpretExpressionAsPattern(expr.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.Syntax.ObjectExpression:
	                expr.type = syntax_1.Syntax.ObjectPattern;
	                for (var i = 0; i < expr.properties.length; i++) {
	                    this.reinterpretExpressionAsPattern(expr.properties[i].value);
	                }
	                break;
	            case syntax_1.Syntax.AssignmentExpression:
	                expr.type = syntax_1.Syntax.AssignmentPattern;
	                delete expr.operator;
	                this.reinterpretExpressionAsPattern(expr.left);
	                break;
	            default:
	                // Allow other node type for tolerant parsing.
	                break;
	        }
	    };
	    Parser.prototype.parseGroupExpression = function () {
	        var expr;
	        this.expect('(');
	        if (this.match(')')) {
	            this.nextToken();
	            if (!this.match('=>')) {
	                this.expect('=>');
	            }
	            expr = {
	                type: ArrowParameterPlaceHolder,
	                params: [],
	                async: false
	            };
	        }
	        else {
	            var startToken = this.lookahead;
	            var params = [];
	            if (this.match('...')) {
	                expr = this.parseRestElement(params);
	                this.expect(')');
	                if (!this.match('=>')) {
	                    this.expect('=>');
	                }
	                expr = {
	                    type: ArrowParameterPlaceHolder,
	                    params: [expr],
	                    async: false
	                };
	            }
	            else {
	                var arrow = false;
	                this.context.isBindingElement = true;
	                expr = this.inheritCoverGrammar(this.parseAssignmentExpression);
	                if (this.match(',')) {
	                    var expressions = [];
	                    this.context.isAssignmentTarget = false;
	                    expressions.push(expr);
	                    while (this.lookahead.type !== 2 /* EOF */) {
	                        if (!this.match(',')) {
	                            break;
	                        }
	                        this.nextToken();
	                        if (this.match(')')) {
	                            this.nextToken();
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretExpressionAsPattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else if (this.match('...')) {
	                            if (!this.context.isBindingElement) {
	                                this.throwUnexpectedToken(this.lookahead);
	                            }
	                            expressions.push(this.parseRestElement(params));
	                            this.expect(')');
	                            if (!this.match('=>')) {
	                                this.expect('=>');
	                            }
	                            this.context.isBindingElement = false;
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretExpressionAsPattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else {
	                            expressions.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
	                        }
	                        if (arrow) {
	                            break;
	                        }
	                    }
	                    if (!arrow) {
	                        expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
	                    }
	                }
	                if (!arrow) {
	                    this.expect(')');
	                    if (this.match('=>')) {
	                        if (expr.type === syntax_1.Syntax.Identifier && expr.name === 'yield') {
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: [expr],
	                                async: false
	                            };
	                        }
	                        if (!arrow) {
	                            if (!this.context.isBindingElement) {
	                                this.throwUnexpectedToken(this.lookahead);
	                            }
	                            if (expr.type === syntax_1.Syntax.SequenceExpression) {
	                                for (var i = 0; i < expr.expressions.length; i++) {
	                                    this.reinterpretExpressionAsPattern(expr.expressions[i]);
	                                }
	                            }
	                            else {
	                                this.reinterpretExpressionAsPattern(expr);
	                            }
	                            var parameters = (expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr]);
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: parameters,
	                                async: false
	                            };
	                        }
	                    }
	                    this.context.isBindingElement = false;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
	    Parser.prototype.parseArguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parseSpreadElement() :
	                    this.isolateCoverGrammar(this.parseAssignmentExpression);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectCommaSeparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    Parser.prototype.isIdentifierName = function (token) {
	        return token.type === 3 /* Identifier */ ||
	            token.type === 4 /* Keyword */ ||
	            token.type === 1 /* BooleanLiteral */ ||
	            token.type === 5 /* NullLiteral */;
	    };
	    Parser.prototype.parseIdentifierName = function () {
	        var node = this.createNode();
	        var token = this.nextToken();
	        if (!this.isIdentifierName(token)) {
	            this.throwUnexpectedToken(token);
	        }
	        return this.finalize(node, new Node.Identifier(token.value));
	    };
	    Parser.prototype.parseNewExpression = function () {
	        var node = this.createNode();
	        var id = this.parseIdentifierName();
	        assert_1.assert(id.name === 'new', 'New expression must start with `new`');
	        var expr;
	        if (this.match('.')) {
	            this.nextToken();
	            if (this.lookahead.type === 3 /* Identifier */ && this.context.inFunctionBody && this.lookahead.value === 'target') {
	                var property = this.parseIdentifierName();
	                expr = new Node.MetaProperty(id, property);
	            }
	            else {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	        }
	        else {
	            var callee = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
	            var args = this.match('(') ? this.parseArguments() : [];
	            expr = new Node.NewExpression(callee, args);
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        return this.finalize(node, expr);
	    };
	    Parser.prototype.parseAsyncArgument = function () {
	        var arg = this.parseAssignmentExpression();
	        this.context.firstCoverInitializedNameError = null;
	        return arg;
	    };
	    Parser.prototype.parseAsyncArguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parseSpreadElement() :
	                    this.isolateCoverGrammar(this.parseAsyncArgument);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectCommaSeparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    Parser.prototype.parseLeftHandSideExpressionAllowCall = function () {
	        var startToken = this.lookahead;
	        var maybeAsync = this.matchContextualKeyword('async');
	        var previousAllowIn = this.context.allowIn;
	        this.context.allowIn = true;
	        var expr;
	        if (this.matchKeyword('super') && this.context.inFunctionBody) {
	            expr = this.createNode();
	            this.nextToken();
	            expr = this.finalize(expr, new Node.Super());
	            if (!this.match('(') && !this.match('.') && !this.match('[')) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	        }
	        else {
	            expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
	        }
	        while (true) {
	            if (this.match('.')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('.');
	                var property = this.parseIdentifierName();
	                expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
	            }
	            else if (this.match('(')) {
	                var asyncArrow = maybeAsync && (startToken.lineNumber === this.lookahead.lineNumber);
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = false;
	                var args = asyncArrow ? this.parseAsyncArguments() : this.parseArguments();
	                expr = this.finalize(this.startNode(startToken), new Node.CallExpression(expr, args));
	                if (asyncArrow && this.match('=>')) {
	                    for (var i = 0; i < args.length; ++i) {
	                        this.reinterpretExpressionAsPattern(args[i]);
	                    }
	                    expr = {
	                        type: ArrowParameterPlaceHolder,
	                        params: args,
	                        async: true
	                    };
	                }
	            }
	            else if (this.match('[')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('[');
	                var property = this.isolateCoverGrammar(this.parseExpression);
	                this.expect(']');
	                expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
	                var quasi = this.parseTemplateLiteral();
	                expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        this.context.allowIn = previousAllowIn;
	        return expr;
	    };
	    Parser.prototype.parseSuper = function () {
	        var node = this.createNode();
	        this.expectKeyword('super');
	        if (!this.match('[') && !this.match('.')) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        return this.finalize(node, new Node.Super());
	    };
	    Parser.prototype.parseLeftHandSideExpression = function () {
	        assert_1.assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
	        var node = this.startNode(this.lookahead);
	        var expr = (this.matchKeyword('super') && this.context.inFunctionBody) ? this.parseSuper() :
	            this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
	        while (true) {
	            if (this.match('[')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('[');
	                var property = this.isolateCoverGrammar(this.parseExpression);
	                this.expect(']');
	                expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
	            }
	            else if (this.match('.')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('.');
	                var property = this.parseIdentifierName();
	                expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
	                var quasi = this.parseTemplateLiteral();
	                expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-update-expressions
	    Parser.prototype.parseUpdateExpression = function () {
	        var expr;
	        var startToken = this.lookahead;
	        if (this.match('++') || this.match('--')) {
	            var node = this.startNode(startToken);
	            var token = this.nextToken();
	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	            if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
	                this.tolerateError(messages_1.Messages.StrictLHSPrefix);
	            }
	            if (!this.context.isAssignmentTarget) {
	                this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	            }
	            var prefix = true;
	            expr = this.finalize(node, new Node.UpdateExpression(token.value, expr, prefix));
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        else {
	            expr = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	            if (!this.hasLineTerminator && this.lookahead.type === 7 /* Punctuator */) {
	                if (this.match('++') || this.match('--')) {
	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
	                        this.tolerateError(messages_1.Messages.StrictLHSPostfix);
	                    }
	                    if (!this.context.isAssignmentTarget) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	                    }
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    var operator = this.nextToken().value;
	                    var prefix = false;
	                    expr = this.finalize(this.startNode(startToken), new Node.UpdateExpression(operator, expr, prefix));
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-unary-operators
	    Parser.prototype.parseAwaitExpression = function () {
	        var node = this.createNode();
	        this.nextToken();
	        var argument = this.parseUnaryExpression();
	        return this.finalize(node, new Node.AwaitExpression(argument));
	    };
	    Parser.prototype.parseUnaryExpression = function () {
	        var expr;
	        if (this.match('+') || this.match('-') || this.match('~') || this.match('!') ||
	            this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
	            var node = this.startNode(this.lookahead);
	            var token = this.nextToken();
	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	            expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
	            if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
	                this.tolerateError(messages_1.Messages.StrictDelete);
	            }
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        else if (this.context.await && this.matchContextualKeyword('await')) {
	            expr = this.parseAwaitExpression();
	        }
	        else {
	            expr = this.parseUpdateExpression();
	        }
	        return expr;
	    };
	    Parser.prototype.parseExponentiationExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	        if (expr.type !== syntax_1.Syntax.UnaryExpression && this.match('**')) {
	            this.nextToken();
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	            var left = expr;
	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
	            expr = this.finalize(this.startNode(startToken), new Node.BinaryExpression('**', left, right));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-exp-operator
	    // https://tc39.github.io/ecma262/#sec-multiplicative-operators
	    // https://tc39.github.io/ecma262/#sec-additive-operators
	    // https://tc39.github.io/ecma262/#sec-bitwise-shift-operators
	    // https://tc39.github.io/ecma262/#sec-relational-operators
	    // https://tc39.github.io/ecma262/#sec-equality-operators
	    // https://tc39.github.io/ecma262/#sec-binary-bitwise-operators
	    // https://tc39.github.io/ecma262/#sec-binary-logical-operators
	    Parser.prototype.binaryPrecedence = function (token) {
	        var op = token.value;
	        var precedence;
	        if (token.type === 7 /* Punctuator */) {
	            precedence = this.operatorPrecedence[op] || 0;
	        }
	        else if (token.type === 4 /* Keyword */) {
	            precedence = (op === 'instanceof' || (this.context.allowIn && op === 'in')) ? 7 : 0;
	        }
	        else {
	            precedence = 0;
	        }
	        return precedence;
	    };
	    Parser.prototype.parseBinaryExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseExponentiationExpression);
	        var token = this.lookahead;
	        var prec = this.binaryPrecedence(token);
	        if (prec > 0) {
	            this.nextToken();
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	            var markers = [startToken, this.lookahead];
	            var left = expr;
	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
	            var stack = [left, token.value, right];
	            var precedences = [prec];
	            while (true) {
	                prec = this.binaryPrecedence(this.lookahead);
	                if (prec <= 0) {
	                    break;
	                }
	                // Reduce: make a binary expression from the three topmost entries.
	                while ((stack.length > 2) && (prec <= precedences[precedences.length - 1])) {
	                    right = stack.pop();
	                    var operator = stack.pop();
	                    precedences.pop();
	                    left = stack.pop();
	                    markers.pop();
	                    var node = this.startNode(markers[markers.length - 1]);
	                    stack.push(this.finalize(node, new Node.BinaryExpression(operator, left, right)));
	                }
	                // Shift.
	                stack.push(this.nextToken().value);
	                precedences.push(prec);
	                markers.push(this.lookahead);
	                stack.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
	            }
	            // Final reduce to clean-up the stack.
	            var i = stack.length - 1;
	            expr = stack[i];
	            markers.pop();
	            while (i > 1) {
	                var node = this.startNode(markers.pop());
	                var operator = stack[i - 1];
	                expr = this.finalize(node, new Node.BinaryExpression(operator, stack[i - 2], expr));
	                i -= 2;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-conditional-operator
	    Parser.prototype.parseConditionalExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseBinaryExpression);
	        if (this.match('?')) {
	            this.nextToken();
	            var previousAllowIn = this.context.allowIn;
	            this.context.allowIn = true;
	            var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            this.context.allowIn = previousAllowIn;
	            this.expect(':');
	            var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            expr = this.finalize(this.startNode(startToken), new Node.ConditionalExpression(expr, consequent, alternate));
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-assignment-operators
	    Parser.prototype.checkPatternParam = function (options, param) {
	        switch (param.type) {
	            case syntax_1.Syntax.Identifier:
	                this.validateParam(options, param, param.name);
	                break;
	            case syntax_1.Syntax.RestElement:
	                this.checkPatternParam(options, param.argument);
	                break;
	            case syntax_1.Syntax.AssignmentPattern:
	                this.checkPatternParam(options, param.left);
	                break;
	            case syntax_1.Syntax.ArrayPattern:
	                for (var i = 0; i < param.elements.length; i++) {
	                    if (param.elements[i] !== null) {
	                        this.checkPatternParam(options, param.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.Syntax.ObjectPattern:
	                for (var i = 0; i < param.properties.length; i++) {
	                    this.checkPatternParam(options, param.properties[i].value);
	                }
	                break;
	            default:
	                break;
	        }
	        options.simple = options.simple && (param instanceof Node.Identifier);
	    };
	    Parser.prototype.reinterpretAsCoverFormalsList = function (expr) {
	        var params = [expr];
	        var options;
	        var asyncArrow = false;
	        switch (expr.type) {
	            case syntax_1.Syntax.Identifier:
	                break;
	            case ArrowParameterPlaceHolder:
	                params = expr.params;
	                asyncArrow = expr.async;
	                break;
	            default:
	                return null;
	        }
	        options = {
	            simple: true,
	            paramSet: {}
	        };
	        for (var i = 0; i < params.length; ++i) {
	            var param = params[i];
	            if (param.type === syntax_1.Syntax.AssignmentPattern) {
	                if (param.right.type === syntax_1.Syntax.YieldExpression) {
	                    if (param.right.argument) {
	                        this.throwUnexpectedToken(this.lookahead);
	                    }
	                    param.right.type = syntax_1.Syntax.Identifier;
	                    param.right.name = 'yield';
	                    delete param.right.argument;
	                    delete param.right.delegate;
	                }
	            }
	            else if (asyncArrow && param.type === syntax_1.Syntax.Identifier && param.name === 'await') {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            this.checkPatternParam(options, param);
	            params[i] = param;
	        }
	        if (this.context.strict || !this.context.allowYield) {
	            for (var i = 0; i < params.length; ++i) {
	                var param = params[i];
	                if (param.type === syntax_1.Syntax.YieldExpression) {
	                    this.throwUnexpectedToken(this.lookahead);
	                }
	            }
	        }
	        if (options.message === messages_1.Messages.StrictParamDupe) {
	            var token = this.context.strict ? options.stricted : options.firstRestricted;
	            this.throwUnexpectedToken(token, options.message);
	        }
	        return {
	            simple: options.simple,
	            params: params,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    };
	    Parser.prototype.parseAssignmentExpression = function () {
	        var expr;
	        if (!this.context.allowYield && this.matchKeyword('yield')) {
	            expr = this.parseYieldExpression();
	        }
	        else {
	            var startToken = this.lookahead;
	            var token = startToken;
	            expr = this.parseConditionalExpression();
	            if (token.type === 3 /* Identifier */ && (token.lineNumber === this.lookahead.lineNumber) && token.value === 'async') {
	                if (this.lookahead.type === 3 /* Identifier */ || this.matchKeyword('yield')) {
	                    var arg = this.parsePrimaryExpression();
	                    this.reinterpretExpressionAsPattern(arg);
	                    expr = {
	                        type: ArrowParameterPlaceHolder,
	                        params: [arg],
	                        async: true
	                    };
	                }
	            }
	            if (expr.type === ArrowParameterPlaceHolder || this.match('=>')) {
	                // https://tc39.github.io/ecma262/#sec-arrow-function-definitions
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                var isAsync = expr.async;
	                var list = this.reinterpretAsCoverFormalsList(expr);
	                if (list) {
	                    if (this.hasLineTerminator) {
	                        this.tolerateUnexpectedToken(this.lookahead);
	                    }
	                    this.context.firstCoverInitializedNameError = null;
	                    var previousStrict = this.context.strict;
	                    var previousAllowStrictDirective = this.context.allowStrictDirective;
	                    this.context.allowStrictDirective = list.simple;
	                    var previousAllowYield = this.context.allowYield;
	                    var previousAwait = this.context.await;
	                    this.context.allowYield = true;
	                    this.context.await = isAsync;
	                    var node = this.startNode(startToken);
	                    this.expect('=>');
	                    var body = void 0;
	                    if (this.match('{')) {
	                        var previousAllowIn = this.context.allowIn;
	                        this.context.allowIn = true;
	                        body = this.parseFunctionSourceElements();
	                        this.context.allowIn = previousAllowIn;
	                    }
	                    else {
	                        body = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    }
	                    var expression = body.type !== syntax_1.Syntax.BlockStatement;
	                    if (this.context.strict && list.firstRestricted) {
	                        this.throwUnexpectedToken(list.firstRestricted, list.message);
	                    }
	                    if (this.context.strict && list.stricted) {
	                        this.tolerateUnexpectedToken(list.stricted, list.message);
	                    }
	                    expr = isAsync ? this.finalize(node, new Node.AsyncArrowFunctionExpression(list.params, body, expression)) :
	                        this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
	                    this.context.strict = previousStrict;
	                    this.context.allowStrictDirective = previousAllowStrictDirective;
	                    this.context.allowYield = previousAllowYield;
	                    this.context.await = previousAwait;
	                }
	            }
	            else {
	                if (this.matchAssign()) {
	                    if (!this.context.isAssignmentTarget) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	                    }
	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier) {
	                        var id = expr;
	                        if (this.scanner.isRestrictedWord(id.name)) {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictLHSAssignment);
	                        }
	                        if (this.scanner.isStrictModeReservedWord(id.name)) {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	                        }
	                    }
	                    if (!this.match('=')) {
	                        this.context.isAssignmentTarget = false;
	                        this.context.isBindingElement = false;
	                    }
	                    else {
	                        this.reinterpretExpressionAsPattern(expr);
	                    }
	                    token = this.nextToken();
	                    var operator = token.value;
	                    var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    expr = this.finalize(this.startNode(startToken), new Node.AssignmentExpression(operator, expr, right));
	                    this.context.firstCoverInitializedNameError = null;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-comma-operator
	    Parser.prototype.parseExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        if (this.match(',')) {
	            var expressions = [];
	            expressions.push(expr);
	            while (this.lookahead.type !== 2 /* EOF */) {
	                if (!this.match(',')) {
	                    break;
	                }
	                this.nextToken();
	                expressions.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
	            }
	            expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-block
	    Parser.prototype.parseStatementListItem = function () {
	        var statement;
	        this.context.isAssignmentTarget = true;
	        this.context.isBindingElement = true;
	        if (this.lookahead.type === 4 /* Keyword */) {
	            switch (this.lookahead.value) {
	                case 'export':
	                    if (!this.context.isModule) {
	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalExportDeclaration);
	                    }
	                    statement = this.parseExportDeclaration();
	                    break;
	                case 'import':
	                    if (!this.context.isModule) {
	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalImportDeclaration);
	                    }
	                    statement = this.parseImportDeclaration();
	                    break;
	                case 'const':
	                    statement = this.parseLexicalDeclaration({ inFor: false });
	                    break;
	                case 'function':
	                    statement = this.parseFunctionDeclaration();
	                    break;
	                case 'class':
	                    statement = this.parseClassDeclaration();
	                    break;
	                case 'let':
	                    statement = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({ inFor: false }) : this.parseStatement();
	                    break;
	                default:
	                    statement = this.parseStatement();
	                    break;
	            }
	        }
	        else {
	            statement = this.parseStatement();
	        }
	        return statement;
	    };
	    Parser.prototype.parseBlock = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var block = [];
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            block.push(this.parseStatementListItem());
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.BlockStatement(block));
	    };
	    // https://tc39.github.io/ecma262/#sec-let-and-const-declarations
	    Parser.prototype.parseLexicalBinding = function (kind, options) {
	        var node = this.createNode();
	        var params = [];
	        var id = this.parsePattern(params, kind);
	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(id.name)) {
	                this.tolerateError(messages_1.Messages.StrictVarName);
	            }
	        }
	        var init = null;
	        if (kind === 'const') {
	            if (!this.matchKeyword('in') && !this.matchContextualKeyword('of')) {
	                if (this.match('=')) {
	                    this.nextToken();
	                    init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                }
	                else {
	                    this.throwError(messages_1.Messages.DeclarationMissingInitializer, 'const');
	                }
	            }
	        }
	        else if ((!options.inFor && id.type !== syntax_1.Syntax.Identifier) || this.match('=')) {
	            this.expect('=');
	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        }
	        return this.finalize(node, new Node.VariableDeclarator(id, init));
	    };
	    Parser.prototype.parseBindingList = function (kind, options) {
	        var list = [this.parseLexicalBinding(kind, options)];
	        while (this.match(',')) {
	            this.nextToken();
	            list.push(this.parseLexicalBinding(kind, options));
	        }
	        return list;
	    };
	    Parser.prototype.isLexicalDeclaration = function () {
	        var state = this.scanner.saveState();
	        this.scanner.scanComments();
	        var next = this.scanner.lex();
	        this.scanner.restoreState(state);
	        return (next.type === 3 /* Identifier */) ||
	            (next.type === 7 /* Punctuator */ && next.value === '[') ||
	            (next.type === 7 /* Punctuator */ && next.value === '{') ||
	            (next.type === 4 /* Keyword */ && next.value === 'let') ||
	            (next.type === 4 /* Keyword */ && next.value === 'yield');
	    };
	    Parser.prototype.parseLexicalDeclaration = function (options) {
	        var node = this.createNode();
	        var kind = this.nextToken().value;
	        assert_1.assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');
	        var declarations = this.parseBindingList(kind, options);
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.VariableDeclaration(declarations, kind));
	    };
	    // https://tc39.github.io/ecma262/#sec-destructuring-binding-patterns
	    Parser.prototype.parseBindingRestElement = function (params, kind) {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.parsePattern(params, kind);
	        return this.finalize(node, new Node.RestElement(arg));
	    };
	    Parser.prototype.parseArrayPattern = function (params, kind) {
	        var node = this.createNode();
	        this.expect('[');
	        var elements = [];
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nextToken();
	                elements.push(null);
	            }
	            else {
	                if (this.match('...')) {
	                    elements.push(this.parseBindingRestElement(params, kind));
	                    break;
	                }
	                else {
	                    elements.push(this.parsePatternWithDefault(params, kind));
	                }
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new Node.ArrayPattern(elements));
	    };
	    Parser.prototype.parsePropertyPattern = function (params, kind) {
	        var node = this.createNode();
	        var computed = false;
	        var shorthand = false;
	        var method = false;
	        var key;
	        var value;
	        if (this.lookahead.type === 3 /* Identifier */) {
	            var keyToken = this.lookahead;
	            key = this.parseVariableIdentifier();
	            var init = this.finalize(node, new Node.Identifier(keyToken.value));
	            if (this.match('=')) {
	                params.push(keyToken);
	                shorthand = true;
	                this.nextToken();
	                var expr = this.parseAssignmentExpression();
	                value = this.finalize(this.startNode(keyToken), new Node.AssignmentPattern(init, expr));
	            }
	            else if (!this.match(':')) {
	                params.push(keyToken);
	                shorthand = true;
	                value = init;
	            }
	            else {
	                this.expect(':');
	                value = this.parsePatternWithDefault(params, kind);
	            }
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            this.expect(':');
	            value = this.parsePatternWithDefault(params, kind);
	        }
	        return this.finalize(node, new Node.Property('init', key, computed, value, method, shorthand));
	    };
	    Parser.prototype.parseObjectPattern = function (params, kind) {
	        var node = this.createNode();
	        var properties = [];
	        this.expect('{');
	        while (!this.match('}')) {
	            properties.push(this.parsePropertyPattern(params, kind));
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.ObjectPattern(properties));
	    };
	    Parser.prototype.parsePattern = function (params, kind) {
	        var pattern;
	        if (this.match('[')) {
	            pattern = this.parseArrayPattern(params, kind);
	        }
	        else if (this.match('{')) {
	            pattern = this.parseObjectPattern(params, kind);
	        }
	        else {
	            if (this.matchKeyword('let') && (kind === 'const' || kind === 'let')) {
	                this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.LetInLexicalBinding);
	            }
	            params.push(this.lookahead);
	            pattern = this.parseVariableIdentifier(kind);
	        }
	        return pattern;
	    };
	    Parser.prototype.parsePatternWithDefault = function (params, kind) {
	        var startToken = this.lookahead;
	        var pattern = this.parsePattern(params, kind);
	        if (this.match('=')) {
	            this.nextToken();
	            var previousAllowYield = this.context.allowYield;
	            this.context.allowYield = true;
	            var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            this.context.allowYield = previousAllowYield;
	            pattern = this.finalize(this.startNode(startToken), new Node.AssignmentPattern(pattern, right));
	        }
	        return pattern;
	    };
	    // https://tc39.github.io/ecma262/#sec-variable-statement
	    Parser.prototype.parseVariableIdentifier = function (kind) {
	        var node = this.createNode();
	        var token = this.nextToken();
	        if (token.type === 4 /* Keyword */ && token.value === 'yield') {
	            if (this.context.strict) {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	            }
	            else if (!this.context.allowYield) {
	                this.throwUnexpectedToken(token);
	            }
	        }
	        else if (token.type !== 3 /* Identifier */) {
	            if (this.context.strict && token.type === 4 /* Keyword */ && this.scanner.isStrictModeReservedWord(token.value)) {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	            }
	            else {
	                if (this.context.strict || token.value !== 'let' || kind !== 'var') {
	                    this.throwUnexpectedToken(token);
	                }
	            }
	        }
	        else if ((this.context.isModule || this.context.await) && token.type === 3 /* Identifier */ && token.value === 'await') {
	            this.tolerateUnexpectedToken(token);
	        }
	        return this.finalize(node, new Node.Identifier(token.value));
	    };
	    Parser.prototype.parseVariableDeclaration = function (options) {
	        var node = this.createNode();
	        var params = [];
	        var id = this.parsePattern(params, 'var');
	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(id.name)) {
	                this.tolerateError(messages_1.Messages.StrictVarName);
	            }
	        }
	        var init = null;
	        if (this.match('=')) {
	            this.nextToken();
	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        }
	        else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
	            this.expect('=');
	        }
	        return this.finalize(node, new Node.VariableDeclarator(id, init));
	    };
	    Parser.prototype.parseVariableDeclarationList = function (options) {
	        var opt = { inFor: options.inFor };
	        var list = [];
	        list.push(this.parseVariableDeclaration(opt));
	        while (this.match(',')) {
	            this.nextToken();
	            list.push(this.parseVariableDeclaration(opt));
	        }
	        return list;
	    };
	    Parser.prototype.parseVariableStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('var');
	        var declarations = this.parseVariableDeclarationList({ inFor: false });
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.VariableDeclaration(declarations, 'var'));
	    };
	    // https://tc39.github.io/ecma262/#sec-empty-statement
	    Parser.prototype.parseEmptyStatement = function () {
	        var node = this.createNode();
	        this.expect(';');
	        return this.finalize(node, new Node.EmptyStatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-expression-statement
	    Parser.prototype.parseExpressionStatement = function () {
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ExpressionStatement(expr));
	    };
	    // https://tc39.github.io/ecma262/#sec-if-statement
	    Parser.prototype.parseIfClause = function () {
	        if (this.context.strict && this.matchKeyword('function')) {
	            this.tolerateError(messages_1.Messages.StrictFunction);
	        }
	        return this.parseStatement();
	    };
	    Parser.prototype.parseIfStatement = function () {
	        var node = this.createNode();
	        var consequent;
	        var alternate = null;
	        this.expectKeyword('if');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            consequent = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            consequent = this.parseIfClause();
	            if (this.matchKeyword('else')) {
	                this.nextToken();
	                alternate = this.parseIfClause();
	            }
	        }
	        return this.finalize(node, new Node.IfStatement(test, consequent, alternate));
	    };
	    // https://tc39.github.io/ecma262/#sec-do-while-statement
	    Parser.prototype.parseDoWhileStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('do');
	        var previousInIteration = this.context.inIteration;
	        this.context.inIteration = true;
	        var body = this.parseStatement();
	        this.context.inIteration = previousInIteration;
	        this.expectKeyword('while');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	        }
	        else {
	            this.expect(')');
	            if (this.match(';')) {
	                this.nextToken();
	            }
	        }
	        return this.finalize(node, new Node.DoWhileStatement(body, test));
	    };
	    // https://tc39.github.io/ecma262/#sec-while-statement
	    Parser.prototype.parseWhileStatement = function () {
	        var node = this.createNode();
	        var body;
	        this.expectKeyword('while');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            var previousInIteration = this.context.inIteration;
	            this.context.inIteration = true;
	            body = this.parseStatement();
	            this.context.inIteration = previousInIteration;
	        }
	        return this.finalize(node, new Node.WhileStatement(test, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-for-statement
	    // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements
	    Parser.prototype.parseForStatement = function () {
	        var init = null;
	        var test = null;
	        var update = null;
	        var forIn = true;
	        var left, right;
	        var node = this.createNode();
	        this.expectKeyword('for');
	        this.expect('(');
	        if (this.match(';')) {
	            this.nextToken();
	        }
	        else {
	            if (this.matchKeyword('var')) {
	                init = this.createNode();
	                this.nextToken();
	                var previousAllowIn = this.context.allowIn;
	                this.context.allowIn = false;
	                var declarations = this.parseVariableDeclarationList({ inFor: true });
	                this.context.allowIn = previousAllowIn;
	                if (declarations.length === 1 && this.matchKeyword('in')) {
	                    var decl = declarations[0];
	                    if (decl.init && (decl.id.type === syntax_1.Syntax.ArrayPattern || decl.id.type === syntax_1.Syntax.ObjectPattern || this.context.strict)) {
	                        this.tolerateError(messages_1.Messages.ForInOfLoopInitializer, 'for-in');
	                    }
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                }
	                else {
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.expect(';');
	                }
	            }
	            else if (this.matchKeyword('const') || this.matchKeyword('let')) {
	                init = this.createNode();
	                var kind = this.nextToken().value;
	                if (!this.context.strict && this.lookahead.value === 'in') {
	                    init = this.finalize(init, new Node.Identifier(kind));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else {
	                    var previousAllowIn = this.context.allowIn;
	                    this.context.allowIn = false;
	                    var declarations = this.parseBindingList(kind, { inFor: true });
	                    this.context.allowIn = previousAllowIn;
	                    if (declarations.length === 1 && declarations[0].init === null && this.matchKeyword('in')) {
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                        this.nextToken();
	                        left = init;
	                        right = this.parseExpression();
	                        init = null;
	                    }
	                    else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                        this.nextToken();
	                        left = init;
	                        right = this.parseAssignmentExpression();
	                        init = null;
	                        forIn = false;
	                    }
	                    else {
	                        this.consumeSemicolon();
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                    }
	                }
	            }
	            else {
	                var initStartToken = this.lookahead;
	                var previousAllowIn = this.context.allowIn;
	                this.context.allowIn = false;
	                init = this.inheritCoverGrammar(this.parseAssignmentExpression);
	                this.context.allowIn = previousAllowIn;
	                if (this.matchKeyword('in')) {
	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInForIn);
	                    }
	                    this.nextToken();
	                    this.reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else if (this.matchContextualKeyword('of')) {
	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
	                    }
	                    this.nextToken();
	                    this.reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = this.parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                }
	                else {
	                    if (this.match(',')) {
	                        var initSeq = [init];
	                        while (this.match(',')) {
	                            this.nextToken();
	                            initSeq.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
	                        }
	                        init = this.finalize(this.startNode(initStartToken), new Node.SequenceExpression(initSeq));
	                    }
	                    this.expect(';');
	                }
	            }
	        }
	        if (typeof left === 'undefined') {
	            if (!this.match(';')) {
	                test = this.parseExpression();
	            }
	            this.expect(';');
	            if (!this.match(')')) {
	                update = this.parseExpression();
	            }
	        }
	        var body;
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            var previousInIteration = this.context.inIteration;
	            this.context.inIteration = true;
	            body = this.isolateCoverGrammar(this.parseStatement);
	            this.context.inIteration = previousInIteration;
	        }
	        return (typeof left === 'undefined') ?
	            this.finalize(node, new Node.ForStatement(init, test, update, body)) :
	            forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) :
	                this.finalize(node, new Node.ForOfStatement(left, right, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-continue-statement
	    Parser.prototype.parseContinueStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('continue');
	        var label = null;
	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
	            var id = this.parseVariableIdentifier();
	            label = id;
	            var key = '$' + id.name;
	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
	            }
	        }
	        this.consumeSemicolon();
	        if (label === null && !this.context.inIteration) {
	            this.throwError(messages_1.Messages.IllegalContinue);
	        }
	        return this.finalize(node, new Node.ContinueStatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-break-statement
	    Parser.prototype.parseBreakStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('break');
	        var label = null;
	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
	            var id = this.parseVariableIdentifier();
	            var key = '$' + id.name;
	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
	            }
	            label = id;
	        }
	        this.consumeSemicolon();
	        if (label === null && !this.context.inIteration && !this.context.inSwitch) {
	            this.throwError(messages_1.Messages.IllegalBreak);
	        }
	        return this.finalize(node, new Node.BreakStatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-return-statement
	    Parser.prototype.parseReturnStatement = function () {
	        if (!this.context.inFunctionBody) {
	            this.tolerateError(messages_1.Messages.IllegalReturn);
	        }
	        var node = this.createNode();
	        this.expectKeyword('return');
	        var hasArgument = !this.match(';') && !this.match('}') &&
	            !this.hasLineTerminator && this.lookahead.type !== 2 /* EOF */;
	        var argument = hasArgument ? this.parseExpression() : null;
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ReturnStatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-with-statement
	    Parser.prototype.parseWithStatement = function () {
	        if (this.context.strict) {
	            this.tolerateError(messages_1.Messages.StrictModeWith);
	        }
	        var node = this.createNode();
	        var body;
	        this.expectKeyword('with');
	        this.expect('(');
	        var object = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            body = this.parseStatement();
	        }
	        return this.finalize(node, new Node.WithStatement(object, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-switch-statement
	    Parser.prototype.parseSwitchCase = function () {
	        var node = this.createNode();
	        var test;
	        if (this.matchKeyword('default')) {
	            this.nextToken();
	            test = null;
	        }
	        else {
	            this.expectKeyword('case');
	            test = this.parseExpression();
	        }
	        this.expect(':');
	        var consequent = [];
	        while (true) {
	            if (this.match('}') || this.matchKeyword('default') || this.matchKeyword('case')) {
	                break;
	            }
	            consequent.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.SwitchCase(test, consequent));
	    };
	    Parser.prototype.parseSwitchStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('switch');
	        this.expect('(');
	        var discriminant = this.parseExpression();
	        this.expect(')');
	        var previousInSwitch = this.context.inSwitch;
	        this.context.inSwitch = true;
	        var cases = [];
	        var defaultFound = false;
	        this.expect('{');
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            var clause = this.parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    this.throwError(messages_1.Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }
	        this.expect('}');
	        this.context.inSwitch = previousInSwitch;
	        return this.finalize(node, new Node.SwitchStatement(discriminant, cases));
	    };
	    // https://tc39.github.io/ecma262/#sec-labelled-statements
	    Parser.prototype.parseLabelledStatement = function () {
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        var statement;
	        if ((expr.type === syntax_1.Syntax.Identifier) && this.match(':')) {
	            this.nextToken();
	            var id = expr;
	            var key = '$' + id.name;
	            if (Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.Redeclaration, 'Label', id.name);
	            }
	            this.context.labelSet[key] = true;
	            var body = void 0;
	            if (this.matchKeyword('class')) {
	                this.tolerateUnexpectedToken(this.lookahead);
	                body = this.parseClassDeclaration();
	            }
	            else if (this.matchKeyword('function')) {
	                var token = this.lookahead;
	                var declaration = this.parseFunctionDeclaration();
	                if (this.context.strict) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunction);
	                }
	                else if (declaration.generator) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.GeneratorInLegacyContext);
	                }
	                body = declaration;
	            }
	            else {
	                body = this.parseStatement();
	            }
	            delete this.context.labelSet[key];
	            statement = new Node.LabeledStatement(id, body);
	        }
	        else {
	            this.consumeSemicolon();
	            statement = new Node.ExpressionStatement(expr);
	        }
	        return this.finalize(node, statement);
	    };
	    // https://tc39.github.io/ecma262/#sec-throw-statement
	    Parser.prototype.parseThrowStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('throw');
	        if (this.hasLineTerminator) {
	            this.throwError(messages_1.Messages.NewlineAfterThrow);
	        }
	        var argument = this.parseExpression();
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ThrowStatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-try-statement
	    Parser.prototype.parseCatchClause = function () {
	        var node = this.createNode();
	        this.expectKeyword('catch');
	        this.expect('(');
	        if (this.match(')')) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        var params = [];
	        var param = this.parsePattern(params);
	        var paramMap = {};
	        for (var i = 0; i < params.length; i++) {
	            var key = '$' + params[i].value;
	            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
	                this.tolerateError(messages_1.Messages.DuplicateBinding, params[i].value);
	            }
	            paramMap[key] = true;
	        }
	        if (this.context.strict && param.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(param.name)) {
	                this.tolerateError(messages_1.Messages.StrictCatchVariable);
	            }
	        }
	        this.expect(')');
	        var body = this.parseBlock();
	        return this.finalize(node, new Node.CatchClause(param, body));
	    };
	    Parser.prototype.parseFinallyClause = function () {
	        this.expectKeyword('finally');
	        return this.parseBlock();
	    };
	    Parser.prototype.parseTryStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('try');
	        var block = this.parseBlock();
	        var handler = this.matchKeyword('catch') ? this.parseCatchClause() : null;
	        var finalizer = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
	        if (!handler && !finalizer) {
	            this.throwError(messages_1.Messages.NoCatchOrFinally);
	        }
	        return this.finalize(node, new Node.TryStatement(block, handler, finalizer));
	    };
	    // https://tc39.github.io/ecma262/#sec-debugger-statement
	    Parser.prototype.parseDebuggerStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('debugger');
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.DebuggerStatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
	    Parser.prototype.parseStatement = function () {
	        var statement;
	        switch (this.lookahead.type) {
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 6 /* NumericLiteral */:
	            case 8 /* StringLiteral */:
	            case 10 /* Template */:
	            case 9 /* RegularExpression */:
	                statement = this.parseExpressionStatement();
	                break;
	            case 7 /* Punctuator */:
	                var value = this.lookahead.value;
	                if (value === '{') {
	                    statement = this.parseBlock();
	                }
	                else if (value === '(') {
	                    statement = this.parseExpressionStatement();
	                }
	                else if (value === ';') {
	                    statement = this.parseEmptyStatement();
	                }
	                else {
	                    statement = this.parseExpressionStatement();
	                }
	                break;
	            case 3 /* Identifier */:
	                statement = this.matchAsyncFunction() ? this.parseFunctionDeclaration() : this.parseLabelledStatement();
	                break;
	            case 4 /* Keyword */:
	                switch (this.lookahead.value) {
	                    case 'break':
	                        statement = this.parseBreakStatement();
	                        break;
	                    case 'continue':
	                        statement = this.parseContinueStatement();
	                        break;
	                    case 'debugger':
	                        statement = this.parseDebuggerStatement();
	                        break;
	                    case 'do':
	                        statement = this.parseDoWhileStatement();
	                        break;
	                    case 'for':
	                        statement = this.parseForStatement();
	                        break;
	                    case 'function':
	                        statement = this.parseFunctionDeclaration();
	                        break;
	                    case 'if':
	                        statement = this.parseIfStatement();
	                        break;
	                    case 'return':
	                        statement = this.parseReturnStatement();
	                        break;
	                    case 'switch':
	                        statement = this.parseSwitchStatement();
	                        break;
	                    case 'throw':
	                        statement = this.parseThrowStatement();
	                        break;
	                    case 'try':
	                        statement = this.parseTryStatement();
	                        break;
	                    case 'var':
	                        statement = this.parseVariableStatement();
	                        break;
	                    case 'while':
	                        statement = this.parseWhileStatement();
	                        break;
	                    case 'with':
	                        statement = this.parseWithStatement();
	                        break;
	                    default:
	                        statement = this.parseExpressionStatement();
	                        break;
	                }
	                break;
	            default:
	                statement = this.throwUnexpectedToken(this.lookahead);
	        }
	        return statement;
	    };
	    // https://tc39.github.io/ecma262/#sec-function-definitions
	    Parser.prototype.parseFunctionSourceElements = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var body = this.parseDirectivePrologues();
	        var previousLabelSet = this.context.labelSet;
	        var previousInIteration = this.context.inIteration;
	        var previousInSwitch = this.context.inSwitch;
	        var previousInFunctionBody = this.context.inFunctionBody;
	        this.context.labelSet = {};
	        this.context.inIteration = false;
	        this.context.inSwitch = false;
	        this.context.inFunctionBody = true;
	        while (this.lookahead.type !== 2 /* EOF */) {
	            if (this.match('}')) {
	                break;
	            }
	            body.push(this.parseStatementListItem());
	        }
	        this.expect('}');
	        this.context.labelSet = previousLabelSet;
	        this.context.inIteration = previousInIteration;
	        this.context.inSwitch = previousInSwitch;
	        this.context.inFunctionBody = previousInFunctionBody;
	        return this.finalize(node, new Node.BlockStatement(body));
	    };
	    Parser.prototype.validateParam = function (options, param, name) {
	        var key = '$' + name;
	        if (this.context.strict) {
	            if (this.scanner.isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamName;
	            }
	            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamDupe;
	            }
	        }
	        else if (!options.firstRestricted) {
	            if (this.scanner.isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = messages_1.Messages.StrictParamName;
	            }
	            else if (this.scanner.isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = messages_1.Messages.StrictReservedWord;
	            }
	            else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamDupe;
	            }
	        }
	        /* istanbul ignore next */
	        if (typeof Object.defineProperty === 'function') {
	            Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
	        }
	        else {
	            options.paramSet[key] = true;
	        }
	    };
	    Parser.prototype.parseRestElement = function (params) {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.parsePattern(params);
	        if (this.match('=')) {
	            this.throwError(messages_1.Messages.DefaultRestParameter);
	        }
	        if (!this.match(')')) {
	            this.throwError(messages_1.Messages.ParameterAfterRestParameter);
	        }
	        return this.finalize(node, new Node.RestElement(arg));
	    };
	    Parser.prototype.parseFormalParameter = function (options) {
	        var params = [];
	        var param = this.match('...') ? this.parseRestElement(params) : this.parsePatternWithDefault(params);
	        for (var i = 0; i < params.length; i++) {
	            this.validateParam(options, params[i], params[i].value);
	        }
	        options.simple = options.simple && (param instanceof Node.Identifier);
	        options.params.push(param);
	    };
	    Parser.prototype.parseFormalParameters = function (firstRestricted) {
	        var options;
	        options = {
	            simple: true,
	            params: [],
	            firstRestricted: firstRestricted
	        };
	        this.expect('(');
	        if (!this.match(')')) {
	            options.paramSet = {};
	            while (this.lookahead.type !== 2 /* EOF */) {
	                this.parseFormalParameter(options);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expect(',');
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return {
	            simple: options.simple,
	            params: options.params,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    };
	    Parser.prototype.matchAsyncFunction = function () {
	        var match = this.matchContextualKeyword('async');
	        if (match) {
	            var state = this.scanner.saveState();
	            this.scanner.scanComments();
	            var next = this.scanner.lex();
	            this.scanner.restoreState(state);
	            match = (state.lineNumber === next.lineNumber) && (next.type === 4 /* Keyword */) && (next.value === 'function');
	        }
	        return match;
	    };
	    Parser.prototype.parseFunctionDeclaration = function (identifierIsOptional) {
	        var node = this.createNode();
	        var isAsync = this.matchContextualKeyword('async');
	        if (isAsync) {
	            this.nextToken();
	        }
	        this.expectKeyword('function');
	        var isGenerator = isAsync ? false : this.match('*');
	        if (isGenerator) {
	            this.nextToken();
	        }
	        var message;
	        var id = null;
	        var firstRestricted = null;
	        if (!identifierIsOptional || !this.match('(')) {
	            var token = this.lookahead;
	            id = this.parseVariableIdentifier();
	            if (this.context.strict) {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
	                }
	            }
	            else {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictFunctionName;
	                }
	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictReservedWord;
	                }
	            }
	        }
	        var previousAllowAwait = this.context.await;
	        var previousAllowYield = this.context.allowYield;
	        this.context.await = isAsync;
	        this.context.allowYield = !isGenerator;
	        var formalParameters = this.parseFormalParameters(firstRestricted);
	        var params = formalParameters.params;
	        var stricted = formalParameters.stricted;
	        firstRestricted = formalParameters.firstRestricted;
	        if (formalParameters.message) {
	            message = formalParameters.message;
	        }
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = formalParameters.simple;
	        var body = this.parseFunctionSourceElements();
	        if (this.context.strict && firstRestricted) {
	            this.throwUnexpectedToken(firstRestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateUnexpectedToken(stricted, message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        this.context.await = previousAllowAwait;
	        this.context.allowYield = previousAllowYield;
	        return isAsync ? this.finalize(node, new Node.AsyncFunctionDeclaration(id, params, body)) :
	            this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
	    };
	    Parser.prototype.parseFunctionExpression = function () {
	        var node = this.createNode();
	        var isAsync = this.matchContextualKeyword('async');
	        if (isAsync) {
	            this.nextToken();
	        }
	        this.expectKeyword('function');
	        var isGenerator = isAsync ? false : this.match('*');
	        if (isGenerator) {
	            this.nextToken();
	        }
	        var message;
	        var id = null;
	        var firstRestricted;
	        var previousAllowAwait = this.context.await;
	        var previousAllowYield = this.context.allowYield;
	        this.context.await = isAsync;
	        this.context.allowYield = !isGenerator;
	        if (!this.match('(')) {
	            var token = this.lookahead;
	            id = (!this.context.strict && !isGenerator && this.matchKeyword('yield')) ? this.parseIdentifierName() : this.parseVariableIdentifier();
	            if (this.context.strict) {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
	                }
	            }
	            else {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictFunctionName;
	                }
	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictReservedWord;
	                }
	            }
	        }
	        var formalParameters = this.parseFormalParameters(firstRestricted);
	        var params = formalParameters.params;
	        var stricted = formalParameters.stricted;
	        firstRestricted = formalParameters.firstRestricted;
	        if (formalParameters.message) {
	            message = formalParameters.message;
	        }
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = formalParameters.simple;
	        var body = this.parseFunctionSourceElements();
	        if (this.context.strict && firstRestricted) {
	            this.throwUnexpectedToken(firstRestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateUnexpectedToken(stricted, message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        this.context.await = previousAllowAwait;
	        this.context.allowYield = previousAllowYield;
	        return isAsync ? this.finalize(node, new Node.AsyncFunctionExpression(id, params, body)) :
	            this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
	    Parser.prototype.parseDirective = function () {
	        var token = this.lookahead;
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        var directive = (expr.type === syntax_1.Syntax.Literal) ? this.getTokenRaw(token).slice(1, -1) : null;
	        this.consumeSemicolon();
	        return this.finalize(node, directive ? new Node.Directive(expr, directive) : new Node.ExpressionStatement(expr));
	    };
	    Parser.prototype.parseDirectivePrologues = function () {
	        var firstRestricted = null;
	        var body = [];
	        while (true) {
	            var token = this.lookahead;
	            if (token.type !== 8 /* StringLiteral */) {
	                break;
	            }
	            var statement = this.parseDirective();
	            body.push(statement);
	            var directive = statement.directive;
	            if (typeof directive !== 'string') {
	                break;
	            }
	            if (directive === 'use strict') {
	                this.context.strict = true;
	                if (firstRestricted) {
	                    this.tolerateUnexpectedToken(firstRestricted, messages_1.Messages.StrictOctalLiteral);
	                }
	                if (!this.context.allowStrictDirective) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.IllegalLanguageModeDirective);
	                }
	            }
	            else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }
	        return body;
	    };
	    // https://tc39.github.io/ecma262/#sec-method-definitions
	    Parser.prototype.qualifiedPropertyName = function (token) {
	        switch (token.type) {
	            case 3 /* Identifier */:
	            case 8 /* StringLiteral */:
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 6 /* NumericLiteral */:
	            case 4 /* Keyword */:
	                return true;
	            case 7 /* Punctuator */:
	                return token.value === '[';
	            default:
	                break;
	        }
	        return false;
	    };
	    Parser.prototype.parseGetterMethod = function () {
	        var node = this.createNode();
	        var isGenerator = false;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var formalParameters = this.parseFormalParameters();
	        if (formalParameters.params.length > 0) {
	            this.tolerateError(messages_1.Messages.BadGetterArity);
	        }
	        var method = this.parsePropertyMethod(formalParameters);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
	    };
	    Parser.prototype.parseSetterMethod = function () {
	        var node = this.createNode();
	        var isGenerator = false;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var formalParameters = this.parseFormalParameters();
	        if (formalParameters.params.length !== 1) {
	            this.tolerateError(messages_1.Messages.BadSetterArity);
	        }
	        else if (formalParameters.params[0] instanceof Node.RestElement) {
	            this.tolerateError(messages_1.Messages.BadSetterRestParameter);
	        }
	        var method = this.parsePropertyMethod(formalParameters);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
	    };
	    Parser.prototype.parseGeneratorMethod = function () {
	        var node = this.createNode();
	        var isGenerator = true;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = true;
	        var params = this.parseFormalParameters();
	        this.context.allowYield = false;
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-generator-function-definitions
	    Parser.prototype.isStartOfExpression = function () {
	        var start = true;
	        var value = this.lookahead.value;
	        switch (this.lookahead.type) {
	            case 7 /* Punctuator */:
	                start = (value === '[') || (value === '(') || (value === '{') ||
	                    (value === '+') || (value === '-') ||
	                    (value === '!') || (value === '~') ||
	                    (value === '++') || (value === '--') ||
	                    (value === '/') || (value === '/='); // regular expression literal
	                break;
	            case 4 /* Keyword */:
	                start = (value === 'class') || (value === 'delete') ||
	                    (value === 'function') || (value === 'let') || (value === 'new') ||
	                    (value === 'super') || (value === 'this') || (value === 'typeof') ||
	                    (value === 'void') || (value === 'yield');
	                break;
	            default:
	                break;
	        }
	        return start;
	    };
	    Parser.prototype.parseYieldExpression = function () {
	        var node = this.createNode();
	        this.expectKeyword('yield');
	        var argument = null;
	        var delegate = false;
	        if (!this.hasLineTerminator) {
	            var previousAllowYield = this.context.allowYield;
	            this.context.allowYield = false;
	            delegate = this.match('*');
	            if (delegate) {
	                this.nextToken();
	                argument = this.parseAssignmentExpression();
	            }
	            else if (this.isStartOfExpression()) {
	                argument = this.parseAssignmentExpression();
	            }
	            this.context.allowYield = previousAllowYield;
	        }
	        return this.finalize(node, new Node.YieldExpression(argument, delegate));
	    };
	    // https://tc39.github.io/ecma262/#sec-class-definitions
	    Parser.prototype.parseClassElement = function (hasConstructor) {
	        var token = this.lookahead;
	        var node = this.createNode();
	        var kind = '';
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var isStatic = false;
	        var isAsync = false;
	        if (this.match('*')) {
	            this.nextToken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            var id = key;
	            if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
	                token = this.lookahead;
	                isStatic = true;
	                computed = this.match('[');
	                if (this.match('*')) {
	                    this.nextToken();
	                }
	                else {
	                    key = this.parseObjectPropertyKey();
	                }
	            }
	            if ((token.type === 3 /* Identifier */) && !this.hasLineTerminator && (token.value === 'async')) {
	                var punctuator = this.lookahead.value;
	                if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
	                    isAsync = true;
	                    token = this.lookahead;
	                    key = this.parseObjectPropertyKey();
	                    if (token.type === 3 /* Identifier */) {
	                        if (token.value === 'get' || token.value === 'set') {
	                            this.tolerateUnexpectedToken(token);
	                        }
	                        else if (token.value === 'constructor') {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.ConstructorIsAsync);
	                        }
	                    }
	                }
	            }
	        }
	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
	        if (token.type === 3 /* Identifier */) {
	            if (token.value === 'get' && lookaheadPropertyKey) {
	                kind = 'get';
	                computed = this.match('[');
	                key = this.parseObjectPropertyKey();
	                this.context.allowYield = false;
	                value = this.parseGetterMethod();
	            }
	            else if (token.value === 'set' && lookaheadPropertyKey) {
	                kind = 'set';
	                computed = this.match('[');
	                key = this.parseObjectPropertyKey();
	                value = this.parseSetterMethod();
	            }
	        }
	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseGeneratorMethod();
	            method = true;
	        }
	        if (!kind && key && this.match('(')) {
	            kind = 'init';
	            value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
	            method = true;
	        }
	        if (!kind) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        if (kind === 'init') {
	            kind = 'method';
	        }
	        if (!computed) {
	            if (isStatic && this.isPropertyKey(key, 'prototype')) {
	                this.throwUnexpectedToken(token, messages_1.Messages.StaticPrototype);
	            }
	            if (!isStatic && this.isPropertyKey(key, 'constructor')) {
	                if (kind !== 'method' || !method || (value && value.generator)) {
	                    this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
	                }
	                if (hasConstructor.value) {
	                    this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
	                }
	                else {
	                    hasConstructor.value = true;
	                }
	                kind = 'constructor';
	            }
	        }
	        return this.finalize(node, new Node.MethodDefinition(key, computed, value, kind, isStatic));
	    };
	    Parser.prototype.parseClassElementList = function () {
	        var body = [];
	        var hasConstructor = { value: false };
	        this.expect('{');
	        while (!this.match('}')) {
	            if (this.match(';')) {
	                this.nextToken();
	            }
	            else {
	                body.push(this.parseClassElement(hasConstructor));
	            }
	        }
	        this.expect('}');
	        return body;
	    };
	    Parser.prototype.parseClassBody = function () {
	        var node = this.createNode();
	        var elementList = this.parseClassElementList();
	        return this.finalize(node, new Node.ClassBody(elementList));
	    };
	    Parser.prototype.parseClassDeclaration = function (identifierIsOptional) {
	        var node = this.createNode();
	        var previousStrict = this.context.strict;
	        this.context.strict = true;
	        this.expectKeyword('class');
	        var id = (identifierIsOptional && (this.lookahead.type !== 3 /* Identifier */)) ? null : this.parseVariableIdentifier();
	        var superClass = null;
	        if (this.matchKeyword('extends')) {
	            this.nextToken();
	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	        }
	        var classBody = this.parseClassBody();
	        this.context.strict = previousStrict;
	        return this.finalize(node, new Node.ClassDeclaration(id, superClass, classBody));
	    };
	    Parser.prototype.parseClassExpression = function () {
	        var node = this.createNode();
	        var previousStrict = this.context.strict;
	        this.context.strict = true;
	        this.expectKeyword('class');
	        var id = (this.lookahead.type === 3 /* Identifier */) ? this.parseVariableIdentifier() : null;
	        var superClass = null;
	        if (this.matchKeyword('extends')) {
	            this.nextToken();
	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	        }
	        var classBody = this.parseClassBody();
	        this.context.strict = previousStrict;
	        return this.finalize(node, new Node.ClassExpression(id, superClass, classBody));
	    };
	    // https://tc39.github.io/ecma262/#sec-scripts
	    // https://tc39.github.io/ecma262/#sec-modules
	    Parser.prototype.parseModule = function () {
	        this.context.strict = true;
	        this.context.isModule = true;
	        var node = this.createNode();
	        var body = this.parseDirectivePrologues();
	        while (this.lookahead.type !== 2 /* EOF */) {
	            body.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.Module(body));
	    };
	    Parser.prototype.parseScript = function () {
	        var node = this.createNode();
	        var body = this.parseDirectivePrologues();
	        while (this.lookahead.type !== 2 /* EOF */) {
	            body.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.Script(body));
	    };
	    // https://tc39.github.io/ecma262/#sec-imports
	    Parser.prototype.parseModuleSpecifier = function () {
	        var node = this.createNode();
	        if (this.lookahead.type !== 8 /* StringLiteral */) {
	            this.throwError(messages_1.Messages.InvalidModuleSpecifier);
	        }
	        var token = this.nextToken();
	        var raw = this.getTokenRaw(token);
	        return this.finalize(node, new Node.Literal(token.value, raw));
	    };
	    // import {<foo as bar>} ...;
	    Parser.prototype.parseImportSpecifier = function () {
	        var node = this.createNode();
	        var imported;
	        var local;
	        if (this.lookahead.type === 3 /* Identifier */) {
	            imported = this.parseVariableIdentifier();
	            local = imported;
	            if (this.matchContextualKeyword('as')) {
	                this.nextToken();
	                local = this.parseVariableIdentifier();
	            }
	        }
	        else {
	            imported = this.parseIdentifierName();
	            local = imported;
	            if (this.matchContextualKeyword('as')) {
	                this.nextToken();
	                local = this.parseVariableIdentifier();
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	        }
	        return this.finalize(node, new Node.ImportSpecifier(local, imported));
	    };
	    // {foo, bar as bas}
	    Parser.prototype.parseNamedImports = function () {
	        this.expect('{');
	        var specifiers = [];
	        while (!this.match('}')) {
	            specifiers.push(this.parseImportSpecifier());
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return specifiers;
	    };
	    // import <foo> ...;
	    Parser.prototype.parseImportDefaultSpecifier = function () {
	        var node = this.createNode();
	        var local = this.parseIdentifierName();
	        return this.finalize(node, new Node.ImportDefaultSpecifier(local));
	    };
	    // import <* as foo> ...;
	    Parser.prototype.parseImportNamespaceSpecifier = function () {
	        var node = this.createNode();
	        this.expect('*');
	        if (!this.matchContextualKeyword('as')) {
	            this.throwError(messages_1.Messages.NoAsAfterImportNamespace);
	        }
	        this.nextToken();
	        var local = this.parseIdentifierName();
	        return this.finalize(node, new Node.ImportNamespaceSpecifier(local));
	    };
	    Parser.prototype.parseImportDeclaration = function () {
	        if (this.context.inFunctionBody) {
	            this.throwError(messages_1.Messages.IllegalImportDeclaration);
	        }
	        var node = this.createNode();
	        this.expectKeyword('import');
	        var src;
	        var specifiers = [];
	        if (this.lookahead.type === 8 /* StringLiteral */) {
	            // import 'foo';
	            src = this.parseModuleSpecifier();
	        }
	        else {
	            if (this.match('{')) {
	                // import {bar}
	                specifiers = specifiers.concat(this.parseNamedImports());
	            }
	            else if (this.match('*')) {
	                // import * as foo
	                specifiers.push(this.parseImportNamespaceSpecifier());
	            }
	            else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
	                // import foo
	                specifiers.push(this.parseImportDefaultSpecifier());
	                if (this.match(',')) {
	                    this.nextToken();
	                    if (this.match('*')) {
	                        // import foo, * as foo
	                        specifiers.push(this.parseImportNamespaceSpecifier());
	                    }
	                    else if (this.match('{')) {
	                        // import foo, {bar}
	                        specifiers = specifiers.concat(this.parseNamedImports());
	                    }
	                    else {
	                        this.throwUnexpectedToken(this.lookahead);
	                    }
	                }
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	            if (!this.matchContextualKeyword('from')) {
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            this.nextToken();
	            src = this.parseModuleSpecifier();
	        }
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ImportDeclaration(specifiers, src));
	    };
	    // https://tc39.github.io/ecma262/#sec-exports
	    Parser.prototype.parseExportSpecifier = function () {
	        var node = this.createNode();
	        var local = this.parseIdentifierName();
	        var exported = local;
	        if (this.matchContextualKeyword('as')) {
	            this.nextToken();
	            exported = this.parseIdentifierName();
	        }
	        return this.finalize(node, new Node.ExportSpecifier(local, exported));
	    };
	    Parser.prototype.parseExportDeclaration = function () {
	        if (this.context.inFunctionBody) {
	            this.throwError(messages_1.Messages.IllegalExportDeclaration);
	        }
	        var node = this.createNode();
	        this.expectKeyword('export');
	        var exportDeclaration;
	        if (this.matchKeyword('default')) {
	            // export default ...
	            this.nextToken();
	            if (this.matchKeyword('function')) {
	                // export default function foo () {}
	                // export default function () {}
	                var declaration = this.parseFunctionDeclaration(true);
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else if (this.matchKeyword('class')) {
	                // export default class foo {}
	                var declaration = this.parseClassDeclaration(true);
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else if (this.matchContextualKeyword('async')) {
	                // export default async function f () {}
	                // export default async function () {}
	                // export default async x => x
	                var declaration = this.matchAsyncFunction() ? this.parseFunctionDeclaration(true) : this.parseAssignmentExpression();
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else {
	                if (this.matchContextualKeyword('from')) {
	                    this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
	                }
	                // export default {};
	                // export default [];
	                // export default (1 + 2);
	                var declaration = this.match('{') ? this.parseObjectInitializer() :
	                    this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
	                this.consumeSemicolon();
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	        }
	        else if (this.match('*')) {
	            // export * from 'foo';
	            this.nextToken();
	            if (!this.matchContextualKeyword('from')) {
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            this.nextToken();
	            var src = this.parseModuleSpecifier();
	            this.consumeSemicolon();
	            exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
	        }
	        else if (this.lookahead.type === 4 /* Keyword */) {
	            // export var f = 1;
	            var declaration = void 0;
	            switch (this.lookahead.value) {
	                case 'let':
	                case 'const':
	                    declaration = this.parseLexicalDeclaration({ inFor: false });
	                    break;
	                case 'var':
	                case 'class':
	                case 'function':
	                    declaration = this.parseStatementListItem();
	                    break;
	                default:
	                    this.throwUnexpectedToken(this.lookahead);
	            }
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
	        }
	        else if (this.matchAsyncFunction()) {
	            var declaration = this.parseFunctionDeclaration();
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
	        }
	        else {
	            var specifiers = [];
	            var source = null;
	            var isExportFromIdentifier = false;
	            this.expect('{');
	            while (!this.match('}')) {
	                isExportFromIdentifier = isExportFromIdentifier || this.matchKeyword('default');
	                specifiers.push(this.parseExportSpecifier());
	                if (!this.match('}')) {
	                    this.expect(',');
	                }
	            }
	            this.expect('}');
	            if (this.matchContextualKeyword('from')) {
	                // export {default} from 'foo';
	                // export {foo} from 'foo';
	                this.nextToken();
	                source = this.parseModuleSpecifier();
	                this.consumeSemicolon();
	            }
	            else if (isExportFromIdentifier) {
	                // export {default}; // missing fromClause
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            else {
	                // export {foo};
	                this.consumeSemicolon();
	            }
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
	        }
	        return exportDeclaration;
	    };
	    return Parser;
	}());
	exports.Parser = Parser;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	// Ensure the condition is true, otherwise throw an error.
	// This is only to have a better contract semantic, i.e. another safety net
	// to catch a logic error. The condition shall be fulfilled in normal case.
	// Do NOT use this to enforce a certain condition on any user input.
	Object.defineProperty(exports, "__esModule", { value: true });
	function assert(condition, message) {
	    /* istanbul ignore if */
	    if (!condition) {
	        throw new Error('ASSERT: ' + message);
	    }
	}
	exports.assert = assert;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	/* tslint:disable:max-classes-per-file */
	Object.defineProperty(exports, "__esModule", { value: true });
	var ErrorHandler = (function () {
	    function ErrorHandler() {
	        this.errors = [];
	        this.tolerant = false;
	    }
	    ErrorHandler.prototype.recordError = function (error) {
	        this.errors.push(error);
	    };
	    ErrorHandler.prototype.tolerate = function (error) {
	        if (this.tolerant) {
	            this.recordError(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    ErrorHandler.prototype.constructError = function (msg, column) {
	        var error = new Error(msg);
	        try {
	            throw error;
	        }
	        catch (base) {
	            /* istanbul ignore else */
	            if (Object.create && Object.defineProperty) {
	                error = Object.create(base);
	                Object.defineProperty(error, 'column', { value: column });
	            }
	        }
	        /* istanbul ignore next */
	        return error;
	    };
	    ErrorHandler.prototype.createError = function (index, line, col, description) {
	        var msg = 'Line ' + line + ': ' + description;
	        var error = this.constructError(msg, col);
	        error.index = index;
	        error.lineNumber = line;
	        error.description = description;
	        return error;
	    };
	    ErrorHandler.prototype.throwError = function (index, line, col, description) {
	        throw this.createError(index, line, col, description);
	    };
	    ErrorHandler.prototype.tolerateError = function (index, line, col, description) {
	        var error = this.createError(index, line, col, description);
	        if (this.tolerant) {
	            this.recordError(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    return ErrorHandler;
	}());
	exports.ErrorHandler = ErrorHandler;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// Error messages should be identical to V8.
	exports.Messages = {
	    BadGetterArity: 'Getter must not have any formal parameters',
	    BadSetterArity: 'Setter must have exactly one formal parameter',
	    BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
	    ConstructorIsAsync: 'Class constructor may not be an async method',
	    ConstructorSpecialMethod: 'Class constructor may not be an accessor',
	    DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
	    DefaultRestParameter: 'Unexpected token =',
	    DuplicateBinding: 'Duplicate binding %0',
	    DuplicateConstructor: 'A class may only have one constructor',
	    DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
	    ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
	    GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
	    IllegalBreak: 'Illegal break statement',
	    IllegalContinue: 'Illegal continue statement',
	    IllegalExportDeclaration: 'Unexpected token',
	    IllegalImportDeclaration: 'Unexpected token',
	    IllegalLanguageModeDirective: 'Illegal \'use strict\' directive in function with non-simple parameter list',
	    IllegalReturn: 'Illegal return statement',
	    InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
	    InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
	    InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
	    InvalidLHSInForIn: 'Invalid left-hand side in for-in',
	    InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
	    InvalidModuleSpecifier: 'Unexpected token',
	    InvalidRegExp: 'Invalid regular expression',
	    LetInLexicalBinding: 'let is disallowed as a lexically bound name',
	    MissingFromClause: 'Unexpected token',
	    MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	    NewlineAfterThrow: 'Illegal newline after throw',
	    NoAsAfterImportNamespace: 'Unexpected token',
	    NoCatchOrFinally: 'Missing catch or finally after try',
	    ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
	    Redeclaration: '%0 \'%1\' has already been declared',
	    StaticPrototype: 'Classes may not have static property named prototype',
	    StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
	    StrictDelete: 'Delete of an unqualified identifier in strict mode.',
	    StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
	    StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
	    StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
	    StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	    StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	    StrictModeWith: 'Strict mode code may not include a with statement',
	    StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
	    StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	    StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
	    StrictReservedWord: 'Use of future reserved word in strict mode',
	    StrictVarName: 'Variable name may not be eval or arguments in strict mode',
	    TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
	    UnexpectedEOS: 'Unexpected end of input',
	    UnexpectedIdentifier: 'Unexpected identifier',
	    UnexpectedNumber: 'Unexpected number',
	    UnexpectedReserved: 'Unexpected reserved word',
	    UnexpectedString: 'Unexpected string',
	    UnexpectedTemplate: 'Unexpected quasi %0',
	    UnexpectedToken: 'Unexpected token %0',
	    UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
	    UnknownLabel: 'Undefined label \'%0\'',
	    UnterminatedRegExp: 'Invalid regular expression: missing /'
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var assert_1 = __webpack_require__(9);
	var character_1 = __webpack_require__(4);
	var messages_1 = __webpack_require__(11);
	function hexValue(ch) {
	    return '0123456789abcdef'.indexOf(ch.toLowerCase());
	}
	function octalValue(ch) {
	    return '01234567'.indexOf(ch);
	}
	var Scanner = (function () {
	    function Scanner(code, handler) {
	        this.source = code;
	        this.errorHandler = handler;
	        this.trackComment = false;
	        this.length = code.length;
	        this.index = 0;
	        this.lineNumber = (code.length > 0) ? 1 : 0;
	        this.lineStart = 0;
	        this.curlyStack = [];
	    }
	    Scanner.prototype.saveState = function () {
	        return {
	            index: this.index,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart
	        };
	    };
	    Scanner.prototype.restoreState = function (state) {
	        this.index = state.index;
	        this.lineNumber = state.lineNumber;
	        this.lineStart = state.lineStart;
	    };
	    Scanner.prototype.eof = function () {
	        return this.index >= this.length;
	    };
	    Scanner.prototype.throwUnexpectedToken = function (message) {
	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
	        return this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
	    };
	    Scanner.prototype.tolerateUnexpectedToken = function (message) {
	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
	        this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
	    };
	    // https://tc39.github.io/ecma262/#sec-comments
	    Scanner.prototype.skipSingleLineComment = function (offset) {
	        var comments = [];
	        var start, loc;
	        if (this.trackComment) {
	            comments = [];
	            start = this.index - offset;
	            loc = {
	                start: {
	                    line: this.lineNumber,
	                    column: this.index - this.lineStart - offset
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            ++this.index;
	            if (character_1.Character.isLineTerminator(ch)) {
	                if (this.trackComment) {
	                    loc.end = {
	                        line: this.lineNumber,
	                        column: this.index - this.lineStart - 1
	                    };
	                    var entry = {
	                        multiLine: false,
	                        slice: [start + offset, this.index - 1],
	                        range: [start, this.index - 1],
	                        loc: loc
	                    };
	                    comments.push(entry);
	                }
	                if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                this.lineStart = this.index;
	                return comments;
	            }
	        }
	        if (this.trackComment) {
	            loc.end = {
	                line: this.lineNumber,
	                column: this.index - this.lineStart
	            };
	            var entry = {
	                multiLine: false,
	                slice: [start + offset, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        return comments;
	    };
	    Scanner.prototype.skipMultiLineComment = function () {
	        var comments = [];
	        var start, loc;
	        if (this.trackComment) {
	            comments = [];
	            start = this.index - 2;
	            loc = {
	                start: {
	                    line: this.lineNumber,
	                    column: this.index - this.lineStart - 2
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (character_1.Character.isLineTerminator(ch)) {
	                if (ch === 0x0D && this.source.charCodeAt(this.index + 1) === 0x0A) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                ++this.index;
	                this.lineStart = this.index;
	            }
	            else if (ch === 0x2A) {
	                // Block comment ends with '*/'.
	                if (this.source.charCodeAt(this.index + 1) === 0x2F) {
	                    this.index += 2;
	                    if (this.trackComment) {
	                        loc.end = {
	                            line: this.lineNumber,
	                            column: this.index - this.lineStart
	                        };
	                        var entry = {
	                            multiLine: true,
	                            slice: [start + 2, this.index - 2],
	                            range: [start, this.index],
	                            loc: loc
	                        };
	                        comments.push(entry);
	                    }
	                    return comments;
	                }
	                ++this.index;
	            }
	            else {
	                ++this.index;
	            }
	        }
	        // Ran off the end of the file - the whole thing is a comment
	        if (this.trackComment) {
	            loc.end = {
	                line: this.lineNumber,
	                column: this.index - this.lineStart
	            };
	            var entry = {
	                multiLine: true,
	                slice: [start + 2, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        this.tolerateUnexpectedToken();
	        return comments;
	    };
	    Scanner.prototype.scanComments = function () {
	        var comments;
	        if (this.trackComment) {
	            comments = [];
	        }
	        var start = (this.index === 0);
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (character_1.Character.isWhiteSpace(ch)) {
	                ++this.index;
	            }
	            else if (character_1.Character.isLineTerminator(ch)) {
	                ++this.index;
	                if (ch === 0x0D && this.source.charCodeAt(this.index) === 0x0A) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                this.lineStart = this.index;
	                start = true;
	            }
	            else if (ch === 0x2F) {
	                ch = this.source.charCodeAt(this.index + 1);
	                if (ch === 0x2F) {
	                    this.index += 2;
	                    var comment = this.skipSingleLineComment(2);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                    start = true;
	                }
	                else if (ch === 0x2A) {
	                    this.index += 2;
	                    var comment = this.skipMultiLineComment();
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (start && ch === 0x2D) {
	                // U+003E is '>'
	                if ((this.source.charCodeAt(this.index + 1) === 0x2D) && (this.source.charCodeAt(this.index + 2) === 0x3E)) {
	                    // '-->' is a single-line comment
	                    this.index += 3;
	                    var comment = this.skipSingleLineComment(3);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (ch === 0x3C) {
	                if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
	                    this.index += 4; // `<!--`
	                    var comment = this.skipSingleLineComment(4);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else {
	                break;
	            }
	        }
	        return comments;
	    };
	    // https://tc39.github.io/ecma262/#sec-future-reserved-words
	    Scanner.prototype.isFutureReservedWord = function (id) {
	        switch (id) {
	            case 'enum':
	            case 'export':
	            case 'import':
	            case 'super':
	                return true;
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.isStrictModeReservedWord = function (id) {
	        switch (id) {
	            case 'implements':
	            case 'interface':
	            case 'package':
	            case 'private':
	            case 'protected':
	            case 'public':
	            case 'static':
	            case 'yield':
	            case 'let':
	                return true;
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.isRestrictedWord = function (id) {
	        return id === 'eval' || id === 'arguments';
	    };
	    // https://tc39.github.io/ecma262/#sec-keywords
	    Scanner.prototype.isKeyword = function (id) {
	        switch (id.length) {
	            case 2:
	                return (id === 'if') || (id === 'in') || (id === 'do');
	            case 3:
	                return (id === 'var') || (id === 'for') || (id === 'new') ||
	                    (id === 'try') || (id === 'let');
	            case 4:
	                return (id === 'this') || (id === 'else') || (id === 'case') ||
	                    (id === 'void') || (id === 'with') || (id === 'enum');
	            case 5:
	                return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                    (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                    (id === 'class') || (id === 'super');
	            case 6:
	                return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                    (id === 'switch') || (id === 'export') || (id === 'import');
	            case 7:
	                return (id === 'default') || (id === 'finally') || (id === 'extends');
	            case 8:
	                return (id === 'function') || (id === 'continue') || (id === 'debugger');
	            case 10:
	                return (id === 'instanceof');
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.codePointAt = function (i) {
	        var cp = this.source.charCodeAt(i);
	        if (cp >= 0xD800 && cp <= 0xDBFF) {
	            var second = this.source.charCodeAt(i + 1);
	            if (second >= 0xDC00 && second <= 0xDFFF) {
	                var first = cp;
	                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
	            }
	        }
	        return cp;
	    };
	    Scanner.prototype.scanHexEscape = function (prefix) {
	        var len = (prefix === 'u') ? 4 : 2;
	        var code = 0;
	        for (var i = 0; i < len; ++i) {
	            if (!this.eof() && character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
	                code = code * 16 + hexValue(this.source[this.index++]);
	            }
	            else {
	                return null;
	            }
	        }
	        return String.fromCharCode(code);
	    };
	    Scanner.prototype.scanUnicodeCodePointEscape = function () {
	        var ch = this.source[this.index];
	        var code = 0;
	        // At least, one hex digit is required.
	        if (ch === '}') {
	            this.throwUnexpectedToken();
	        }
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            if (!character_1.Character.isHexDigit(ch.charCodeAt(0))) {
	                break;
	            }
	            code = code * 16 + hexValue(ch);
	        }
	        if (code > 0x10FFFF || ch !== '}') {
	            this.throwUnexpectedToken();
	        }
	        return character_1.Character.fromCodePoint(code);
	    };
	    Scanner.prototype.getIdentifier = function () {
	        var start = this.index++;
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (ch === 0x5C) {
	                // Blackslash (U+005C) marks Unicode escape sequence.
	                this.index = start;
	                return this.getComplexIdentifier();
	            }
	            else if (ch >= 0xD800 && ch < 0xDFFF) {
	                // Need to handle surrogate pairs.
	                this.index = start;
	                return this.getComplexIdentifier();
	            }
	            if (character_1.Character.isIdentifierPart(ch)) {
	                ++this.index;
	            }
	            else {
	                break;
	            }
	        }
	        return this.source.slice(start, this.index);
	    };
	    Scanner.prototype.getComplexIdentifier = function () {
	        var cp = this.codePointAt(this.index);
	        var id = character_1.Character.fromCodePoint(cp);
	        this.index += id.length;
	        // '\u' (U+005C, U+0075) denotes an escaped character.
	        var ch;
	        if (cp === 0x5C) {
	            if (this.source.charCodeAt(this.index) !== 0x75) {
	                this.throwUnexpectedToken();
	            }
	            ++this.index;
	            if (this.source[this.index] === '{') {
	                ++this.index;
	                ch = this.scanUnicodeCodePointEscape();
	            }
	            else {
	                ch = this.scanHexEscape('u');
	                if (ch === null || ch === '\\' || !character_1.Character.isIdentifierStart(ch.charCodeAt(0))) {
	                    this.throwUnexpectedToken();
	                }
	            }
	            id = ch;
	        }
	        while (!this.eof()) {
	            cp = this.codePointAt(this.index);
	            if (!character_1.Character.isIdentifierPart(cp)) {
	                break;
	            }
	            ch = character_1.Character.fromCodePoint(cp);
	            id += ch;
	            this.index += ch.length;
	            // '\u' (U+005C, U+0075) denotes an escaped character.
	            if (cp === 0x5C) {
	                id = id.substr(0, id.length - 1);
	                if (this.source.charCodeAt(this.index) !== 0x75) {
	                    this.throwUnexpectedToken();
	                }
	                ++this.index;
	                if (this.source[this.index] === '{') {
	                    ++this.index;
	                    ch = this.scanUnicodeCodePointEscape();
	                }
	                else {
	                    ch = this.scanHexEscape('u');
	                    if (ch === null || ch === '\\' || !character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
	                        this.throwUnexpectedToken();
	                    }
	                }
	                id += ch;
	            }
	        }
	        return id;
	    };
	    Scanner.prototype.octalToDecimal = function (ch) {
	        // \0 is not octal escape sequence
	        var octal = (ch !== '0');
	        var code = octalValue(ch);
	        if (!this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	            octal = true;
	            code = code * 8 + octalValue(this.source[this.index++]);
	            // 3 digits are only allowed when string starts
	            // with 0, 1, 2, 3
	            if ('0123'.indexOf(ch) >= 0 && !this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	                code = code * 8 + octalValue(this.source[this.index++]);
	            }
	        }
	        return {
	            code: code,
	            octal: octal
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    Scanner.prototype.scanIdentifier = function () {
	        var type;
	        var start = this.index;
	        // Backslash (U+005C) starts an escaped character.
	        var id = (this.source.charCodeAt(start) === 0x5C) ? this.getComplexIdentifier() : this.getIdentifier();
	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = 3 /* Identifier */;
	        }
	        else if (this.isKeyword(id)) {
	            type = 4 /* Keyword */;
	        }
	        else if (id === 'null') {
	            type = 5 /* NullLiteral */;
	        }
	        else if (id === 'true' || id === 'false') {
	            type = 1 /* BooleanLiteral */;
	        }
	        else {
	            type = 3 /* Identifier */;
	        }
	        if (type !== 3 /* Identifier */ && (start + id.length !== this.index)) {
	            var restore = this.index;
	            this.index = start;
	            this.tolerateUnexpectedToken(messages_1.Messages.InvalidEscapedReservedWord);
	            this.index = restore;
	        }
	        return {
	            type: type,
	            value: id,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-punctuators
	    Scanner.prototype.scanPunctuator = function () {
	        var start = this.index;
	        // Check for most common single-character punctuators.
	        var str = this.source[this.index];
	        switch (str) {
	            case '(':
	            case '{':
	                if (str === '{') {
	                    this.curlyStack.push('{');
	                }
	                ++this.index;
	                break;
	            case '.':
	                ++this.index;
	                if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
	                    // Spread operator: ...
	                    this.index += 2;
	                    str = '...';
	                }
	                break;
	            case '}':
	                ++this.index;
	                this.curlyStack.pop();
	                break;
	            case ')':
	            case ';':
	            case ',':
	            case '[':
	            case ']':
	            case ':':
	            case '?':
	            case '~':
	                ++this.index;
	                break;
	            default:
	                // 4-character punctuator.
	                str = this.source.substr(this.index, 4);
	                if (str === '>>>=') {
	                    this.index += 4;
	                }
	                else {
	                    // 3-character punctuators.
	                    str = str.substr(0, 3);
	                    if (str === '===' || str === '!==' || str === '>>>' ||
	                        str === '<<=' || str === '>>=' || str === '**=') {
	                        this.index += 3;
	                    }
	                    else {
	                        // 2-character punctuators.
	                        str = str.substr(0, 2);
	                        if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
	                            str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
	                            str === '++' || str === '--' || str === '<<' || str === '>>' ||
	                            str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
	                            str === '<=' || str === '>=' || str === '=>' || str === '**') {
	                            this.index += 2;
	                        }
	                        else {
	                            // 1-character punctuators.
	                            str = this.source[this.index];
	                            if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
	                                ++this.index;
	                            }
	                        }
	                    }
	                }
	        }
	        if (this.index === start) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 7 /* Punctuator */,
	            value: str,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    Scanner.prototype.scanHexLiteral = function (start) {
	        var num = '';
	        while (!this.eof()) {
	            if (!character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            this.throwUnexpectedToken();
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt('0x' + num, 16),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.scanBinaryLiteral = function (start) {
	        var num = '';
	        var ch;
	        while (!this.eof()) {
	            ch = this.source[this.index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            // only 0b or 0B
	            this.throwUnexpectedToken();
	        }
	        if (!this.eof()) {
	            ch = this.source.charCodeAt(this.index);
	            /* istanbul ignore else */
	            if (character_1.Character.isIdentifierStart(ch) || character_1.Character.isDecimalDigit(ch)) {
	                this.throwUnexpectedToken();
	            }
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt(num, 2),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.scanOctalLiteral = function (prefix, start) {
	        var num = '';
	        var octal = false;
	        if (character_1.Character.isOctalDigit(prefix.charCodeAt(0))) {
	            octal = true;
	            num = '0' + this.source[this.index++];
	        }
	        else {
	            ++this.index;
	        }
	        while (!this.eof()) {
	            if (!character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (!octal && num.length === 0) {
	            // only 0o or 0O
	            this.throwUnexpectedToken();
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index)) || character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt(num, 8),
	            octal: octal,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.isImplicitOctalLiteral = function () {
	        // Implicit octal, unless there is a non-octal digit.
	        // (Annex B.1.1 on Numeric Literals)
	        for (var i = this.index + 1; i < this.length; ++i) {
	            var ch = this.source[i];
	            if (ch === '8' || ch === '9') {
	                return false;
	            }
	            if (!character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                return true;
	            }
	        }
	        return true;
	    };
	    Scanner.prototype.scanNumericLiteral = function () {
	        var start = this.index;
	        var ch = this.source[start];
	        assert_1.assert(character_1.Character.isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'), 'Numeric literal must start with a decimal digit or a decimal point');
	        var num = '';
	        if (ch !== '.') {
	            num = this.source[this.index++];
	            ch = this.source[this.index];
	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (num === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++this.index;
	                    return this.scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++this.index;
	                    return this.scanBinaryLiteral(start);
	                }
	                if (ch === 'o' || ch === 'O') {
	                    return this.scanOctalLiteral(ch, start);
	                }
	                if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                    if (this.isImplicitOctalLiteral()) {
	                        return this.scanOctalLiteral(ch, start);
	                    }
	                }
	            }
	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === '.') {
	            num += this.source[this.index++];
	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === 'e' || ch === 'E') {
	            num += this.source[this.index++];
	            ch = this.source[this.index];
	            if (ch === '+' || ch === '-') {
	                num += this.source[this.index++];
	            }
	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                    num += this.source[this.index++];
	                }
	            }
	            else {
	                this.throwUnexpectedToken();
	            }
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseFloat(num),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-string-literals
	    Scanner.prototype.scanStringLiteral = function () {
	        var start = this.index;
	        var quote = this.source[start];
	        assert_1.assert((quote === '\'' || quote === '"'), 'String literal must starts with a quote');
	        ++this.index;
	        var octal = false;
	        var str = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === quote) {
	                quote = '';
	                break;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!ch || !character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                str += this.scanUnicodeCodePointEscape();
	                            }
	                            else {
	                                var unescaped_1 = this.scanHexEscape(ch);
	                                if (unescaped_1 === null) {
	                                    this.throwUnexpectedToken();
	                                }
	                                str += unescaped_1;
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanHexEscape(ch);
	                            if (unescaped === null) {
	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
	                            }
	                            str += unescaped;
	                            break;
	                        case 'n':
	                            str += '\n';
	                            break;
	                        case 'r':
	                            str += '\r';
	                            break;
	                        case 't':
	                            str += '\t';
	                            break;
	                        case 'b':
	                            str += '\b';
	                            break;
	                        case 'f':
	                            str += '\f';
	                            break;
	                        case 'v':
	                            str += '\x0B';
	                            break;
	                        case '8':
	                        case '9':
	                            str += ch;
	                            this.tolerateUnexpectedToken();
	                            break;
	                        default:
	                            if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                                var octToDec = this.octalToDecimal(ch);
	                                octal = octToDec.octal || octal;
	                                str += String.fromCharCode(octToDec.code);
	                            }
	                            else {
	                                str += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.lineNumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.lineStart = this.index;
	                }
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            }
	            else {
	                str += ch;
	            }
	        }
	        if (quote !== '') {
	            this.index = start;
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 8 /* StringLiteral */,
	            value: str,
	            octal: octal,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literal-lexical-components
	    Scanner.prototype.scanTemplate = function () {
	        var cooked = '';
	        var terminated = false;
	        var start = this.index;
	        var head = (this.source[start] === '`');
	        var tail = false;
	        var rawOffset = 2;
	        ++this.index;
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === '`') {
	                rawOffset = 1;
	                tail = true;
	                terminated = true;
	                break;
	            }
	            else if (ch === '$') {
	                if (this.source[this.index] === '{') {
	                    this.curlyStack.push('${');
	                    ++this.index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'n':
	                            cooked += '\n';
	                            break;
	                        case 'r':
	                            cooked += '\r';
	                            break;
	                        case 't':
	                            cooked += '\t';
	                            break;
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                cooked += this.scanUnicodeCodePointEscape();
	                            }
	                            else {
	                                var restore = this.index;
	                                var unescaped_2 = this.scanHexEscape(ch);
	                                if (unescaped_2 !== null) {
	                                    cooked += unescaped_2;
	                                }
	                                else {
	                                    this.index = restore;
	                                    cooked += ch;
	                                }
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanHexEscape(ch);
	                            if (unescaped === null) {
	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
	                            }
	                            cooked += unescaped;
	                            break;
	                        case 'b':
	                            cooked += '\b';
	                            break;
	                        case 'f':
	                            cooked += '\f';
	                            break;
	                        case 'v':
	                            cooked += '\v';
	                            break;
	                        default:
	                            if (ch === '0') {
	                                if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                                    // Illegal: \01 \02 and so on
	                                    this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
	                                }
	                                cooked += '\0';
	                            }
	                            else if (character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                                // Illegal: \1 \2
	                                this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
	                            }
	                            else {
	                                cooked += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.lineNumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.lineStart = this.index;
	                }
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                ++this.lineNumber;
	                if (ch === '\r' && this.source[this.index] === '\n') {
	                    ++this.index;
	                }
	                this.lineStart = this.index;
	                cooked += '\n';
	            }
	            else {
	                cooked += ch;
	            }
	        }
	        if (!terminated) {
	            this.throwUnexpectedToken();
	        }
	        if (!head) {
	            this.curlyStack.pop();
	        }
	        return {
	            type: 10 /* Template */,
	            value: this.source.slice(start + 1, this.index - rawOffset),
	            cooked: cooked,
	            head: head,
	            tail: tail,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	    Scanner.prototype.testRegExp = function (pattern, flags) {
	        // The BMP character to use as a replacement for astral symbols when
	        // translating an ES6 "u"-flagged pattern to an ES5-compatible
	        // approximation.
	        // Note: replacing with '\uFFFF' enables false positives in unlikely
	        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
	        // pattern that would not be detected by this substitution.
	        var astralSubstitute = '\uFFFF';
	        var tmp = pattern;
	        var self = this;
	        if (flags.indexOf('u') >= 0) {
	            tmp = tmp
	                .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
	                var codePoint = parseInt($1 || $2, 16);
	                if (codePoint > 0x10FFFF) {
	                    self.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
	                }
	                if (codePoint <= 0xFFFF) {
	                    return String.fromCharCode(codePoint);
	                }
	                return astralSubstitute;
	            })
	                .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
	        }
	        // First, detect invalid regular expressions.
	        try {
	            RegExp(tmp);
	        }
	        catch (e) {
	            this.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
	        }
	        // Return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new RegExp(pattern, flags);
	        }
	        catch (exception) {
	            /* istanbul ignore next */
	            return null;
	        }
	    };
	    Scanner.prototype.scanRegExpBody = function () {
	        var ch = this.source[this.index];
	        assert_1.assert(ch === '/', 'Regular expression literal must start with a slash');
	        var str = this.source[this.index++];
	        var classMarker = false;
	        var terminated = false;
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = this.source[this.index++];
	                // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	                if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	            }
	            else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            }
	            else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                }
	                else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }
	        if (!terminated) {
	            this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	        }
	        // Exclude leading and trailing slash.
	        return str.substr(1, str.length - 2);
	    };
	    Scanner.prototype.scanRegExpFlags = function () {
	        var str = '';
	        var flags = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index];
	            if (!character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }
	            ++this.index;
	            if (ch === '\\' && !this.eof()) {
	                ch = this.source[this.index];
	                if (ch === 'u') {
	                    ++this.index;
	                    var restore = this.index;
	                    var char = this.scanHexEscape('u');
	                    if (char !== null) {
	                        flags += char;
	                        for (str += '\\u'; restore < this.index; ++restore) {
	                            str += this.source[restore];
	                        }
	                    }
	                    else {
	                        this.index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    this.tolerateUnexpectedToken();
	                }
	                else {
	                    str += '\\';
	                    this.tolerateUnexpectedToken();
	                }
	            }
	            else {
	                flags += ch;
	                str += ch;
	            }
	        }
	        return flags;
	    };
	    Scanner.prototype.scanRegExp = function () {
	        var start = this.index;
	        var pattern = this.scanRegExpBody();
	        var flags = this.scanRegExpFlags();
	        var value = this.testRegExp(pattern, flags);
	        return {
	            type: 9 /* RegularExpression */,
	            value: '',
	            pattern: pattern,
	            flags: flags,
	            regex: value,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.lex = function () {
	        if (this.eof()) {
	            return {
	                type: 2 /* EOF */,
	                value: '',
	                lineNumber: this.lineNumber,
	                lineStart: this.lineStart,
	                start: this.index,
	                end: this.index
	            };
	        }
	        var cp = this.source.charCodeAt(this.index);
	        if (character_1.Character.isIdentifierStart(cp)) {
	            return this.scanIdentifier();
	        }
	        // Very common: ( and ) and ;
	        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
	            return this.scanPunctuator();
	        }
	        // String literal starts with single quote (U+0027) or double quote (U+0022).
	        if (cp === 0x27 || cp === 0x22) {
	            return this.scanStringLiteral();
	        }
	        // Dot (.) U+002E can also start a floating-point number, hence the need
	        // to check the next character.
	        if (cp === 0x2E) {
	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
	                return this.scanNumericLiteral();
	            }
	            return this.scanPunctuator();
	        }
	        if (character_1.Character.isDecimalDigit(cp)) {
	            return this.scanNumericLiteral();
	        }
	        // Template literals start with ` (U+0060) for template head
	        // or } (U+007D) for template middle or template tail.
	        if (cp === 0x60 || (cp === 0x7D && this.curlyStack[this.curlyStack.length - 1] === '${')) {
	            return this.scanTemplate();
	        }
	        // Possible identifier start in a surrogate pair.
	        if (cp >= 0xD800 && cp < 0xDFFF) {
	            if (character_1.Character.isIdentifierStart(this.codePointAt(this.index))) {
	                return this.scanIdentifier();
	            }
	        }
	        return this.scanPunctuator();
	    };
	    return Scanner;
	}());
	exports.Scanner = Scanner;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TokenName = {};
	exports.TokenName[1 /* BooleanLiteral */] = 'Boolean';
	exports.TokenName[2 /* EOF */] = '<end>';
	exports.TokenName[3 /* Identifier */] = 'Identifier';
	exports.TokenName[4 /* Keyword */] = 'Keyword';
	exports.TokenName[5 /* NullLiteral */] = 'Null';
	exports.TokenName[6 /* NumericLiteral */] = 'Numeric';
	exports.TokenName[7 /* Punctuator */] = 'Punctuator';
	exports.TokenName[8 /* StringLiteral */] = 'String';
	exports.TokenName[9 /* RegularExpression */] = 'RegularExpression';
	exports.TokenName[10 /* Template */] = 'Template';


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	// Generated by generate-xhtml-entities.js. DO NOT MODIFY!
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.XHTMLEntities = {
	    quot: '\u0022',
	    amp: '\u0026',
	    apos: '\u0027',
	    gt: '\u003E',
	    nbsp: '\u00A0',
	    iexcl: '\u00A1',
	    cent: '\u00A2',
	    pound: '\u00A3',
	    curren: '\u00A4',
	    yen: '\u00A5',
	    brvbar: '\u00A6',
	    sect: '\u00A7',
	    uml: '\u00A8',
	    copy: '\u00A9',
	    ordf: '\u00AA',
	    laquo: '\u00AB',
	    not: '\u00AC',
	    shy: '\u00AD',
	    reg: '\u00AE',
	    macr: '\u00AF',
	    deg: '\u00B0',
	    plusmn: '\u00B1',
	    sup2: '\u00B2',
	    sup3: '\u00B3',
	    acute: '\u00B4',
	    micro: '\u00B5',
	    para: '\u00B6',
	    middot: '\u00B7',
	    cedil: '\u00B8',
	    sup1: '\u00B9',
	    ordm: '\u00BA',
	    raquo: '\u00BB',
	    frac14: '\u00BC',
	    frac12: '\u00BD',
	    frac34: '\u00BE',
	    iquest: '\u00BF',
	    Agrave: '\u00C0',
	    Aacute: '\u00C1',
	    Acirc: '\u00C2',
	    Atilde: '\u00C3',
	    Auml: '\u00C4',
	    Aring: '\u00C5',
	    AElig: '\u00C6',
	    Ccedil: '\u00C7',
	    Egrave: '\u00C8',
	    Eacute: '\u00C9',
	    Ecirc: '\u00CA',
	    Euml: '\u00CB',
	    Igrave: '\u00CC',
	    Iacute: '\u00CD',
	    Icirc: '\u00CE',
	    Iuml: '\u00CF',
	    ETH: '\u00D0',
	    Ntilde: '\u00D1',
	    Ograve: '\u00D2',
	    Oacute: '\u00D3',
	    Ocirc: '\u00D4',
	    Otilde: '\u00D5',
	    Ouml: '\u00D6',
	    times: '\u00D7',
	    Oslash: '\u00D8',
	    Ugrave: '\u00D9',
	    Uacute: '\u00DA',
	    Ucirc: '\u00DB',
	    Uuml: '\u00DC',
	    Yacute: '\u00DD',
	    THORN: '\u00DE',
	    szlig: '\u00DF',
	    agrave: '\u00E0',
	    aacute: '\u00E1',
	    acirc: '\u00E2',
	    atilde: '\u00E3',
	    auml: '\u00E4',
	    aring: '\u00E5',
	    aelig: '\u00E6',
	    ccedil: '\u00E7',
	    egrave: '\u00E8',
	    eacute: '\u00E9',
	    ecirc: '\u00EA',
	    euml: '\u00EB',
	    igrave: '\u00EC',
	    iacute: '\u00ED',
	    icirc: '\u00EE',
	    iuml: '\u00EF',
	    eth: '\u00F0',
	    ntilde: '\u00F1',
	    ograve: '\u00F2',
	    oacute: '\u00F3',
	    ocirc: '\u00F4',
	    otilde: '\u00F5',
	    ouml: '\u00F6',
	    divide: '\u00F7',
	    oslash: '\u00F8',
	    ugrave: '\u00F9',
	    uacute: '\u00FA',
	    ucirc: '\u00FB',
	    uuml: '\u00FC',
	    yacute: '\u00FD',
	    thorn: '\u00FE',
	    yuml: '\u00FF',
	    OElig: '\u0152',
	    oelig: '\u0153',
	    Scaron: '\u0160',
	    scaron: '\u0161',
	    Yuml: '\u0178',
	    fnof: '\u0192',
	    circ: '\u02C6',
	    tilde: '\u02DC',
	    Alpha: '\u0391',
	    Beta: '\u0392',
	    Gamma: '\u0393',
	    Delta: '\u0394',
	    Epsilon: '\u0395',
	    Zeta: '\u0396',
	    Eta: '\u0397',
	    Theta: '\u0398',
	    Iota: '\u0399',
	    Kappa: '\u039A',
	    Lambda: '\u039B',
	    Mu: '\u039C',
	    Nu: '\u039D',
	    Xi: '\u039E',
	    Omicron: '\u039F',
	    Pi: '\u03A0',
	    Rho: '\u03A1',
	    Sigma: '\u03A3',
	    Tau: '\u03A4',
	    Upsilon: '\u03A5',
	    Phi: '\u03A6',
	    Chi: '\u03A7',
	    Psi: '\u03A8',
	    Omega: '\u03A9',
	    alpha: '\u03B1',
	    beta: '\u03B2',
	    gamma: '\u03B3',
	    delta: '\u03B4',
	    epsilon: '\u03B5',
	    zeta: '\u03B6',
	    eta: '\u03B7',
	    theta: '\u03B8',
	    iota: '\u03B9',
	    kappa: '\u03BA',
	    lambda: '\u03BB',
	    mu: '\u03BC',
	    nu: '\u03BD',
	    xi: '\u03BE',
	    omicron: '\u03BF',
	    pi: '\u03C0',
	    rho: '\u03C1',
	    sigmaf: '\u03C2',
	    sigma: '\u03C3',
	    tau: '\u03C4',
	    upsilon: '\u03C5',
	    phi: '\u03C6',
	    chi: '\u03C7',
	    psi: '\u03C8',
	    omega: '\u03C9',
	    thetasym: '\u03D1',
	    upsih: '\u03D2',
	    piv: '\u03D6',
	    ensp: '\u2002',
	    emsp: '\u2003',
	    thinsp: '\u2009',
	    zwnj: '\u200C',
	    zwj: '\u200D',
	    lrm: '\u200E',
	    rlm: '\u200F',
	    ndash: '\u2013',
	    mdash: '\u2014',
	    lsquo: '\u2018',
	    rsquo: '\u2019',
	    sbquo: '\u201A',
	    ldquo: '\u201C',
	    rdquo: '\u201D',
	    bdquo: '\u201E',
	    dagger: '\u2020',
	    Dagger: '\u2021',
	    bull: '\u2022',
	    hellip: '\u2026',
	    permil: '\u2030',
	    prime: '\u2032',
	    Prime: '\u2033',
	    lsaquo: '\u2039',
	    rsaquo: '\u203A',
	    oline: '\u203E',
	    frasl: '\u2044',
	    euro: '\u20AC',
	    image: '\u2111',
	    weierp: '\u2118',
	    real: '\u211C',
	    trade: '\u2122',
	    alefsym: '\u2135',
	    larr: '\u2190',
	    uarr: '\u2191',
	    rarr: '\u2192',
	    darr: '\u2193',
	    harr: '\u2194',
	    crarr: '\u21B5',
	    lArr: '\u21D0',
	    uArr: '\u21D1',
	    rArr: '\u21D2',
	    dArr: '\u21D3',
	    hArr: '\u21D4',
	    forall: '\u2200',
	    part: '\u2202',
	    exist: '\u2203',
	    empty: '\u2205',
	    nabla: '\u2207',
	    isin: '\u2208',
	    notin: '\u2209',
	    ni: '\u220B',
	    prod: '\u220F',
	    sum: '\u2211',
	    minus: '\u2212',
	    lowast: '\u2217',
	    radic: '\u221A',
	    prop: '\u221D',
	    infin: '\u221E',
	    ang: '\u2220',
	    and: '\u2227',
	    or: '\u2228',
	    cap: '\u2229',
	    cup: '\u222A',
	    int: '\u222B',
	    there4: '\u2234',
	    sim: '\u223C',
	    cong: '\u2245',
	    asymp: '\u2248',
	    ne: '\u2260',
	    equiv: '\u2261',
	    le: '\u2264',
	    ge: '\u2265',
	    sub: '\u2282',
	    sup: '\u2283',
	    nsub: '\u2284',
	    sube: '\u2286',
	    supe: '\u2287',
	    oplus: '\u2295',
	    otimes: '\u2297',
	    perp: '\u22A5',
	    sdot: '\u22C5',
	    lceil: '\u2308',
	    rceil: '\u2309',
	    lfloor: '\u230A',
	    rfloor: '\u230B',
	    loz: '\u25CA',
	    spades: '\u2660',
	    clubs: '\u2663',
	    hearts: '\u2665',
	    diams: '\u2666',
	    lang: '\u27E8',
	    rang: '\u27E9'
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var error_handler_1 = __webpack_require__(10);
	var scanner_1 = __webpack_require__(12);
	var token_1 = __webpack_require__(13);
	var Reader = (function () {
	    function Reader() {
	        this.values = [];
	        this.curly = this.paren = -1;
	    }
	    // A function following one of those tokens is an expression.
	    Reader.prototype.beforeFunctionExpression = function (t) {
	        return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	            'return', 'case', 'delete', 'throw', 'void',
	            // assignment operators
	            '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=',
	            '&=', '|=', '^=', ',',
	            // binary/unary operators
	            '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	            '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	            '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
	    };
	    // Determine if forward slash (/) is an operator or part of a regular expression
	    // https://github.com/mozilla/sweet.js/wiki/design
	    Reader.prototype.isRegexStart = function () {
	        var previous = this.values[this.values.length - 1];
	        var regex = (previous !== null);
	        switch (previous) {
	            case 'this':
	            case ']':
	                regex = false;
	                break;
	            case ')':
	                var keyword = this.values[this.paren - 1];
	                regex = (keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with');
	                break;
	            case '}':
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                regex = false;
	                if (this.values[this.curly - 3] === 'function') {
	                    // Anonymous function, e.g. function(){} /42
	                    var check = this.values[this.curly - 4];
	                    regex = check ? !this.beforeFunctionExpression(check) : false;
	                }
	                else if (this.values[this.curly - 4] === 'function') {
	                    // Named function, e.g. function f(){} /42/
	                    var check = this.values[this.curly - 5];
	                    regex = check ? !this.beforeFunctionExpression(check) : true;
	                }
	                break;
	            default:
	                break;
	        }
	        return regex;
	    };
	    Reader.prototype.push = function (token) {
	        if (token.type === 7 /* Punctuator */ || token.type === 4 /* Keyword */) {
	            if (token.value === '{') {
	                this.curly = this.values.length;
	            }
	            else if (token.value === '(') {
	                this.paren = this.values.length;
	            }
	            this.values.push(token.value);
	        }
	        else {
	            this.values.push(null);
	        }
	    };
	    return Reader;
	}());
	var Tokenizer = (function () {
	    function Tokenizer(code, config) {
	        this.errorHandler = new error_handler_1.ErrorHandler();
	        this.errorHandler.tolerant = config ? (typeof config.tolerant === 'boolean' && config.tolerant) : false;
	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
	        this.scanner.trackComment = config ? (typeof config.comment === 'boolean' && config.comment) : false;
	        this.trackRange = config ? (typeof config.range === 'boolean' && config.range) : false;
	        this.trackLoc = config ? (typeof config.loc === 'boolean' && config.loc) : false;
	        this.buffer = [];
	        this.reader = new Reader();
	    }
	    Tokenizer.prototype.errors = function () {
	        return this.errorHandler.errors;
	    };
	    Tokenizer.prototype.getNextToken = function () {
	        if (this.buffer.length === 0) {
	            var comments = this.scanner.scanComments();
	            if (this.scanner.trackComment) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
	                    var comment = {
	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
	                        value: value
	                    };
	                    if (this.trackRange) {
	                        comment.range = e.range;
	                    }
	                    if (this.trackLoc) {
	                        comment.loc = e.loc;
	                    }
	                    this.buffer.push(comment);
	                }
	            }
	            if (!this.scanner.eof()) {
	                var loc = void 0;
	                if (this.trackLoc) {
	                    loc = {
	                        start: {
	                            line: this.scanner.lineNumber,
	                            column: this.scanner.index - this.scanner.lineStart
	                        },
	                        end: {}
	                    };
	                }
	                var startRegex = (this.scanner.source[this.scanner.index] === '/') && this.reader.isRegexStart();
	                var token = startRegex ? this.scanner.scanRegExp() : this.scanner.lex();
	                this.reader.push(token);
	                var entry = {
	                    type: token_1.TokenName[token.type],
	                    value: this.scanner.source.slice(token.start, token.end)
	                };
	                if (this.trackRange) {
	                    entry.range = [token.start, token.end];
	                }
	                if (this.trackLoc) {
	                    loc.end = {
	                        line: this.scanner.lineNumber,
	                        column: this.scanner.index - this.scanner.lineStart
	                    };
	                    entry.loc = loc;
	                }
	                if (token.type === 9 /* RegularExpression */) {
	                    var pattern = token.pattern;
	                    var flags = token.flags;
	                    entry.regex = { pattern: pattern, flags: flags };
	                }
	                this.buffer.push(entry);
	            }
	        }
	        return this.buffer.shift();
	    };
	    return Tokenizer;
	}());
	exports.Tokenizer = Tokenizer;


/***/ }
/******/ ])
});
;
},{}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* eslint-disable no-console */

exports.default = shaven;

var _parseSugarString = require('./parseSugarString');

var _parseSugarString2 = _interopRequireDefault(_parseSugarString);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _namespaceToURL = require('./namespaceToURL');

var _namespaceToURL2 = _interopRequireDefault(_namespaceToURL);

var _mapAttributeValue = require('./mapAttributeValue');

var _mapAttributeValue2 = _interopRequireDefault(_mapAttributeValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function shaven(arrayOrObject) {

  if (!arrayOrObject || (typeof arrayOrObject === 'undefined' ? 'undefined' : _typeof(arrayOrObject)) !== 'object') {
    throw new Error('Argument must be either an array or an object ' + 'and not ' + arrayOrObject);
  }

  var config = {};
  var elementArray = void 0;

  if (Array.isArray(arrayOrObject)) {
    elementArray = arrayOrObject;
  } else {
    elementArray = arrayOrObject.elementArray;
    delete arrayOrObject.elementArray;
    Object.assign(config, arrayOrObject);
  }

  config = Object.assign({}, _defaults2.default, config, {
    returnObject: { // Shaven object to return at last
      ids: {},
      references: {}
    }
  });

  config.nsStack = [config.namespace]; // Stack with current namespaces

  function createElement(sugarString) {
    var properties = (0, _parseSugarString2.default)(sugarString);
    var currentNs = config.nsStack[config.nsStack.length - 1];

    if (properties.tag === 'svg') {
      config.nsStack.push('svg');
    } else if (properties.tag === 'math') {
      config.nsStack.push('mathml');
    } else if (properties.tag === 'html') {
      config.nsStack.push('xhtml');
    } else {
      // Keep current namespace
      config.nsStack.push(currentNs);
    }

    var namespace = config.nsStack[config.nsStack.length - 1];
    var element = document.createElementNS(_namespaceToURL2.default[namespace] ? _namespaceToURL2.default[namespace] : namespace, properties.tag);

    if (properties.id) {
      element.id = properties.id;
      console.assert(!config.returnObject.ids.hasOwnProperty(properties.id), 'Ids must be unique and "' + properties.id + '" is already assigned');
      config.returnObject.ids[properties.id] = element;
    }
    if (properties.class) {
      var _element$classList;

      (_element$classList = element.classList).add.apply(_element$classList, _toConsumableArray(properties.class.split(' ')));
    }
    if (properties.reference) {
      console.assert(!config.returnObject.ids.hasOwnProperty(properties.reference), 'References must be unique and "' + properties.id + '" is already assigned');
      config.returnObject.references[properties.reference] = element;
    }

    if (properties.escapeHTML != null) {
      config.escapeHTML = properties.escapeHTML;
    }

    return element;
  }

  function buildDom(array) {

    var index = 1;
    var createdCallback = void 0;

    if (typeof array[0] === 'string') {
      array[0] = createElement(array[0]);
    } else if (Array.isArray(array[0])) {
      index = 0;
    } else if (!(array[0] instanceof Element)) {
      throw new Error('First element of array must be either a string, ' + 'an array or a DOM element and not ' + JSON.stringify(array[0]));
    }

    // For each in the element array (except the first)
    for (; index < array.length; index++) {

      // Don't render element if value is false or null
      if (array[index] === false || array[index] === null) {
        array[0] = false;
        break;
      }

      // Continue with next array value if current is undefined or true
      else if (array[index] === undefined || array[index] === true) {
          continue;
        }

        // If is string has to be content so set it
        else if (typeof array[index] === 'string' || typeof array[index] === 'number') {
            if (config.escapeHTML) {
              array[0].appendChild(document.createTextNode(array[index]));
            } else {
              array[0].innerHTML = array[index];
            }
          }

          // If is array has to be child element
          else if (Array.isArray(array[index])) {
              // If is actually a sub-array, flatten it
              if (Array.isArray(array[index][0])) {
                array[index].reverse().forEach(function (subArray) {
                  // eslint-disable-line no-loop-func
                  array.splice(index + 1, 0, subArray);
                });

                if (index !== 0) continue;
                index++;
              }

              // Build dom recursively for all child elements
              buildDom(array[index]);

              // Append the element to its parent element
              if (array[index][0]) {
                array[0].appendChild(array[index][0]);
              }
            } else if (typeof array[index] === 'function') {
              createdCallback = array[index];
            }

            // If it is an element append it
            else if (array[index] instanceof Element) {
                array[0].appendChild(array[index]);
              }

              // Else must be an object with attributes
              else if (_typeof(array[index]) === 'object') {
                  // For each attribute
                  for (var attributeKey in array[index]) {
                    if (!array[index].hasOwnProperty(attributeKey)) continue;

                    var attributeValue = array[index][attributeKey];

                    if (array[index].hasOwnProperty(attributeKey) && attributeValue !== null && attributeValue !== false) {
                      array[0].setAttribute(attributeKey, (0, _mapAttributeValue2.default)(attributeKey, attributeValue, config));
                    }
                  }
                } else {
                  throw new TypeError('"' + array[index] + '" is not allowed as a value');
                }
    }

    config.nsStack.pop();

    // Return root element on index 0
    config.returnObject[0] = array[0];
    config.returnObject.rootElement = array[0];

    config.returnObject.toString = function () {
      return array[0].outerHTML;
    };

    if (createdCallback) createdCallback(array[0]);
  }

  buildDom(elementArray);

  return config.returnObject;
}

shaven.setDefaults = function (object) {
  Object.assign(_defaults2.default, object);
  return shaven;
};
},{"./defaults":6,"./mapAttributeValue":7,"./namespaceToURL":8,"./parseSugarString":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Create transform string from list transform objects

exports.default = function (transformObjects) {

  return transformObjects.map(function (transformation) {
    var values = [];

    if (transformation.type === 'rotate' && transformation.degrees) {
      values.push(transformation.degrees);
    }
    if (transformation.x) values.push(transformation.x);
    if (transformation.y) values.push(transformation.y);

    return transformation.type + '(' + values + ')';
  }).join(' ');
};
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  namespace: 'xhtml',
  autoNamespacing: true,
  escapeHTML: true,
  quotationMark: '"',
  quoteAttributes: true,
  convertTransformArray: true
};
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _buildTransformString = require('./buildTransformString');

var _buildTransformString2 = _interopRequireDefault(_buildTransformString);

var _stringifyStyleObject = require('./stringifyStyleObject');

var _stringifyStyleObject2 = _interopRequireDefault(_stringifyStyleObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (key, value) {
  if (value === undefined) {
    return '';
  }

  if (key === 'style' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return (0, _stringifyStyleObject2.default)(value);
  }

  if (key === 'transform' && Array.isArray(value)) {
    return (0, _buildTransformString2.default)(value);
  }

  return value;
};
},{"./buildTransformString":5,"./stringifyStyleObject":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  mathml: 'http://www.w3.org/1998/Math/MathML',
  svg: 'http://www.w3.org/2000/svg',
  xhtml: 'http://www.w3.org/1999/xhtml'
};
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sugarString) {
  var tags = sugarString.match(/^[\w-]+/);
  var properties = {
    tag: tags ? tags[0] : 'div'
  };
  var ids = sugarString.match(/#([\w-]+)/);
  var classes = sugarString.match(/\.[\w-]+/g);
  var references = sugarString.match(/\$([\w-]+)/);

  if (ids) properties.id = ids[1];

  if (classes) {
    properties.class = classes.join(' ').replace(/\./g, '');
  }

  if (references) properties.reference = references[1];

  if (sugarString.endsWith('&') || sugarString.endsWith('!')) {
    properties.escapeHTML = false;
  }

  return properties;
};
},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function sanitizeProperties(key, value) {
  if (value === null || value === false || value === undefined) return;
  if (typeof value === 'string' || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') return value;

  return String(value);
}

exports.default = function (styleObject) {
  return JSON.stringify(styleObject, sanitizeProperties).slice(2, -2).replace(/","/g, ';').replace(/":"/g, ':').replace(/\\"/g, '\'');
};
},{}],11:[function(require,module,exports){
const shaven = require('shaven').default
const esprima = require('esprima')

const walkTree = require('../walkTree')

const fileUrlForm = document.getElementById('fileUrl')
const fileUrlInput = document.querySelector('#fileUrl input')
const outputElement = document.getElementById('output')


function visualizeSyntax (fileData) {
  const output = []
  const indexOfFirstNewline = fileData.content.indexOf('\n')

  if (fileData.content.startsWith('#!')) {
    fileData.shebang = fileData.content.slice(0, indexOfFirstNewline)
    fileData.content = fileData.content.slice(indexOfFirstNewline)
  }

  const syntaxTree = esprima.parse(fileData.content, {
    loc: true,
    range: false,
    attachComment: true,
    tolerant: true,
  })

  outputElement.innerHTML = ''

  output.push(walkTree(syntaxTree, fileData))

  return output
}


function normalizeUrl (url) {
  // GitHub specific normalizations
  const githubMatch = url.match(/^https?:\/\/(github.com)/)
  return githubMatch
    ? url
      .replace(githubMatch[1], 'raw.githubusercontent.com')
      .replace('/blob', '')
    : url
}


async function loadFile (fileUrl) {
  if (!fileUrl.startsWith('http')) {
    fileUrl = '/files/' + fileUrl
  }
  else {
    fileUrl = normalizeUrl(fileUrl)
  }

  const fileContentResponse = await fetch(fileUrl)
  const fileData = {
    name: fileUrlInput.value,
    content: await fileContentResponse.text(),
  }
  console.info(fileData)
  const shavenArray = visualizeSyntax(fileData)

  shaven([outputElement, shavenArray])[0]
}


async function loadInitialFile () {
  const fileNameResponse = await fetch('/filename')
  const fileName = await fileNameResponse.text()

  loadFile(fileName)
}


loadInitialFile()

fileUrlForm.addEventListener('submit', event => {
  event.preventDefault()
  loadFile(fileUrlInput.value)
})

},{"../walkTree":"../walkTree","esprima":1,"shaven":4}],12:[function(require,module,exports){
/* eslint-disable indent */
module.exports.binary = {
    ',': 'comma',
    '...': 'spread',

   '||': 'or',
   '&&': 'and',

   '==': 'equals',
   '!=': 'equals-not',
  '===': 'equals-strict',
  '!==': 'equals-strict-not',

    '<': 'less-than',
    '>': 'greater-than',
   '<=': 'less-than-equals',
   '>=': 'greater-than-equals',

   '<<': 'shift-left',
   '>>': 'shift-right',
   '>>>': 'shift-right-zero-fill',

   '?': 'ternary',

    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'remainder',
   '**': 'exponent',

   '&': 'bit-and',
   '|': 'bit-or',
   '^': 'bit-xor',

     '=': 'assign',
    '+=': 'assign-add',
    '-=': 'assign-subtract',
    '*=': 'assign-multiply',
    '/=': 'assign-divide',
    '%=': 'assign-remainder',
   '**=': 'assign-exponent',
   '<<=': 'assign-shift-left',
   '>>=': 'assign-shift-right',
  '>>>=': 'assign-shift-right-unsigned',
    '&=': 'assign-bit-and',
    '^=': 'assign-bit-xor',
    '|=': 'assign-bit-or',

   instanceof: 'instanceof',
   in: 'in',
}


module.exports.unary = {
   '!': 'not',

   '+': 'plus',
   '-': 'negate',

  '++': 'increment',
  '--': 'decrement',

   '~': 'bit-not',

  delete: 'delete',
  new: 'new',
  typeof: 'typeof',
  void: 'void',
  yield: 'yield',
}

},{}],"/source/visualizers/array-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.arrayExpression',
  // ['span.openingBracket', '['],
  ...node.elements.map(element =>
    [
      ['span.arrayElement', walkTree(element)],
      // (index !== node.elements.length - 1) ?
      //  ['span.arraySeparator', ','] :
      //  ''
    ]
  ),
  // ['span.closingBracket', ']']
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/array-pattern.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  '.arrayPattern',
  walkTree(node.elements),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/arrow-function-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = node => {
  const classes = ['arrowFunctionExpression']
  if (node.async) classes.push('async')
  if (node.generator) classes.push('generator')

  return [
    'div',
    {class: classes.join(' ')},
    ['div', // Used for flex layout
      ['.parameters', walkTree(node.params)],
      ['.body', walkTree(node.body)],
    ],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/assignment-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (expression) => [
  'div.assignmentExpression',
  ['span.left', walkTree(expression.left)],
  ['span.right', walkTree(expression.right)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/assignment-pattern.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'div.assignmentPattern',
  ['span.left', walkTree(node.left)],
  ['span.right', walkTree(node.right)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/await-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.awaitExpression',
  walkTree(node.argument),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/binary-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')
const operatorMap = require('../operatorMap.js')

module.exports = (node) => [
  'span.binaryExpression',
  {
    class: 'operator-' + (operatorMap.binary[node.operator] || ''),
  },
  ['span.left', walkTree(node.left)],
  ['span.right', walkTree(node.right)],
]

},{"../operatorMap.js":12,"../walkTree":"../walkTree"}],"/source/visualizers/break-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.breakStatement',
  ['span.label', node.label
    ? walkTree(node.label)
    : null,
  ],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/call-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.callExpression',
  ['span.callee', walkTree(node.callee)],
  ['span.arguments', walkTree(node.arguments)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/catch-clause.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  '.catchClause',
  ['span.param', walkTree(node.param)],
  ['span.body', walkTree(node.body)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/class-body.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'div.classBody',
  walkTree(node.body),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/class-declaration.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'section.classDeclaration',
  ['header',
    ['span.name', walkTree(node.id)],
    ['span.superClass', '', node.superClass
      ? walkTree(node.superClass)
      : null,
    ],
  ],
  ['div.body', walkTree(node.body)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/class-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'section.classExpression',
  ['header',
    ['span.name', walkTree(node.id)],
    ['span.superClass', '', node.superClass
      ? walkTree(node.superClass)
      : null,
    ],
  ],
  ['div.body', walkTree(node.body)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/conditional-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.conditionalExpression',
  ['span', walkTree(node.test)],
  ['span', ' ? '],
  ['span', walkTree(node.consequent)],
  ['span', ' : '],
  ['span', walkTree(node.alternate)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/expression-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree.js')

module.exports = (node) => [
  'span.expressionStatement',
  walkTree(node.expression),
]

},{"../walkTree.js":"../walkTree"}],"/source/visualizers/for-of-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = node => {
  return [
    'section.code.forOf',
    ['header',
      ['.left', walkTree(node.left)],
      ['.right', walkTree(node.right)],
    ],
    ['.body', node.body
      ? walkTree(node.body)
      : null,
    ],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/for-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = node => {
  return [
    'section.code.for',
    ['header',
      ['.init', walkTree(node.init)],
      ['.test', walkTree(node.test)],
    ],
    ['.body', node.body ? walkTree(node.body) : null],
    ['.update', walkTree(node.update)],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/function-declaration.js":[function(require,module,exports){
const walkTree = require('../walkTree')


function markAsFunctionParameter (objects) {
  return objects.map(param => {
    param.isFunctionParameter = true
    return param
  })
}

module.exports = (node) => {
  return [
    'section.code.function',
    ['header',
      ['span.name', walkTree(node.id)],
      ['span.parameters', walkTree(markAsFunctionParameter(node.params))],
    ],
    ['div', node.body ? walkTree(node.body) : null],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/function-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.functionExpression',
  ['span.parameters', walkTree(node.params)],
  ['span', ' => '],
  ['span', walkTree(node.body)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/identifier.js":[function(require,module,exports){
const specialClassMap = {
  Infinity: 'infinity',
  undefined: 'undefined',
  NaN: 'nan',
}

module.exports = (node) => {
  const classes = ['identifier']

  if (specialClassMap.hasOwnProperty(node.name)) {
    classes.push(specialClassMap[node.name])
    node.name = ''
  }

  if (node.isFunctionParameter) {
    classes.push('parameter')
  }

  return [
    'span',
    {class: classes.join(' ')},
    node.name,
  ]
}

},{}],"/source/visualizers/if-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = node => {
  return [
    'section.code.if',
    ['header.test', walkTree(node.test)],
    ['div.consequent', node.consequent ? walkTree(node.consequent) : null],
    ['div.alternate', node.alternate ? walkTree(node.alternate) : null],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/literal.js":[function(require,module,exports){
module.exports = (node) => {
  let nodeType = typeof node.value
  const classes = ['literal']

  if (node.regex) nodeType = 'regex'
  else if (node.value === null) nodeType = 'null'

  classes.push(nodeType)

  if (node.value === true) classes.push('true')
  if (node.value === false) classes.push('false')

  return [
    'span',
    {class: classes.join(' ')},
    node.regex
      ? String(node.value)
      : ['boolean', 'null'].includes(nodeType)
        ? ''
        : JSON
          .stringify(node.value)
          .replace(/^"(.*)"$/, '$1'),
  ]
}

},{}],"/source/visualizers/logical-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')
const operatorMap = require('../operatorMap.js')


module.exports = (node) => {
  const classes = ['logicalExpression']
  if (node.operator) {
    classes.push('operator-' + operatorMap.binary[node.operator])
  }

  return [
    'span',
    {class: classes.join(' ')},
    ['span.left', walkTree(node.left)],
    ['span.right', walkTree(node.right)],
  ]
}

},{"../operatorMap.js":12,"../walkTree":"../walkTree"}],"/source/visualizers/member-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  const classes = ['memberExpression']
  if (node.computed) classes.push('computed')

  return [
    'span',
    {class: classes.join(' ')},
    ['span.object', walkTree(node.object)],
    ['span.property', walkTree(node.property)],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/method-definition.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  return [
    'section.code.method',
    ['header', walkTree(node.key)],
    ['div', walkTree(node.value)],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/new-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.newExpression',
  'new ',
  ['span', walkTree(node.callee)],
  ['span.leftSeparator', '('],
  ['span', ...node.arguments.map(walkTree)],
  ['span.rightSeparator', ')'],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/object-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  return [
    'span.objectExpression',
    walkTree(node.properties),
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/object-pattern.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.objectPattern',
  walkTree(node.properties),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/property-comment.js":[function(require,module,exports){
module.exports = node => [
  'span.propertyComment',
  node.value,
]

},{}],"/source/visualizers/property.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  const classes = [
    'property',
    node.kind,
  ]

  if (node.method) classes.push('method')
  if (node.shorthand) classes.push('shorthand')

  return [
    'span',
    {class: classes.join(' ')},
    ['span.key', walkTree(node.key)],
    ['span.value', walkTree(node.value)],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/return-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.return',
  walkTree(node.argument),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/spread-element.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  console.dir(JSON.stringify(node, null, 2))

  return [
    'span.operator-spread',
    walkTree(node.argument),
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/super.js":[function(require,module,exports){
module.exports = () => [
  'span.super', '',
]

},{}],"/source/visualizers/template-element.js":[function(require,module,exports){
module.exports = (node) => {
  const classes = ['templateElement', 'string']

  if (node.tail) classes.push('tail')

  return [
    'span',
    {class: classes.join(' ')},
    node.value.raw,
  ]
}

},{}],"/source/visualizers/template-literal.js":[function(require,module,exports){
const walkTree = require('../walkTree')

function zipExpressions (quasis, expressions) {
  const combined = []
  quasis.forEach((quasi, index) => {
    combined.push(quasi)
    if (expressions[index]) {
      combined.push(expressions[index])
    }
  })
  return combined
}

module.exports = node => [
  'span.templateLiteral',
  walkTree(zipExpressions(node.quasis, node.expressions)),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/this-expression.js":[function(require,module,exports){
module.exports = () => [
  'span.thisExpression',
  'this',
]

},{}],"/source/visualizers/throw-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.throwStatement',
  ['span.argument', walkTree(node.argument)],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/try-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  '.tryStatement',
  ['.block', walkTree(node.block)],
  ['.handler', walkTree(node.handler)],
  ['.finalizer', node.finalizer
    ? walkTree(node.finalizer)
    : null,
  ],
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/unary-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')
const operatorMap = require('../operatorMap.js')

module.exports = (node) => [
  'span.unaryExpression',
  {
    class: 'operator-' + (operatorMap.unary[node.operator] || ''),
  },
  walkTree(node.argument),
]

},{"../operatorMap.js":12,"../walkTree":"../walkTree"}],"/source/visualizers/update-expression.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'span.updateExpression',
  ['span.operator', node.operator],
  walkTree(node.argument),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/variable-declaration.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => [
  'div',
  {class: 'declarations ' + node.kind},
  walkTree(node.declarations),
]

},{"../walkTree":"../walkTree"}],"/source/visualizers/variable-declarator.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = (node) => {
  const hasInit = Boolean(node.init)
  const classes = ['declaration']

  if (hasInit) classes.push('hasInit')

  return [
    'div',
    {class: classes.join(' ')},
    ['span.identifier', walkTree(node.id)],
    ['span.init', hasInit
      ? walkTree(node.init)
      : null,
    ],
  ]
}

},{"../walkTree":"../walkTree"}],"/source/visualizers/while-statement.js":[function(require,module,exports){
const walkTree = require('../walkTree')

module.exports = node => {
  return [
    'section.code.while',
    ['header.test',
      ['div', walkTree(node.test)],
    ],
    ['div.body', node.body ? walkTree(node.body) : null],
  ]
}

},{"../walkTree":"../walkTree"}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2Uvd2Fsa1RyZWUuanMiLCJub2RlX21vZHVsZXMvZXNwcmltYS9kaXN0L2VzcHJpbWEuanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zaGF2ZW4vYnVpbGQvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zaGF2ZW4vYnVpbGQvYnVpbGRUcmFuc2Zvcm1TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvc2hhdmVuL2J1aWxkL2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL3NoYXZlbi9idWlsZC9tYXBBdHRyaWJ1dGVWYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9zaGF2ZW4vYnVpbGQvbmFtZXNwYWNlVG9VUkwuanMiLCJub2RlX21vZHVsZXMvc2hhdmVuL2J1aWxkL3BhcnNlU3VnYXJTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvc2hhdmVuL2J1aWxkL3N0cmluZ2lmeVN0eWxlT2JqZWN0LmpzIiwic291cmNlL2luZGV4LmpzIiwic291cmNlL29wZXJhdG9yTWFwLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2FycmF5LWV4cHJlc3Npb24uanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvYXJyYXktcGF0dGVybi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9hcnJvdy1mdW5jdGlvbi1leHByZXNzaW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2Fzc2lnbm1lbnQtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9hc3NpZ25tZW50LXBhdHRlcm4uanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvYXdhaXQtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9iaW5hcnktZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9icmVhay1zdGF0ZW1lbnQuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvY2FsbC1leHByZXNzaW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2NhdGNoLWNsYXVzZS5qcyIsInNvdXJjZS92aXN1YWxpemVycy9jbGFzcy1ib2R5LmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2NsYXNzLWRlY2xhcmF0aW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2NsYXNzLWV4cHJlc3Npb24uanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvY29uZGl0aW9uYWwtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9leHByZXNzaW9uLXN0YXRlbWVudC5qcyIsInNvdXJjZS92aXN1YWxpemVycy9mb3Itb2Ytc3RhdGVtZW50LmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2Zvci1zdGF0ZW1lbnQuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvZnVuY3Rpb24tZGVjbGFyYXRpb24uanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvZnVuY3Rpb24tZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9pZGVudGlmaWVyLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2lmLXN0YXRlbWVudC5qcyIsInNvdXJjZS92aXN1YWxpemVycy9saXRlcmFsLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL2xvZ2ljYWwtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9tZW1iZXItZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9tZXRob2QtZGVmaW5pdGlvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9uZXctZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9vYmplY3QtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9vYmplY3QtcGF0dGVybi5qcyIsInNvdXJjZS92aXN1YWxpemVycy9wcm9wZXJ0eS1jb21tZW50LmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3Byb3BlcnR5LmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3JldHVybi1zdGF0ZW1lbnQuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvc3ByZWFkLWVsZW1lbnQuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvc3VwZXIuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvdGVtcGxhdGUtZWxlbWVudC5qcyIsInNvdXJjZS92aXN1YWxpemVycy90ZW1wbGF0ZS1saXRlcmFsLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3RoaXMtZXhwcmVzc2lvbi5qcyIsInNvdXJjZS92aXN1YWxpemVycy90aHJvdy1zdGF0ZW1lbnQuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvdHJ5LXN0YXRlbWVudC5qcyIsInNvdXJjZS92aXN1YWxpemVycy91bmFyeS1leHByZXNzaW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3VwZGF0ZS1leHByZXNzaW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3ZhcmlhYmxlLWRlY2xhcmF0aW9uLmpzIiwic291cmNlL3Zpc3VhbGl6ZXJzL3ZhcmlhYmxlLWRlY2xhcmF0b3IuanMiLCJzb3VyY2UvdmlzdWFsaXplcnMvd2hpbGUtc3RhdGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNpTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuY29uc3QgdmlzdWFsaXplcnNQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Zpc3VhbGl6ZXJzJylcblxuY29uc3QgdmlzdWFsaXplck5hbWVzID0gW1wiLkRTX1N0b3JlXCIsXCJhcnJheS1leHByZXNzaW9uLmpzXCIsXCJhcnJheS1wYXR0ZXJuLmpzXCIsXCJhcnJvdy1mdW5jdGlvbi1leHByZXNzaW9uLmpzXCIsXCJhc3NpZ25tZW50LWV4cHJlc3Npb24uanNcIixcImFzc2lnbm1lbnQtcGF0dGVybi5qc1wiLFwiYXdhaXQtZXhwcmVzc2lvbi5qc1wiLFwiYmluYXJ5LWV4cHJlc3Npb24uanNcIixcImJyZWFrLXN0YXRlbWVudC5qc1wiLFwiY2FsbC1leHByZXNzaW9uLmpzXCIsXCJjYXRjaC1jbGF1c2UuanNcIixcImNsYXNzLWJvZHkuanNcIixcImNsYXNzLWRlY2xhcmF0aW9uLmpzXCIsXCJjbGFzcy1leHByZXNzaW9uLmpzXCIsXCJjb25kaXRpb25hbC1leHByZXNzaW9uLmpzXCIsXCJleHByZXNzaW9uLXN0YXRlbWVudC5qc1wiLFwiZm9yLW9mLXN0YXRlbWVudC5qc1wiLFwiZm9yLXN0YXRlbWVudC5qc1wiLFwiZnVuY3Rpb24tZGVjbGFyYXRpb24uanNcIixcImZ1bmN0aW9uLWV4cHJlc3Npb24uanNcIixcImlkZW50aWZpZXIuanNcIixcImlmLXN0YXRlbWVudC5qc1wiLFwibGl0ZXJhbC5qc1wiLFwibG9naWNhbC1leHByZXNzaW9uLmpzXCIsXCJtZW1iZXItZXhwcmVzc2lvbi5qc1wiLFwibWV0aG9kLWRlZmluaXRpb24uanNcIixcIm5ldy1leHByZXNzaW9uLmpzXCIsXCJvYmplY3QtZXhwcmVzc2lvbi5qc1wiLFwib2JqZWN0LXBhdHRlcm4uanNcIixcInByb3BlcnR5LWNvbW1lbnQuanNcIixcInByb3BlcnR5LmpzXCIsXCJyZXR1cm4tc3RhdGVtZW50LmpzXCIsXCJzcHJlYWQtZWxlbWVudC5qc1wiLFwic3VwZXIuanNcIixcInRlbXBsYXRlLWVsZW1lbnQuanNcIixcInRlbXBsYXRlLWxpdGVyYWwuanNcIixcInRoaXMtZXhwcmVzc2lvbi5qc1wiLFwidGhyb3ctc3RhdGVtZW50LmpzXCIsXCJ0cnktc3RhdGVtZW50LmpzXCIsXCJ1bmFyeS1leHByZXNzaW9uLmpzXCIsXCJ1cGRhdGUtZXhwcmVzc2lvbi5qc1wiLFwidmFyaWFibGUtZGVjbGFyYXRpb24uanNcIixcInZhcmlhYmxlLWRlY2xhcmF0b3IuanNcIixcIndoaWxlLXN0YXRlbWVudC5qc1wiXVxuXG5jb25zdCB2aXN1YWxpemVycyA9IHt9XG52aXN1YWxpemVyTmFtZXNcbiAgLmZpbHRlcihuYW1lID0+IC8uK1xcLmpzJC9pLnRlc3QobmFtZSkpXG4gIC5mb3JFYWNoKG5hbWUgPT4ge1xuXG4gICAgY29uc3QgbmFtZUluQ2FtZWxDYXNlID0gbmFtZVxuICAgICAgLnJlcGxhY2UoJy5qcycsICcnKVxuICAgICAgLnNwbGl0KCctJylcbiAgICAgIC5tYXAoY2FwaXRhbGl6ZSlcbiAgICAgIC5qb2luKCcnKVxuXG4gICAgdmlzdWFsaXplcnNbbmFtZUluQ2FtZWxDYXNlXSA9IHBhdGguam9pbih2aXN1YWxpemVyc1BhdGgsIG5hbWUpXG4gIH0pXG5cblxuZnVuY3Rpb24gY2FwaXRhbGl6ZSAod29yZCkge1xuICByZXR1cm4gd29yZFswXS50b1VwcGVyQ2FzZSgpICsgd29yZC5zdWJzdHIoMSlcbn1cblxuXG5mdW5jdGlvbiBoYXNMZWFkaW5nQ29tbWVudHMgKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQuaGFzT3duUHJvcGVydHkoJ2xlYWRpbmdDb21tZW50cycpXG59XG5cblxuZnVuY3Rpb24gY29tbWVudFRlbXBsYXRlIChjb21tZW50KSB7XG4gIHJldHVybiBbXG4gICAgJ3AmJyxcbiAgICB7Y2xhc3M6ICdjb21tZW50ICcgKyBjb21tZW50LnR5cGUudG9Mb3dlckNhc2UoKX0sXG4gICAgY29tbWVudC52YWx1ZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKSxcbiAgXVxufVxuXG5cbmZ1bmN0aW9uIHdhbGtUcmVlIChub2RlLCBmaWxlRGF0YSkge1xuICBpZiAoIW5vZGUgfHwgKEFycmF5LmlzQXJyYXkobm9kZSkgJiYgIW5vZGUubGVuZ3RoKSkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gQ29udmVydCBjb21tZW50cyBpbiBvYmplY3RzIHRvIGEgdGFibGUgZnJpZW5kbHkgZm9ybWF0XG4gIGlmIChcbiAgICAgIG5vZGUudHlwZSA9PT0gJ09iamVjdEV4cHJlc3Npb24nICYmXG4gICAgICBub2RlLnByb3BlcnRpZXMuc29tZShoYXNMZWFkaW5nQ29tbWVudHMpXG4gICAgKSB7XG5cbiAgICBub2RlLnByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHksIHByb3BlcnR5SW5kZXgpID0+IHtcbiAgICAgIGlmICghaGFzTGVhZGluZ0NvbW1lbnRzKHByb3BlcnR5KSkgcmV0dXJuXG5cbiAgICAgIG5vZGUucHJvcGVydGllcy5zcGxpY2UoXG4gICAgICAgIHByb3BlcnR5SW5kZXgsXG4gICAgICAgIDAsXG4gICAgICAgIHByb3BlcnR5LmxlYWRpbmdDb21tZW50cy5tYXAoY29tbWVudCA9PiAoe1xuICAgICAgICAgIHR5cGU6ICdQcm9wZXJ0eUNvbW1lbnQnLFxuICAgICAgICAgIHZhbHVlOiBjb21tZW50LnZhbHVlLFxuICAgICAgICB9KSlcbiAgICAgIClcbiAgICAgIGRlbGV0ZSBwcm9wZXJ0eS5sZWFkaW5nQ29tbWVudHNcbiAgICB9KVxuICB9XG5cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlLmxlYWRpbmdDb21tZW50cykpIHtcbiAgICBpZiAobm9kZS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoKSB7XG4gICAgICBpZiAobm9kZS5sZWFkaW5nQ29tbWVudHMuc29tZShjb21tZW50ID0+IGNvbW1lbnQudmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gbm9kZS5sZWFkaW5nQ29tbWVudHNcbiAgICAgICAgICAubWFwKGNvbW1lbnQgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbW1lbnQudmFsdWUgPT09IG51bGwpIHJldHVybiAnJ1xuICAgICAgICAgICAgY29uc3QgY29tbWVudEFycmF5ID0gY29tbWVudFRlbXBsYXRlKGNvbW1lbnQpXG4gICAgICAgICAgICBjb21tZW50LnZhbHVlID0gbnVsbFxuICAgICAgICAgICAgcmV0dXJuIGNvbW1lbnRBcnJheVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIFsnLmNvbW1lbnRlZFNlY3Rpb24nLFxuICAgICAgICAgIFsnLmxlYWRpbmdDb21tZW50cycsIC4uLmNvbW1lbnRzXSxcbiAgICAgICAgICB3YWxrVHJlZShub2RlLCBmaWxlRGF0YSksXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWxldGUgbm9kZS5sZWFkaW5nQ29tbWVudHNcbiAgICAgIHJldHVybiB3YWxrVHJlZShub2RlLCBmaWxlRGF0YSlcbiAgICB9XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShub2RlLnRyYWlsaW5nQ29tbWVudHMpKSB7XG4gICAgaWYgKG5vZGUubG9jLmVuZC5saW5lID09PSBub2RlLnRyYWlsaW5nQ29tbWVudHNbMF0ubG9jLmVuZC5saW5lKSB7XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50c1swXS52YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICBub2RlLnRyYWlsaW5nQ29tbWVudHNbMF0udHlwZSA9PT0gJ0xpbmUnXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgY29tbWVudEFycmF5ID0gW1xuICAgICAgICAgICdzcGFuLnRyYWlsaW5nLmNvbW1lbnQnLFxuICAgICAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50c1swXS52YWx1ZS50cmltKCksXG4gICAgICAgIF1cblxuICAgICAgICBub2RlLnRyYWlsaW5nQ29tbWVudHNbMF0udmFsdWUgPSBudWxsXG5cbiAgICAgICAgcmV0dXJuIFsnLndpdGhUcmFpbGluZ0NvbW1lbnQnLFxuICAgICAgICAgIHdhbGtUcmVlKG5vZGUsIGZpbGVEYXRhKSxcbiAgICAgICAgICBjb21tZW50QXJyYXksXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBub2RlLnRyYWlsaW5nQ29tbWVudHMgPSAnbnVsbCdcbiAgICAgIHJldHVybiB3YWxrVHJlZShub2RlLCBmaWxlRGF0YSlcbiAgICB9XG4gIH1cblxuXG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpICYmIG5vZGUubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5vZGUubWFwKHdhbGtUcmVlKVxuICB9XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ1Byb2dyYW0nKSB7XG4gICAgbGV0IHNoZWJhbmcgPSAnJ1xuXG4gICAgaWYgKGZpbGVEYXRhLnNoZWJhbmcpIHtcbiAgICAgIHNoZWJhbmcgPSBbJy5zaGViYW5nJywgZmlsZURhdGEuc2hlYmFuZ11cbiAgICB9XG5cbiAgICByZXR1cm4gWydzZWN0aW9uLmZpbGUnLFxuICAgICAgc2hlYmFuZyxcbiAgICAgIFsnc3Bhbi5sYWJlbCcsIGZpbGVEYXRhID8gZmlsZURhdGEubmFtZSA6IGZhbHNlXSxcbiAgICAgIC4uLm5vZGUuYm9keS5tYXAod2Fsa1RyZWUpLFxuICAgICAgQXJyYXkuaXNBcnJheShub2RlLmNvbW1lbnRzKVxuICAgICAgICA/IFtcbiAgICAgICAgICAnLmNvbW1lbnRzJyxcbiAgICAgICAgICAuLi5ub2RlLmNvbW1lbnRzXG4gICAgICAgICAgICAuZmlsdGVyKGNvbW1lbnQgPT4gY29tbWVudC52YWx1ZSlcbiAgICAgICAgICAgIC5tYXAoY29tbWVudCA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBjb21tZW50VGVtcGxhdGUoY29tbWVudClcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdXG4gICAgICAgIDogdHJ1ZSxcbiAgICBdXG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnQmxvY2tTdGF0ZW1lbnQnKSB7XG4gICAgaWYgKG5vZGUuYm9keS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBub2RlLmJvZHkubWFwKHdhbGtUcmVlKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG5cbiAgaWYgKHZpc3VhbGl6ZXJzW25vZGUudHlwZV0pIHtcbiAgICByZXR1cm4gcmVxdWlyZSh2aXN1YWxpemVyc1tub2RlLnR5cGVdKShub2RlKVxuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiBbJ3AuZXJyb3InLCBub2RlLnR5cGVdXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YWxrVHJlZVxuXG5cbiIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZXNwcmltYVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJlc3ByaW1hXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0LypcclxuXHQgIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMsIGh0dHBzOi8vanMuZm91bmRhdGlvbi9cclxuXHJcblx0ICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcclxuXHQgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG5cclxuXHQgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxyXG5cdCAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHQgICAgKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxyXG5cdCAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcclxuXHQgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cclxuXHQgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXHJcblx0ICBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXHJcblx0ICBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxyXG5cdCAgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxyXG5cdCAgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcclxuXHQgIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcclxuXHQgIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxyXG5cdCAgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcclxuXHQgIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxyXG5cdCAgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cclxuXHQqL1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHR2YXIgY29tbWVudF9oYW5kbGVyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpO1xyXG5cdHZhciBqc3hfcGFyc2VyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpO1xyXG5cdHZhciBwYXJzZXJfMSA9IF9fd2VicGFja19yZXF1aXJlX18oOCk7XHJcblx0dmFyIHRva2VuaXplcl8xID0gX193ZWJwYWNrX3JlcXVpcmVfXygxNSk7XHJcblx0ZnVuY3Rpb24gcGFyc2UoY29kZSwgb3B0aW9ucywgZGVsZWdhdGUpIHtcclxuXHQgICAgdmFyIGNvbW1lbnRIYW5kbGVyID0gbnVsbDtcclxuXHQgICAgdmFyIHByb3h5RGVsZWdhdGUgPSBmdW5jdGlvbiAobm9kZSwgbWV0YWRhdGEpIHtcclxuXHQgICAgICAgIGlmIChkZWxlZ2F0ZSkge1xyXG5cdCAgICAgICAgICAgIGRlbGVnYXRlKG5vZGUsIG1ldGFkYXRhKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjb21tZW50SGFuZGxlcikge1xyXG5cdCAgICAgICAgICAgIGNvbW1lbnRIYW5kbGVyLnZpc2l0KG5vZGUsIG1ldGFkYXRhKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgdmFyIHBhcnNlckRlbGVnYXRlID0gKHR5cGVvZiBkZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJykgPyBwcm94eURlbGVnYXRlIDogbnVsbDtcclxuXHQgICAgdmFyIGNvbGxlY3RDb21tZW50ID0gZmFsc2U7XHJcblx0ICAgIGlmIChvcHRpb25zKSB7XHJcblx0ICAgICAgICBjb2xsZWN0Q29tbWVudCA9ICh0eXBlb2Ygb3B0aW9ucy5jb21tZW50ID09PSAnYm9vbGVhbicgJiYgb3B0aW9ucy5jb21tZW50KTtcclxuXHQgICAgICAgIHZhciBhdHRhY2hDb21tZW50ID0gKHR5cGVvZiBvcHRpb25zLmF0dGFjaENvbW1lbnQgPT09ICdib29sZWFuJyAmJiBvcHRpb25zLmF0dGFjaENvbW1lbnQpO1xyXG5cdCAgICAgICAgaWYgKGNvbGxlY3RDb21tZW50IHx8IGF0dGFjaENvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICBjb21tZW50SGFuZGxlciA9IG5ldyBjb21tZW50X2hhbmRsZXJfMS5Db21tZW50SGFuZGxlcigpO1xyXG5cdCAgICAgICAgICAgIGNvbW1lbnRIYW5kbGVyLmF0dGFjaCA9IGF0dGFjaENvbW1lbnQ7XHJcblx0ICAgICAgICAgICAgb3B0aW9ucy5jb21tZW50ID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICBwYXJzZXJEZWxlZ2F0ZSA9IHByb3h5RGVsZWdhdGU7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH1cclxuXHQgICAgdmFyIGlzTW9kdWxlID0gZmFsc2U7XHJcblx0ICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnNvdXJjZVR5cGUgPT09ICdzdHJpbmcnKSB7XHJcblx0ICAgICAgICBpc01vZHVsZSA9IChvcHRpb25zLnNvdXJjZVR5cGUgPT09ICdtb2R1bGUnKTtcclxuXHQgICAgfVxyXG5cdCAgICB2YXIgcGFyc2VyO1xyXG5cdCAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5qc3ggPT09ICdib29sZWFuJyAmJiBvcHRpb25zLmpzeCkge1xyXG5cdCAgICAgICAgcGFyc2VyID0gbmV3IGpzeF9wYXJzZXJfMS5KU1hQYXJzZXIoY29kZSwgb3B0aW9ucywgcGFyc2VyRGVsZWdhdGUpO1xyXG5cdCAgICB9XHJcblx0ICAgIGVsc2Uge1xyXG5cdCAgICAgICAgcGFyc2VyID0gbmV3IHBhcnNlcl8xLlBhcnNlcihjb2RlLCBvcHRpb25zLCBwYXJzZXJEZWxlZ2F0ZSk7XHJcblx0ICAgIH1cclxuXHQgICAgdmFyIHByb2dyYW0gPSBpc01vZHVsZSA/IHBhcnNlci5wYXJzZU1vZHVsZSgpIDogcGFyc2VyLnBhcnNlU2NyaXB0KCk7XHJcblx0ICAgIHZhciBhc3QgPSBwcm9ncmFtO1xyXG5cdCAgICBpZiAoY29sbGVjdENvbW1lbnQgJiYgY29tbWVudEhhbmRsZXIpIHtcclxuXHQgICAgICAgIGFzdC5jb21tZW50cyA9IGNvbW1lbnRIYW5kbGVyLmNvbW1lbnRzO1xyXG5cdCAgICB9XHJcblx0ICAgIGlmIChwYXJzZXIuY29uZmlnLnRva2Vucykge1xyXG5cdCAgICAgICAgYXN0LnRva2VucyA9IHBhcnNlci50b2tlbnM7XHJcblx0ICAgIH1cclxuXHQgICAgaWYgKHBhcnNlci5jb25maWcudG9sZXJhbnQpIHtcclxuXHQgICAgICAgIGFzdC5lcnJvcnMgPSBwYXJzZXIuZXJyb3JIYW5kbGVyLmVycm9ycztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gYXN0O1xyXG5cdH1cclxuXHRleHBvcnRzLnBhcnNlID0gcGFyc2U7XHJcblx0ZnVuY3Rpb24gcGFyc2VNb2R1bGUoY29kZSwgb3B0aW9ucywgZGVsZWdhdGUpIHtcclxuXHQgICAgdmFyIHBhcnNpbmdPcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHQgICAgcGFyc2luZ09wdGlvbnMuc291cmNlVHlwZSA9ICdtb2R1bGUnO1xyXG5cdCAgICByZXR1cm4gcGFyc2UoY29kZSwgcGFyc2luZ09wdGlvbnMsIGRlbGVnYXRlKTtcclxuXHR9XHJcblx0ZXhwb3J0cy5wYXJzZU1vZHVsZSA9IHBhcnNlTW9kdWxlO1xyXG5cdGZ1bmN0aW9uIHBhcnNlU2NyaXB0KGNvZGUsIG9wdGlvbnMsIGRlbGVnYXRlKSB7XHJcblx0ICAgIHZhciBwYXJzaW5nT3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0ICAgIHBhcnNpbmdPcHRpb25zLnNvdXJjZVR5cGUgPSAnc2NyaXB0JztcclxuXHQgICAgcmV0dXJuIHBhcnNlKGNvZGUsIHBhcnNpbmdPcHRpb25zLCBkZWxlZ2F0ZSk7XHJcblx0fVxyXG5cdGV4cG9ydHMucGFyc2VTY3JpcHQgPSBwYXJzZVNjcmlwdDtcclxuXHRmdW5jdGlvbiB0b2tlbml6ZShjb2RlLCBvcHRpb25zLCBkZWxlZ2F0ZSkge1xyXG5cdCAgICB2YXIgdG9rZW5pemVyID0gbmV3IHRva2VuaXplcl8xLlRva2VuaXplcihjb2RlLCBvcHRpb25zKTtcclxuXHQgICAgdmFyIHRva2VucztcclxuXHQgICAgdG9rZW5zID0gW107XHJcblx0ICAgIHRyeSB7XHJcblx0ICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG5cdCAgICAgICAgICAgIHZhciB0b2tlbiA9IHRva2VuaXplci5nZXROZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBpZiAoIXRva2VuKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoZGVsZWdhdGUpIHtcclxuXHQgICAgICAgICAgICAgICAgdG9rZW4gPSBkZWxlZ2F0ZSh0b2tlbik7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfVxyXG5cdCAgICBjYXRjaCAoZSkge1xyXG5cdCAgICAgICAgdG9rZW5pemVyLmVycm9ySGFuZGxlci50b2xlcmF0ZShlKTtcclxuXHQgICAgfVxyXG5cdCAgICBpZiAodG9rZW5pemVyLmVycm9ySGFuZGxlci50b2xlcmFudCkge1xyXG5cdCAgICAgICAgdG9rZW5zLmVycm9ycyA9IHRva2VuaXplci5lcnJvcnMoKTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gdG9rZW5zO1xyXG5cdH1cclxuXHRleHBvcnRzLnRva2VuaXplID0gdG9rZW5pemU7XHJcblx0dmFyIHN5bnRheF8xID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcclxuXHRleHBvcnRzLlN5bnRheCA9IHN5bnRheF8xLlN5bnRheDtcclxuXHQvLyBTeW5jIHdpdGggKi5qc29uIG1hbmlmZXN0cy5cclxuXHRleHBvcnRzLnZlcnNpb24gPSAnNC4wLjAnO1xyXG5cblxuLyoqKi8gfSxcbi8qIDEgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHR2YXIgc3ludGF4XzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDIpO1xyXG5cdHZhciBDb21tZW50SGFuZGxlciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIENvbW1lbnRIYW5kbGVyKCkge1xyXG5cdCAgICAgICAgdGhpcy5hdHRhY2ggPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuY29tbWVudHMgPSBbXTtcclxuXHQgICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcclxuXHQgICAgICAgIHRoaXMubGVhZGluZyA9IFtdO1xyXG5cdCAgICAgICAgdGhpcy50cmFpbGluZyA9IFtdO1xyXG5cdCAgICB9XHJcblx0ICAgIENvbW1lbnRIYW5kbGVyLnByb3RvdHlwZS5pbnNlcnRJbm5lckNvbW1lbnRzID0gZnVuY3Rpb24gKG5vZGUsIG1ldGFkYXRhKSB7XHJcblx0ICAgICAgICAvLyAgaW5ubmVyQ29tbWVudHMgZm9yIHByb3BlcnRpZXMgZW1wdHkgYmxvY2tcclxuXHQgICAgICAgIC8vICBgZnVuY3Rpb24gYSgpIHsvKiogY29tbWVudHMgKipcXC99YFxyXG5cdCAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LkJsb2NrU3RhdGVtZW50ICYmIG5vZGUuYm9keS5sZW5ndGggPT09IDApIHtcclxuXHQgICAgICAgICAgICB2YXIgaW5uZXJDb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmxlYWRpbmcubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy5sZWFkaW5nW2ldO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAobWV0YWRhdGEuZW5kLm9mZnNldCA+PSBlbnRyeS5zdGFydCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5uZXJDb21tZW50cy51bnNoaWZ0KGVudHJ5LmNvbW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWFkaW5nLnNwbGljZShpLCAxKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhaWxpbmcuc3BsaWNlKGksIDEpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmIChpbm5lckNvbW1lbnRzLmxlbmd0aCkge1xyXG5cdCAgICAgICAgICAgICAgICBub2RlLmlubmVyQ29tbWVudHMgPSBpbm5lckNvbW1lbnRzO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgQ29tbWVudEhhbmRsZXIucHJvdG90eXBlLmZpbmRUcmFpbGluZ0NvbW1lbnRzID0gZnVuY3Rpb24gKG1ldGFkYXRhKSB7XHJcblx0ICAgICAgICB2YXIgdHJhaWxpbmdDb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgaWYgKHRoaXMudHJhaWxpbmcubGVuZ3RoID4gMCkge1xyXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyYWlsaW5nLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBlbnRyeV8xID0gdGhpcy50cmFpbGluZ1tpXTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKGVudHJ5XzEuc3RhcnQgPj0gbWV0YWRhdGEuZW5kLm9mZnNldCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHJhaWxpbmdDb21tZW50cy51bnNoaWZ0KGVudHJ5XzEuY29tbWVudCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdGhpcy50cmFpbGluZy5sZW5ndGggPSAwO1xyXG5cdCAgICAgICAgICAgIHJldHVybiB0cmFpbGluZ0NvbW1lbnRzO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdO1xyXG5cdCAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5Lm5vZGUudHJhaWxpbmdDb21tZW50cykge1xyXG5cdCAgICAgICAgICAgIHZhciBmaXJzdENvbW1lbnQgPSBlbnRyeS5ub2RlLnRyYWlsaW5nQ29tbWVudHNbMF07XHJcblx0ICAgICAgICAgICAgaWYgKGZpcnN0Q29tbWVudCAmJiBmaXJzdENvbW1lbnQucmFuZ2VbMF0gPj0gbWV0YWRhdGEuZW5kLm9mZnNldCkge1xyXG5cdCAgICAgICAgICAgICAgICB0cmFpbGluZ0NvbW1lbnRzID0gZW50cnkubm9kZS50cmFpbGluZ0NvbW1lbnRzO1xyXG5cdCAgICAgICAgICAgICAgICBkZWxldGUgZW50cnkubm9kZS50cmFpbGluZ0NvbW1lbnRzO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0cmFpbGluZ0NvbW1lbnRzO1xyXG5cdCAgICB9O1xyXG5cdCAgICBDb21tZW50SGFuZGxlci5wcm90b3R5cGUuZmluZExlYWRpbmdDb21tZW50cyA9IGZ1bmN0aW9uIChtZXRhZGF0YSkge1xyXG5cdCAgICAgICAgdmFyIGxlYWRpbmdDb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgdmFyIHRhcmdldDtcclxuXHQgICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApIHtcclxuXHQgICAgICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV07XHJcblx0ICAgICAgICAgICAgaWYgKGVudHJ5ICYmIGVudHJ5LnN0YXJ0ID49IG1ldGFkYXRhLnN0YXJ0Lm9mZnNldCkge1xyXG5cdCAgICAgICAgICAgICAgICB0YXJnZXQgPSBlbnRyeS5ub2RlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnBvcCgpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHRhcmdldCkge1xyXG5cdCAgICAgICAgICAgIHZhciBjb3VudCA9IHRhcmdldC5sZWFkaW5nQ29tbWVudHMgPyB0YXJnZXQubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA6IDA7XHJcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IGNvdW50IC0gMTsgaSA+PSAwOyAtLWkpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGNvbW1lbnQgPSB0YXJnZXQubGVhZGluZ0NvbW1lbnRzW2ldO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoY29tbWVudC5yYW5nZVsxXSA8PSBtZXRhZGF0YS5zdGFydC5vZmZzZXQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGxlYWRpbmdDb21tZW50cy51bnNoaWZ0KGNvbW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmxlYWRpbmdDb21tZW50cy5zcGxpY2UoaSwgMSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgaWYgKHRhcmdldC5sZWFkaW5nQ29tbWVudHMgJiYgdGFyZ2V0LmxlYWRpbmdDb21tZW50cy5sZW5ndGggPT09IDApIHtcclxuXHQgICAgICAgICAgICAgICAgZGVsZXRlIHRhcmdldC5sZWFkaW5nQ29tbWVudHM7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHJldHVybiBsZWFkaW5nQ29tbWVudHM7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5sZWFkaW5nLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy5sZWFkaW5nW2ldO1xyXG5cdCAgICAgICAgICAgIGlmIChlbnRyeS5zdGFydCA8PSBtZXRhZGF0YS5zdGFydC5vZmZzZXQpIHtcclxuXHQgICAgICAgICAgICAgICAgbGVhZGluZ0NvbW1lbnRzLnVuc2hpZnQoZW50cnkuY29tbWVudCk7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMubGVhZGluZy5zcGxpY2UoaSwgMSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGxlYWRpbmdDb21tZW50cztcclxuXHQgICAgfTtcclxuXHQgICAgQ29tbWVudEhhbmRsZXIucHJvdG90eXBlLnZpc2l0Tm9kZSA9IGZ1bmN0aW9uIChub2RlLCBtZXRhZGF0YSkge1xyXG5cdCAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LlByb2dyYW0gJiYgbm9kZS5ib2R5Lmxlbmd0aCA+IDApIHtcclxuXHQgICAgICAgICAgICByZXR1cm47XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmluc2VydElubmVyQ29tbWVudHMobm9kZSwgbWV0YWRhdGEpO1xyXG5cdCAgICAgICAgdmFyIHRyYWlsaW5nQ29tbWVudHMgPSB0aGlzLmZpbmRUcmFpbGluZ0NvbW1lbnRzKG1ldGFkYXRhKTtcclxuXHQgICAgICAgIHZhciBsZWFkaW5nQ29tbWVudHMgPSB0aGlzLmZpbmRMZWFkaW5nQ29tbWVudHMobWV0YWRhdGEpO1xyXG5cdCAgICAgICAgaWYgKGxlYWRpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XHJcblx0ICAgICAgICAgICAgbm9kZS5sZWFkaW5nQ29tbWVudHMgPSBsZWFkaW5nQ29tbWVudHM7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAodHJhaWxpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XHJcblx0ICAgICAgICAgICAgbm9kZS50cmFpbGluZ0NvbW1lbnRzID0gdHJhaWxpbmdDb21tZW50cztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuc3RhY2sucHVzaCh7XHJcblx0ICAgICAgICAgICAgbm9kZTogbm9kZSxcclxuXHQgICAgICAgICAgICBzdGFydDogbWV0YWRhdGEuc3RhcnQub2Zmc2V0XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgfTtcclxuXHQgICAgQ29tbWVudEhhbmRsZXIucHJvdG90eXBlLnZpc2l0Q29tbWVudCA9IGZ1bmN0aW9uIChub2RlLCBtZXRhZGF0YSkge1xyXG5cdCAgICAgICAgdmFyIHR5cGUgPSAobm9kZS50eXBlWzBdID09PSAnTCcpID8gJ0xpbmUnIDogJ0Jsb2NrJztcclxuXHQgICAgICAgIHZhciBjb21tZW50ID0ge1xyXG5cdCAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcblx0ICAgICAgICAgICAgdmFsdWU6IG5vZGUudmFsdWVcclxuXHQgICAgICAgIH07XHJcblx0ICAgICAgICBpZiAobm9kZS5yYW5nZSkge1xyXG5cdCAgICAgICAgICAgIGNvbW1lbnQucmFuZ2UgPSBub2RlLnJhbmdlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKG5vZGUubG9jKSB7XHJcblx0ICAgICAgICAgICAgY29tbWVudC5sb2MgPSBub2RlLmxvYztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuY29tbWVudHMucHVzaChjb21tZW50KTtcclxuXHQgICAgICAgIGlmICh0aGlzLmF0dGFjaCkge1xyXG5cdCAgICAgICAgICAgIHZhciBlbnRyeSA9IHtcclxuXHQgICAgICAgICAgICAgICAgY29tbWVudDoge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLnZhbHVlLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IFttZXRhZGF0YS5zdGFydC5vZmZzZXQsIG1ldGFkYXRhLmVuZC5vZmZzZXRdXHJcblx0ICAgICAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiBtZXRhZGF0YS5zdGFydC5vZmZzZXRcclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgIGlmIChub2RlLmxvYykge1xyXG5cdCAgICAgICAgICAgICAgICBlbnRyeS5jb21tZW50LmxvYyA9IG5vZGUubG9jO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBub2RlLnR5cGUgPSB0eXBlO1xyXG5cdCAgICAgICAgICAgIHRoaXMubGVhZGluZy5wdXNoKGVudHJ5KTtcclxuXHQgICAgICAgICAgICB0aGlzLnRyYWlsaW5nLnB1c2goZW50cnkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICBDb21tZW50SGFuZGxlci5wcm90b3R5cGUudmlzaXQgPSBmdW5jdGlvbiAobm9kZSwgbWV0YWRhdGEpIHtcclxuXHQgICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdMaW5lQ29tbWVudCcpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnZpc2l0Q29tbWVudChub2RlLCBtZXRhZGF0YSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdCbG9ja0NvbW1lbnQnKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy52aXNpdENvbW1lbnQobm9kZSwgbWV0YWRhdGEpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAodGhpcy5hdHRhY2gpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnZpc2l0Tm9kZShub2RlLCBtZXRhZGF0YSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH07XHJcblx0ICAgIHJldHVybiBDb21tZW50SGFuZGxlcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuQ29tbWVudEhhbmRsZXIgPSBDb21tZW50SGFuZGxlcjtcclxuXG5cbi8qKiovIH0sXG4vKiAyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcblx0ZXhwb3J0cy5TeW50YXggPSB7XHJcblx0ICAgIEFzc2lnbm1lbnRFeHByZXNzaW9uOiAnQXNzaWdubWVudEV4cHJlc3Npb24nLFxyXG5cdCAgICBBc3NpZ25tZW50UGF0dGVybjogJ0Fzc2lnbm1lbnRQYXR0ZXJuJyxcclxuXHQgICAgQXJyYXlFeHByZXNzaW9uOiAnQXJyYXlFeHByZXNzaW9uJyxcclxuXHQgICAgQXJyYXlQYXR0ZXJuOiAnQXJyYXlQYXR0ZXJuJyxcclxuXHQgICAgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb246ICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbicsXHJcblx0ICAgIEF3YWl0RXhwcmVzc2lvbjogJ0F3YWl0RXhwcmVzc2lvbicsXHJcblx0ICAgIEJsb2NrU3RhdGVtZW50OiAnQmxvY2tTdGF0ZW1lbnQnLFxyXG5cdCAgICBCaW5hcnlFeHByZXNzaW9uOiAnQmluYXJ5RXhwcmVzc2lvbicsXHJcblx0ICAgIEJyZWFrU3RhdGVtZW50OiAnQnJlYWtTdGF0ZW1lbnQnLFxyXG5cdCAgICBDYWxsRXhwcmVzc2lvbjogJ0NhbGxFeHByZXNzaW9uJyxcclxuXHQgICAgQ2F0Y2hDbGF1c2U6ICdDYXRjaENsYXVzZScsXHJcblx0ICAgIENsYXNzQm9keTogJ0NsYXNzQm9keScsXHJcblx0ICAgIENsYXNzRGVjbGFyYXRpb246ICdDbGFzc0RlY2xhcmF0aW9uJyxcclxuXHQgICAgQ2xhc3NFeHByZXNzaW9uOiAnQ2xhc3NFeHByZXNzaW9uJyxcclxuXHQgICAgQ29uZGl0aW9uYWxFeHByZXNzaW9uOiAnQ29uZGl0aW9uYWxFeHByZXNzaW9uJyxcclxuXHQgICAgQ29udGludWVTdGF0ZW1lbnQ6ICdDb250aW51ZVN0YXRlbWVudCcsXHJcblx0ICAgIERvV2hpbGVTdGF0ZW1lbnQ6ICdEb1doaWxlU3RhdGVtZW50JyxcclxuXHQgICAgRGVidWdnZXJTdGF0ZW1lbnQ6ICdEZWJ1Z2dlclN0YXRlbWVudCcsXHJcblx0ICAgIEVtcHR5U3RhdGVtZW50OiAnRW1wdHlTdGF0ZW1lbnQnLFxyXG5cdCAgICBFeHBvcnRBbGxEZWNsYXJhdGlvbjogJ0V4cG9ydEFsbERlY2xhcmF0aW9uJyxcclxuXHQgICAgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uOiAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJyxcclxuXHQgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbjogJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nLFxyXG5cdCAgICBFeHBvcnRTcGVjaWZpZXI6ICdFeHBvcnRTcGVjaWZpZXInLFxyXG5cdCAgICBFeHByZXNzaW9uU3RhdGVtZW50OiAnRXhwcmVzc2lvblN0YXRlbWVudCcsXHJcblx0ICAgIEZvclN0YXRlbWVudDogJ0ZvclN0YXRlbWVudCcsXHJcblx0ICAgIEZvck9mU3RhdGVtZW50OiAnRm9yT2ZTdGF0ZW1lbnQnLFxyXG5cdCAgICBGb3JJblN0YXRlbWVudDogJ0ZvckluU3RhdGVtZW50JyxcclxuXHQgICAgRnVuY3Rpb25EZWNsYXJhdGlvbjogJ0Z1bmN0aW9uRGVjbGFyYXRpb24nLFxyXG5cdCAgICBGdW5jdGlvbkV4cHJlc3Npb246ICdGdW5jdGlvbkV4cHJlc3Npb24nLFxyXG5cdCAgICBJZGVudGlmaWVyOiAnSWRlbnRpZmllcicsXHJcblx0ICAgIElmU3RhdGVtZW50OiAnSWZTdGF0ZW1lbnQnLFxyXG5cdCAgICBJbXBvcnREZWNsYXJhdGlvbjogJ0ltcG9ydERlY2xhcmF0aW9uJyxcclxuXHQgICAgSW1wb3J0RGVmYXVsdFNwZWNpZmllcjogJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInLFxyXG5cdCAgICBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXI6ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInLFxyXG5cdCAgICBJbXBvcnRTcGVjaWZpZXI6ICdJbXBvcnRTcGVjaWZpZXInLFxyXG5cdCAgICBMaXRlcmFsOiAnTGl0ZXJhbCcsXHJcblx0ICAgIExhYmVsZWRTdGF0ZW1lbnQ6ICdMYWJlbGVkU3RhdGVtZW50JyxcclxuXHQgICAgTG9naWNhbEV4cHJlc3Npb246ICdMb2dpY2FsRXhwcmVzc2lvbicsXHJcblx0ICAgIE1lbWJlckV4cHJlc3Npb246ICdNZW1iZXJFeHByZXNzaW9uJyxcclxuXHQgICAgTWV0YVByb3BlcnR5OiAnTWV0YVByb3BlcnR5JyxcclxuXHQgICAgTWV0aG9kRGVmaW5pdGlvbjogJ01ldGhvZERlZmluaXRpb24nLFxyXG5cdCAgICBOZXdFeHByZXNzaW9uOiAnTmV3RXhwcmVzc2lvbicsXHJcblx0ICAgIE9iamVjdEV4cHJlc3Npb246ICdPYmplY3RFeHByZXNzaW9uJyxcclxuXHQgICAgT2JqZWN0UGF0dGVybjogJ09iamVjdFBhdHRlcm4nLFxyXG5cdCAgICBQcm9ncmFtOiAnUHJvZ3JhbScsXHJcblx0ICAgIFByb3BlcnR5OiAnUHJvcGVydHknLFxyXG5cdCAgICBSZXN0RWxlbWVudDogJ1Jlc3RFbGVtZW50JyxcclxuXHQgICAgUmV0dXJuU3RhdGVtZW50OiAnUmV0dXJuU3RhdGVtZW50JyxcclxuXHQgICAgU2VxdWVuY2VFeHByZXNzaW9uOiAnU2VxdWVuY2VFeHByZXNzaW9uJyxcclxuXHQgICAgU3ByZWFkRWxlbWVudDogJ1NwcmVhZEVsZW1lbnQnLFxyXG5cdCAgICBTdXBlcjogJ1N1cGVyJyxcclxuXHQgICAgU3dpdGNoQ2FzZTogJ1N3aXRjaENhc2UnLFxyXG5cdCAgICBTd2l0Y2hTdGF0ZW1lbnQ6ICdTd2l0Y2hTdGF0ZW1lbnQnLFxyXG5cdCAgICBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb246ICdUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24nLFxyXG5cdCAgICBUZW1wbGF0ZUVsZW1lbnQ6ICdUZW1wbGF0ZUVsZW1lbnQnLFxyXG5cdCAgICBUZW1wbGF0ZUxpdGVyYWw6ICdUZW1wbGF0ZUxpdGVyYWwnLFxyXG5cdCAgICBUaGlzRXhwcmVzc2lvbjogJ1RoaXNFeHByZXNzaW9uJyxcclxuXHQgICAgVGhyb3dTdGF0ZW1lbnQ6ICdUaHJvd1N0YXRlbWVudCcsXHJcblx0ICAgIFRyeVN0YXRlbWVudDogJ1RyeVN0YXRlbWVudCcsXHJcblx0ICAgIFVuYXJ5RXhwcmVzc2lvbjogJ1VuYXJ5RXhwcmVzc2lvbicsXHJcblx0ICAgIFVwZGF0ZUV4cHJlc3Npb246ICdVcGRhdGVFeHByZXNzaW9uJyxcclxuXHQgICAgVmFyaWFibGVEZWNsYXJhdGlvbjogJ1ZhcmlhYmxlRGVjbGFyYXRpb24nLFxyXG5cdCAgICBWYXJpYWJsZURlY2xhcmF0b3I6ICdWYXJpYWJsZURlY2xhcmF0b3InLFxyXG5cdCAgICBXaGlsZVN0YXRlbWVudDogJ1doaWxlU3RhdGVtZW50JyxcclxuXHQgICAgV2l0aFN0YXRlbWVudDogJ1dpdGhTdGF0ZW1lbnQnLFxyXG5cdCAgICBZaWVsZEV4cHJlc3Npb246ICdZaWVsZEV4cHJlc3Npb24nXHJcblx0fTtcclxuXG5cbi8qKiovIH0sXG4vKiAzICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0dmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG5cdCAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG5cdCAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblx0ICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG5cdCAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuXHQgICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG5cdCAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG5cdCAgICB9O1xyXG5cdH0pKCk7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5cdHZhciBjaGFyYWN0ZXJfMSA9IF9fd2VicGFja19yZXF1aXJlX18oNCk7XHJcblx0dmFyIEpTWE5vZGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDUpO1xyXG5cdHZhciBqc3hfc3ludGF4XzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDYpO1xyXG5cdHZhciBOb2RlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KTtcclxuXHR2YXIgcGFyc2VyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgpO1xyXG5cdHZhciB0b2tlbl8xID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMyk7XHJcblx0dmFyIHhodG1sX2VudGl0aWVzXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDE0KTtcclxuXHR0b2tlbl8xLlRva2VuTmFtZVsxMDAgLyogSWRlbnRpZmllciAqL10gPSAnSlNYSWRlbnRpZmllcic7XHJcblx0dG9rZW5fMS5Ub2tlbk5hbWVbMTAxIC8qIFRleHQgKi9dID0gJ0pTWFRleHQnO1xyXG5cdC8vIEZ1bGx5IHF1YWxpZmllZCBlbGVtZW50IG5hbWUsIGUuZy4gPHN2ZzpwYXRoPiByZXR1cm5zIFwic3ZnOnBhdGhcIlxyXG5cdGZ1bmN0aW9uIGdldFF1YWxpZmllZEVsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XHJcblx0ICAgIHZhciBxdWFsaWZpZWROYW1lO1xyXG5cdCAgICBzd2l0Y2ggKGVsZW1lbnROYW1lLnR5cGUpIHtcclxuXHQgICAgICAgIGNhc2UganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hJZGVudGlmaWVyOlxyXG5cdCAgICAgICAgICAgIHZhciBpZCA9IGVsZW1lbnROYW1lO1xyXG5cdCAgICAgICAgICAgIHF1YWxpZmllZE5hbWUgPSBpZC5uYW1lO1xyXG5cdCAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgY2FzZSBqc3hfc3ludGF4XzEuSlNYU3ludGF4LkpTWE5hbWVzcGFjZWROYW1lOlxyXG5cdCAgICAgICAgICAgIHZhciBucyA9IGVsZW1lbnROYW1lO1xyXG5cdCAgICAgICAgICAgIHF1YWxpZmllZE5hbWUgPSBnZXRRdWFsaWZpZWRFbGVtZW50TmFtZShucy5uYW1lc3BhY2UpICsgJzonICtcclxuXHQgICAgICAgICAgICAgICAgZ2V0UXVhbGlmaWVkRWxlbWVudE5hbWUobnMubmFtZSk7XHJcblx0ICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICBjYXNlIGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYTWVtYmVyRXhwcmVzc2lvbjpcclxuXHQgICAgICAgICAgICB2YXIgZXhwciA9IGVsZW1lbnROYW1lO1xyXG5cdCAgICAgICAgICAgIHF1YWxpZmllZE5hbWUgPSBnZXRRdWFsaWZpZWRFbGVtZW50TmFtZShleHByLm9iamVjdCkgKyAnLicgK1xyXG5cdCAgICAgICAgICAgICAgICBnZXRRdWFsaWZpZWRFbGVtZW50TmFtZShleHByLnByb3BlcnR5KTtcclxuXHQgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcblx0ICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBxdWFsaWZpZWROYW1lO1xyXG5cdH1cclxuXHR2YXIgSlNYUGFyc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuXHQgICAgX19leHRlbmRzKEpTWFBhcnNlciwgX3N1cGVyKTtcclxuXHQgICAgZnVuY3Rpb24gSlNYUGFyc2VyKGNvZGUsIG9wdGlvbnMsIGRlbGVnYXRlKSB7XHJcblx0ICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgY29kZSwgb3B0aW9ucywgZGVsZWdhdGUpIHx8IHRoaXM7XHJcblx0ICAgIH1cclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZVByaW1hcnlFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goJzwnKSA/IHRoaXMucGFyc2VKU1hSb290KCkgOiBfc3VwZXIucHJvdG90eXBlLnBhcnNlUHJpbWFyeUV4cHJlc3Npb24uY2FsbCh0aGlzKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5zdGFydEpTWCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIC8vIFVud2luZCB0aGUgc2Nhbm5lciBiZWZvcmUgdGhlIGxvb2thaGVhZCB0b2tlbi5cclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lci5pbmRleCA9IHRoaXMuc3RhcnRNYXJrZXIuaW5kZXg7XHJcblx0ICAgICAgICB0aGlzLnNjYW5uZXIubGluZU51bWJlciA9IHRoaXMuc3RhcnRNYXJrZXIubGluZTtcclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lci5saW5lU3RhcnQgPSB0aGlzLnN0YXJ0TWFya2VyLmluZGV4IC0gdGhpcy5zdGFydE1hcmtlci5jb2x1bW47XHJcblx0ICAgIH07XHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUuZmluaXNoSlNYID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgLy8gUHJpbWUgdGhlIG5leHQgbG9va2FoZWFkLlxyXG5cdCAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5yZWVudGVySlNYID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdGhpcy5zdGFydEpTWCgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RKU1goJ30nKTtcclxuXHQgICAgICAgIC8vIFBvcCB0aGUgY2xvc2luZyAnfScgYWRkZWQgZnJvbSB0aGUgbG9va2FoZWFkLlxyXG5cdCAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRva2Vucykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9rZW5zLnBvcCgpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLmNyZWF0ZUpTWE5vZGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB0aGlzLmNvbGxlY3RDb21tZW50cygpO1xyXG5cdCAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICBpbmRleDogdGhpcy5zY2FubmVyLmluZGV4LFxyXG5cdCAgICAgICAgICAgIGxpbmU6IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGNvbHVtbjogdGhpcy5zY2FubmVyLmluZGV4IC0gdGhpcy5zY2FubmVyLmxpbmVTdGFydFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5jcmVhdGVKU1hDaGlsZE5vZGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgIGluZGV4OiB0aGlzLnNjYW5uZXIuaW5kZXgsXHJcblx0ICAgICAgICAgICAgbGluZTogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgY29sdW1uOiB0aGlzLnNjYW5uZXIuaW5kZXggLSB0aGlzLnNjYW5uZXIubGluZVN0YXJ0XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnNjYW5YSFRNTEVudGl0eSA9IGZ1bmN0aW9uIChxdW90ZSkge1xyXG5cdCAgICAgICAgdmFyIHJlc3VsdCA9ICcmJztcclxuXHQgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XHJcblx0ICAgICAgICB2YXIgdGVybWluYXRlZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdmFyIG51bWVyaWMgPSBmYWxzZTtcclxuXHQgICAgICAgIHZhciBoZXggPSBmYWxzZTtcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5zY2FubmVyLmVvZigpICYmIHZhbGlkICYmICF0ZXJtaW5hdGVkKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5zY2FubmVyLnNvdXJjZVt0aGlzLnNjYW5uZXIuaW5kZXhdO1xyXG5cdCAgICAgICAgICAgIGlmIChjaCA9PT0gcXVvdGUpIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRlcm1pbmF0ZWQgPSAoY2ggPT09ICc7Jyk7XHJcblx0ICAgICAgICAgICAgcmVzdWx0ICs9IGNoO1xyXG5cdCAgICAgICAgICAgICsrdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgICAgIGlmICghdGVybWluYXRlZCkge1xyXG5cdCAgICAgICAgICAgICAgICBzd2l0Y2ggKHJlc3VsdC5sZW5ndGgpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcuICcmIzEyMzsnXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpYyA9IChjaCA9PT0gJyMnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtZXJpYykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcuICcmI3g0MTsnXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhleCA9IChjaCA9PT0gJ3gnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBoZXggfHwgY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzRGVjaW1hbERpZ2l0KGNoLmNoYXJDb2RlQXQoMCkpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljID0gbnVtZXJpYyAmJiAhaGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiAhKG51bWVyaWMgJiYgIWNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdChjaC5jaGFyQ29kZUF0KDApKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWxpZCAmJiAhKGhleCAmJiAhY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzSGV4RGlnaXQoY2guY2hhckNvZGVBdCgwKSkpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHZhbGlkICYmIHRlcm1pbmF0ZWQgJiYgcmVzdWx0Lmxlbmd0aCA+IDIpIHtcclxuXHQgICAgICAgICAgICAvLyBlLmcuICcmI3g0MTsnIGJlY29tZXMganVzdCAnI3g0MSdcclxuXHQgICAgICAgICAgICB2YXIgc3RyID0gcmVzdWx0LnN1YnN0cigxLCByZXN1bHQubGVuZ3RoIC0gMik7XHJcblx0ICAgICAgICAgICAgaWYgKG51bWVyaWMgJiYgc3RyLmxlbmd0aCA+IDEpIHtcclxuXHQgICAgICAgICAgICAgICAgcmVzdWx0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzdHIuc3Vic3RyKDEpLCAxMCkpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChoZXggJiYgc3RyLmxlbmd0aCA+IDIpIHtcclxuXHQgICAgICAgICAgICAgICAgcmVzdWx0ID0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludCgnMCcgKyBzdHIuc3Vic3RyKDEpLCAxNikpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICghbnVtZXJpYyAmJiAhaGV4ICYmIHhodG1sX2VudGl0aWVzXzEuWEhUTUxFbnRpdGllc1tzdHJdKSB7XHJcblx0ICAgICAgICAgICAgICAgIHJlc3VsdCA9IHhodG1sX2VudGl0aWVzXzEuWEhUTUxFbnRpdGllc1tzdHJdO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiByZXN1bHQ7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIFNjYW4gdGhlIG5leHQgSlNYIHRva2VuLiBUaGlzIHJlcGxhY2VzIFNjYW5uZXIjbGV4IHdoZW4gaW4gSlNYIG1vZGUuXHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUubGV4SlNYID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGNwID0gdGhpcy5zY2FubmVyLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuc2Nhbm5lci5pbmRleCk7XHJcblx0ICAgICAgICAvLyA8ID4gLyA6ID0geyB9XHJcblx0ICAgICAgICBpZiAoY3AgPT09IDYwIHx8IGNwID09PSA2MiB8fCBjcCA9PT0gNDcgfHwgY3AgPT09IDU4IHx8IGNwID09PSA2MSB8fCBjcCA9PT0gMTIzIHx8IGNwID09PSAxMjUpIHtcclxuXHQgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnNjYW5uZXIuc291cmNlW3RoaXMuc2Nhbm5lci5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgICAgICB0eXBlOiA3IC8qIFB1bmN0dWF0b3IgKi8sXHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuXHQgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5zY2FubmVyLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICAgICAgc3RhcnQ6IHRoaXMuc2Nhbm5lci5pbmRleCAtIDEsXHJcblx0ICAgICAgICAgICAgICAgIGVuZDogdGhpcy5zY2FubmVyLmluZGV4XHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8vIFwiICdcclxuXHQgICAgICAgIGlmIChjcCA9PT0gMzQgfHwgY3AgPT09IDM5KSB7XHJcblx0ICAgICAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgICAgIHZhciBxdW90ZSA9IHRoaXMuc2Nhbm5lci5zb3VyY2VbdGhpcy5zY2FubmVyLmluZGV4KytdO1xyXG5cdCAgICAgICAgICAgIHZhciBzdHIgPSAnJztcclxuXHQgICAgICAgICAgICB3aGlsZSAoIXRoaXMuc2Nhbm5lci5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgY2ggPSB0aGlzLnNjYW5uZXIuc291cmNlW3RoaXMuc2Nhbm5lci5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoID09PSBxdW90ZSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICcmJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RyICs9IHRoaXMuc2NhblhIVE1MRW50aXR5KHF1b3RlKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgICAgICB0eXBlOiA4IC8qIFN0cmluZ0xpdGVyYWwgKi8sXHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBzdHIsXHJcblx0ICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgICAgICBsaW5lU3RhcnQ6IHRoaXMuc2Nhbm5lci5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcclxuXHQgICAgICAgICAgICAgICAgZW5kOiB0aGlzLnNjYW5uZXIuaW5kZXhcclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgLy8gLi4uIG9yIC5cclxuXHQgICAgICAgIGlmIChjcCA9PT0gNDYpIHtcclxuXHQgICAgICAgICAgICB2YXIgbjEgPSB0aGlzLnNjYW5uZXIuc291cmNlLmNoYXJDb2RlQXQodGhpcy5zY2FubmVyLmluZGV4ICsgMSk7XHJcblx0ICAgICAgICAgICAgdmFyIG4yID0gdGhpcy5zY2FubmVyLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuc2Nhbm5lci5pbmRleCArIDIpO1xyXG5cdCAgICAgICAgICAgIHZhciB2YWx1ZSA9IChuMSA9PT0gNDYgJiYgbjIgPT09IDQ2KSA/ICcuLi4nIDogJy4nO1xyXG5cdCAgICAgICAgICAgIHZhciBzdGFydCA9IHRoaXMuc2Nhbm5lci5pbmRleDtcclxuXHQgICAgICAgICAgICB0aGlzLnNjYW5uZXIuaW5kZXggKz0gdmFsdWUubGVuZ3RoO1xyXG5cdCAgICAgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgICAgIHR5cGU6IDcgLyogUHVuY3R1YXRvciAqLyxcclxuXHQgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG5cdCAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLnNjYW5uZXIubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICAgICAgbGluZVN0YXJ0OiB0aGlzLnNjYW5uZXIubGluZVN0YXJ0LFxyXG5cdCAgICAgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgICAgIGVuZDogdGhpcy5zY2FubmVyLmluZGV4XHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8vIGBcclxuXHQgICAgICAgIGlmIChjcCA9PT0gOTYpIHtcclxuXHQgICAgICAgICAgICAvLyBPbmx5IHBsYWNlaG9sZGVyLCBzaW5jZSBpdCB3aWxsIGJlIHJlc2Nhbm5lZCBhcyBhIHJlYWwgYXNzaWdubWVudCBleHByZXNzaW9uLlxyXG5cdCAgICAgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgICAgIHR5cGU6IDEwIC8qIFRlbXBsYXRlICovLFxyXG5cdCAgICAgICAgICAgICAgICB2YWx1ZTogJycsXHJcblx0ICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgICAgICBsaW5lU3RhcnQ6IHRoaXMuc2Nhbm5lci5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiB0aGlzLnNjYW5uZXIuaW5kZXgsXHJcblx0ICAgICAgICAgICAgICAgIGVuZDogdGhpcy5zY2FubmVyLmluZGV4XHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8vIElkZW50aWZlciBjYW4gbm90IGNvbnRhaW4gYmFja3NsYXNoIChjaGFyIGNvZGUgOTIpLlxyXG5cdCAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0lkZW50aWZpZXJTdGFydChjcCkgJiYgKGNwICE9PSA5MikpIHtcclxuXHQgICAgICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLnNjYW5uZXIuaW5kZXg7XHJcblx0ICAgICAgICAgICAgKyt0aGlzLnNjYW5uZXIuaW5kZXg7XHJcblx0ICAgICAgICAgICAgd2hpbGUgKCF0aGlzLnNjYW5uZXIuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5zY2FubmVyLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuc2Nhbm5lci5pbmRleCk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyUGFydChjaCkgJiYgKGNoICE9PSA5MikpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSA0NSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gSHlwaGVuIChjaGFyIGNvZGUgNDUpIGNhbiBiZSBwYXJ0IG9mIGFuIGlkZW50aWZpZXIuXHJcblx0ICAgICAgICAgICAgICAgICAgICArK3RoaXMuc2Nhbm5lci5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuc2Nhbm5lci5zb3VyY2Uuc2xpY2Uoc3RhcnQsIHRoaXMuc2Nhbm5lci5pbmRleCk7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICAgICAgdHlwZTogMTAwIC8qIElkZW50aWZpZXIgKi8sXHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlOiBpZCxcclxuXHQgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5zY2FubmVyLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG5cdCAgICAgICAgICAgICAgICBlbmQ6IHRoaXMuc2Nhbm5lci5pbmRleFxyXG5cdCAgICAgICAgICAgIH07XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5zY2FubmVyLmxleCgpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLm5leHRKU1hUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHRoaXMuY29sbGVjdENvbW1lbnRzKCk7XHJcblx0ICAgICAgICB0aGlzLnN0YXJ0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgdGhpcy5zdGFydE1hcmtlci5saW5lID0gdGhpcy5zY2FubmVyLmxpbmVOdW1iZXI7XHJcblx0ICAgICAgICB0aGlzLnN0YXJ0TWFya2VyLmNvbHVtbiA9IHRoaXMuc2Nhbm5lci5pbmRleCAtIHRoaXMuc2Nhbm5lci5saW5lU3RhcnQ7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxleEpTWCgpO1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHRoaXMubGFzdE1hcmtlci5jb2x1bW4gPSB0aGlzLnNjYW5uZXIuaW5kZXggLSB0aGlzLnNjYW5uZXIubGluZVN0YXJ0O1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRva2Vucykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9rZW5zLnB1c2godGhpcy5jb252ZXJ0VG9rZW4odG9rZW4pKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0b2tlbjtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5uZXh0SlNYVGV4dCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHRoaXMuc3RhcnRNYXJrZXIuaW5kZXggPSB0aGlzLnNjYW5uZXIuaW5kZXg7XHJcblx0ICAgICAgICB0aGlzLnN0YXJ0TWFya2VyLmxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHRoaXMuc3RhcnRNYXJrZXIuY29sdW1uID0gdGhpcy5zY2FubmVyLmluZGV4IC0gdGhpcy5zY2FubmVyLmxpbmVTdGFydDtcclxuXHQgICAgICAgIHZhciBzdGFydCA9IHRoaXMuc2Nhbm5lci5pbmRleDtcclxuXHQgICAgICAgIHZhciB0ZXh0ID0gJyc7XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMuc2Nhbm5lci5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc2Nhbm5lci5zb3VyY2VbdGhpcy5zY2FubmVyLmluZGV4XTtcclxuXHQgICAgICAgICAgICBpZiAoY2ggPT09ICd7JyB8fCBjaCA9PT0gJzwnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICArK3RoaXMuc2Nhbm5lci5pbmRleDtcclxuXHQgICAgICAgICAgICB0ZXh0ICs9IGNoO1xyXG5cdCAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuc2Nhbm5lci5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInICYmIHRoaXMuc2Nhbm5lci5zb3VyY2VbdGhpcy5zY2FubmVyLmluZGV4XSA9PT0gJ1xcbicpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2Nhbm5lci5saW5lU3RhcnQgPSB0aGlzLnNjYW5uZXIuaW5kZXg7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHRoaXMubGFzdE1hcmtlci5jb2x1bW4gPSB0aGlzLnNjYW5uZXIuaW5kZXggLSB0aGlzLnNjYW5uZXIubGluZVN0YXJ0O1xyXG5cdCAgICAgICAgdmFyIHRva2VuID0ge1xyXG5cdCAgICAgICAgICAgIHR5cGU6IDEwMSAvKiBUZXh0ICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiB0ZXh0LFxyXG5cdCAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5zY2FubmVyLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgZW5kOiB0aGlzLnNjYW5uZXIuaW5kZXhcclxuXHQgICAgICAgIH07XHJcblx0ICAgICAgICBpZiAoKHRleHQubGVuZ3RoID4gMCkgJiYgdGhpcy5jb25maWcudG9rZW5zKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh0aGlzLmNvbnZlcnRUb2tlbih0b2tlbikpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRva2VuO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBlZWtKU1hUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc2Nhbm5lci5zYXZlU3RhdGUoKTtcclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lci5zY2FuQ29tbWVudHMoKTtcclxuXHQgICAgICAgIHZhciBuZXh0ID0gdGhpcy5sZXhKU1goKTtcclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lci5yZXN0b3JlU3RhdGUoc3RhdGUpO1xyXG5cdCAgICAgICAgcmV0dXJuIG5leHQ7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIEV4cGVjdCB0aGUgbmV4dCBKU1ggdG9rZW4gdG8gbWF0Y2ggdGhlIHNwZWNpZmllZCBwdW5jdHVhdG9yLlxyXG5cdCAgICAvLyBJZiBub3QsIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5leHBlY3RKU1ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHQgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubmV4dEpTWFRva2VuKCk7XHJcblx0ICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gNyAvKiBQdW5jdHVhdG9yICovIHx8IHRva2VuLnZhbHVlICE9PSB2YWx1ZSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgbmV4dCBKU1ggdG9rZW4gbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIHB1bmN0dWF0b3IuXHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUubWF0Y2hKU1ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHQgICAgICAgIHZhciBuZXh0ID0gdGhpcy5wZWVrSlNYVG9rZW4oKTtcclxuXHQgICAgICAgIHJldHVybiBuZXh0LnR5cGUgPT09IDcgLyogUHVuY3R1YXRvciAqLyAmJiBuZXh0LnZhbHVlID09PSB2YWx1ZTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWElkZW50aWZpZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlSlNYTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIHRva2VuID0gdGhpcy5uZXh0SlNYVG9rZW4oKTtcclxuXHQgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSAxMDAgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IEpTWE5vZGUuSlNYSWRlbnRpZmllcih0b2tlbi52YWx1ZSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYRWxlbWVudE5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlSlNYTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGVsZW1lbnROYW1lID0gdGhpcy5wYXJzZUpTWElkZW50aWZpZXIoKTtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoSlNYKCc6JykpIHtcclxuXHQgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gZWxlbWVudE5hbWU7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3RKU1goJzonKTtcclxuXHQgICAgICAgICAgICB2YXIgbmFtZV8xID0gdGhpcy5wYXJzZUpTWElkZW50aWZpZXIoKTtcclxuXHQgICAgICAgICAgICBlbGVtZW50TmFtZSA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IEpTWE5vZGUuSlNYTmFtZXNwYWNlZE5hbWUobmFtZXNwYWNlLCBuYW1lXzEpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2hKU1goJy4nKSkge1xyXG5cdCAgICAgICAgICAgIHdoaWxlICh0aGlzLm1hdGNoSlNYKCcuJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGVsZW1lbnROYW1lO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdEpTWCgnLicpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnBhcnNlSlNYSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgICAgICBlbGVtZW50TmFtZSA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IEpTWE5vZGUuSlNYTWVtYmVyRXhwcmVzc2lvbihvYmplY3QsIHByb3BlcnR5KSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGVsZW1lbnROYW1lO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYQXR0cmlidXRlTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcclxuXHQgICAgICAgIHZhciBpZGVudGlmaWVyID0gdGhpcy5wYXJzZUpTWElkZW50aWZpZXIoKTtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoSlNYKCc6JykpIHtcclxuXHQgICAgICAgICAgICB2YXIgbmFtZXNwYWNlID0gaWRlbnRpZmllcjtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdEpTWCgnOicpO1xyXG5cdCAgICAgICAgICAgIHZhciBuYW1lXzIgPSB0aGlzLnBhcnNlSlNYSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBKU1hOb2RlLkpTWE5hbWVzcGFjZWROYW1lKG5hbWVzcGFjZSwgbmFtZV8yKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gaWRlbnRpZmllcjtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBhdHRyaWJ1dGVOYW1lO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYU3RyaW5nTGl0ZXJhbEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRKU1hUb2tlbigpO1xyXG5cdCAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IDggLyogU3RyaW5nTGl0ZXJhbCAqLykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIHJhdyA9IHRoaXMuZ2V0VG9rZW5SYXcodG9rZW4pO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuTGl0ZXJhbCh0b2tlbi52YWx1ZSwgcmF3KSk7XHJcblx0ICAgIH07XHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUucGFyc2VKU1hFeHByZXNzaW9uQXR0cmlidXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZUpTWE5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0SlNYKCd7Jyk7XHJcblx0ICAgICAgICB0aGlzLmZpbmlzaEpTWCgpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcignSlNYIGF0dHJpYnV0ZXMgbXVzdCBvbmx5IGJlIGFzc2lnbmVkIGEgbm9uLWVtcHR5IGV4cHJlc3Npb24nKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBleHByZXNzaW9uID0gdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICB0aGlzLnJlZW50ZXJKU1goKTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBKU1hOb2RlLkpTWEV4cHJlc3Npb25Db250YWluZXIoZXhwcmVzc2lvbikpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYQXR0cmlidXRlVmFsdWUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEpTWCgneycpID8gdGhpcy5wYXJzZUpTWEV4cHJlc3Npb25BdHRyaWJ1dGUoKSA6XHJcblx0ICAgICAgICAgICAgdGhpcy5tYXRjaEpTWCgnPCcpID8gdGhpcy5wYXJzZUpTWEVsZW1lbnQoKSA6IHRoaXMucGFyc2VKU1hTdHJpbmdMaXRlcmFsQXR0cmlidXRlKCk7XHJcblx0ICAgIH07XHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUucGFyc2VKU1hOYW1lVmFsdWVBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlSlNYTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIG5hbWUgPSB0aGlzLnBhcnNlSlNYQXR0cmlidXRlTmFtZSgpO1xyXG5cdCAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoSlNYKCc9JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdEpTWCgnPScpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZUpTWEF0dHJpYnV0ZVZhbHVlKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hBdHRyaWJ1dGUobmFtZSwgdmFsdWUpKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWFNwcmVhZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEpTWCgneycpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RKU1goJy4uLicpO1xyXG5cdCAgICAgICAgdGhpcy5maW5pc2hKU1goKTtcclxuXHQgICAgICAgIHZhciBhcmd1bWVudCA9IHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgdGhpcy5yZWVudGVySlNYKCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hTcHJlYWRBdHRyaWJ1dGUoYXJndW1lbnQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLm1hdGNoSlNYKCcvJykgJiYgIXRoaXMubWF0Y2hKU1goJz4nKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSB0aGlzLm1hdGNoSlNYKCd7JykgPyB0aGlzLnBhcnNlSlNYU3ByZWFkQXR0cmlidXRlKCkgOlxyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnBhcnNlSlNYTmFtZVZhbHVlQXR0cmlidXRlKCk7XHJcblx0ICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWE9wZW5pbmdFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZUpTWE5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0SlNYKCc8Jyk7XHJcblx0ICAgICAgICB2YXIgbmFtZSA9IHRoaXMucGFyc2VKU1hFbGVtZW50TmFtZSgpO1xyXG5cdCAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlSlNYQXR0cmlidXRlcygpO1xyXG5cdCAgICAgICAgdmFyIHNlbGZDbG9zaW5nID0gdGhpcy5tYXRjaEpTWCgnLycpO1xyXG5cdCAgICAgICAgaWYgKHNlbGZDbG9zaW5nKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3RKU1goJy8nKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0SlNYKCc+Jyk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hPcGVuaW5nRWxlbWVudChuYW1lLCBzZWxmQ2xvc2luZywgYXR0cmlidXRlcykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYQm91bmRhcnlFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZUpTWE5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0SlNYKCc8Jyk7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaEpTWCgnLycpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3RKU1goJy8nKTtcclxuXHQgICAgICAgICAgICB2YXIgbmFtZV8zID0gdGhpcy5wYXJzZUpTWEVsZW1lbnROYW1lKCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3RKU1goJz4nKTtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hDbG9zaW5nRWxlbWVudChuYW1lXzMpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBuYW1lID0gdGhpcy5wYXJzZUpTWEVsZW1lbnROYW1lKCk7XHJcblx0ICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHRoaXMucGFyc2VKU1hBdHRyaWJ1dGVzKCk7XHJcblx0ICAgICAgICB2YXIgc2VsZkNsb3NpbmcgPSB0aGlzLm1hdGNoSlNYKCcvJyk7XHJcblx0ICAgICAgICBpZiAoc2VsZkNsb3NpbmcpIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdEpTWCgnLycpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3RKU1goJz4nKTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBKU1hOb2RlLkpTWE9wZW5pbmdFbGVtZW50KG5hbWUsIHNlbGZDbG9zaW5nLCBhdHRyaWJ1dGVzKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIEpTWFBhcnNlci5wcm90b3R5cGUucGFyc2VKU1hFbXB0eUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlSlNYQ2hpbGROb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmNvbGxlY3RDb21tZW50cygpO1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHRoaXMubGFzdE1hcmtlci5jb2x1bW4gPSB0aGlzLnNjYW5uZXIuaW5kZXggLSB0aGlzLnNjYW5uZXIubGluZVN0YXJ0O1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IEpTWE5vZGUuSlNYRW1wdHlFeHByZXNzaW9uKCkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYRXhwcmVzc2lvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEpTWCgneycpO1xyXG5cdCAgICAgICAgdmFyIGV4cHJlc3Npb247XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaEpTWCgnfScpKSB7XHJcblx0ICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHRoaXMucGFyc2VKU1hFbXB0eUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdEpTWCgnfScpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5maW5pc2hKU1goKTtcclxuXHQgICAgICAgICAgICBleHByZXNzaW9uID0gdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5yZWVudGVySlNYKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hFeHByZXNzaW9uQ29udGFpbmVyKGV4cHJlc3Npb24pKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWENoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMuc2Nhbm5lci5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hDaGlsZE5vZGUoKTtcclxuXHQgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRKU1hUZXh0KCk7XHJcblx0ICAgICAgICAgICAgaWYgKHRva2VuLnN0YXJ0IDwgdG9rZW4uZW5kKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciByYXcgPSB0aGlzLmdldFRva2VuUmF3KHRva2VuKTtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hUZXh0KHRva2VuLnZhbHVlLCByYXcpKTtcclxuXHQgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuc291cmNlW3RoaXMuc2Nhbm5lci5pbmRleF0gPT09ICd7Jykge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5wYXJzZUpTWEV4cHJlc3Npb25Db250YWluZXIoKTtcclxuXHQgICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChjb250YWluZXIpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlQ29tcGxleEpTWEVsZW1lbnQgPSBmdW5jdGlvbiAoZWwpIHtcclxuXHQgICAgICAgIHZhciBzdGFjayA9IFtdO1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLnNjYW5uZXIuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICBlbC5jaGlsZHJlbiA9IGVsLmNoaWxkcmVuLmNvbmNhdCh0aGlzLnBhcnNlSlNYQ2hpbGRyZW4oKSk7XHJcblx0ICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZUpTWENoaWxkTm9kZSgpO1xyXG5cdCAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5wYXJzZUpTWEJvdW5kYXJ5RWxlbWVudCgpO1xyXG5cdCAgICAgICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09IGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYT3BlbmluZ0VsZW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIG9wZW5pbmcgPSBlbGVtZW50O1xyXG5cdCAgICAgICAgICAgICAgICBpZiAob3BlbmluZy5zZWxmQ2xvc2luZykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgSlNYTm9kZS5KU1hFbGVtZW50KG9wZW5pbmcsIFtdLCBudWxsKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbC5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goZWwpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZWwgPSB7IG5vZGU6IG5vZGUsIG9wZW5pbmc6IG9wZW5pbmcsIGNsb3Npbmc6IG51bGwsIGNoaWxkcmVuOiBbXSB9O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09IGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYQ2xvc2luZ0VsZW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgZWwuY2xvc2luZyA9IGVsZW1lbnQ7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBvcGVuXzEgPSBnZXRRdWFsaWZpZWRFbGVtZW50TmFtZShlbC5vcGVuaW5nLm5hbWUpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgY2xvc2VfMSA9IGdldFF1YWxpZmllZEVsZW1lbnROYW1lKGVsLmNsb3NpbmcubmFtZSk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChvcGVuXzEgIT09IGNsb3NlXzEpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcignRXhwZWN0ZWQgY29ycmVzcG9uZGluZyBKU1ggY2xvc2luZyB0YWcgZm9yICUwJywgb3Blbl8xKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBpZiAoc3RhY2subGVuZ3RoID4gMCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5maW5hbGl6ZShlbC5ub2RlLCBuZXcgSlNYTm9kZS5KU1hFbGVtZW50KGVsLm9wZW5pbmcsIGVsLmNoaWxkcmVuLCBlbC5jbG9zaW5nKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbCA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZWwuY2hpbGRyZW4ucHVzaChjaGlsZCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdGFjay5wb3AoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGVsO1xyXG5cdCAgICB9O1xyXG5cdCAgICBKU1hQYXJzZXIucHJvdG90eXBlLnBhcnNlSlNYRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVKU1hOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgb3BlbmluZyA9IHRoaXMucGFyc2VKU1hPcGVuaW5nRWxlbWVudCgpO1xyXG5cdCAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XHJcblx0ICAgICAgICB2YXIgY2xvc2luZyA9IG51bGw7XHJcblx0ICAgICAgICBpZiAoIW9wZW5pbmcuc2VsZkNsb3NpbmcpIHtcclxuXHQgICAgICAgICAgICB2YXIgZWwgPSB0aGlzLnBhcnNlQ29tcGxleEpTWEVsZW1lbnQoeyBub2RlOiBub2RlLCBvcGVuaW5nOiBvcGVuaW5nLCBjbG9zaW5nOiBjbG9zaW5nLCBjaGlsZHJlbjogY2hpbGRyZW4gfSk7XHJcblx0ICAgICAgICAgICAgY2hpbGRyZW4gPSBlbC5jaGlsZHJlbjtcclxuXHQgICAgICAgICAgICBjbG9zaW5nID0gZWwuY2xvc2luZztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBKU1hOb2RlLkpTWEVsZW1lbnQob3BlbmluZywgY2hpbGRyZW4sIGNsb3NpbmcpKTtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5wYXJzZUpTWFJvb3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICAvLyBQb3AgdGhlIG9wZW5pbmcgJzwnIGFkZGVkIGZyb20gdGhlIGxvb2thaGVhZC5cclxuXHQgICAgICAgIGlmICh0aGlzLmNvbmZpZy50b2tlbnMpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRva2Vucy5wb3AoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuc3RhcnRKU1goKTtcclxuXHQgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5wYXJzZUpTWEVsZW1lbnQoKTtcclxuXHQgICAgICAgIHRoaXMuZmluaXNoSlNYKCk7XHJcblx0ICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuXHQgICAgfTtcclxuXHQgICAgSlNYUGFyc2VyLnByb3RvdHlwZS5pc1N0YXJ0T2ZFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuaXNTdGFydE9mRXhwcmVzc2lvbi5jYWxsKHRoaXMpIHx8IHRoaXMubWF0Y2goJzwnKTtcclxuXHQgICAgfTtcclxuXHQgICAgcmV0dXJuIEpTWFBhcnNlcjtcclxuXHR9KHBhcnNlcl8xLlBhcnNlcikpO1xyXG5cdGV4cG9ydHMuSlNYUGFyc2VyID0gSlNYUGFyc2VyO1xyXG5cblxuLyoqKi8gfSxcbi8qIDQgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHQvLyBTZWUgYWxzbyB0b29scy9nZW5lcmF0ZS11bmljb2RlLXJlZ2V4LmpzLlxyXG5cdHZhciBSZWdleCA9IHtcclxuXHQgICAgLy8gVW5pY29kZSB2OC4wLjAgTm9uQXNjaWlJZGVudGlmaWVyU3RhcnQ6XHJcblx0ICAgIE5vbkFzY2lpSWRlbnRpZmllclN0YXJ0OiAvW1xceEFBXFx4QjVcXHhCQVxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHhGOC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzcwLVxcdTAzNzRcXHUwMzc2XFx1MDM3N1xcdTAzN0EtXFx1MDM3RFxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0OEEtXFx1MDUyRlxcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcxLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NlxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkVFLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDN0RcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTFEMDAtXFx1MURCRlxcdTFFMDAtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTgtXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTYwLVxcdTIxODhcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTMwMDUtXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzEtXFx1MzAzNVxcdTMwMzgtXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUItXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjlEXFx1QTZBMC1cXHVBNkVGXFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBN0FEXFx1QTdCMC1cXHVBN0I3XFx1QTdGNy1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGXFx1QTlFMC1cXHVBOUU0XFx1QTlFNi1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQi1cXHVBQUREXFx1QUFFMC1cXHVBQUVBXFx1QUFGMi1cXHVBQUY0XFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUIzMC1cXHVBQjVBXFx1QUI1Qy1cXHVBQjY1XFx1QUI3MC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkYyMS1cXHVGRjNBXFx1RkY0MS1cXHVGRjVBXFx1RkY2Ni1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REQ0MC1cXHVERDc0XFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjRBXFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXFx1REZEMS1cXHVERkQ1XXxcXHVEODAxW1xcdURDMDAtXFx1REM5RFxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XFx1REM4MC1cXHVEQ0IyXFx1RENDMC1cXHVEQ0YyXXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0EwLVxcdURDREZcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzAwLVxcdURDNkVcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjQwLVxcdURGNDNcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MFxcdURGOTMtXFx1REY5Rl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4MzVbXFx1REMwMC1cXHVEQzU0XFx1REM1Ni1cXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjlcXHVEQ0JCXFx1RENCRC1cXHVEQ0MzXFx1RENDNS1cXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQxRS1cXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENTItXFx1REVBNVxcdURFQTgtXFx1REVDMFxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVGQVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYzNFxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY2RVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REZBOFxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDQl18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXHJcblx0ICAgIC8vIFVuaWNvZGUgdjguMC4wIE5vbkFzY2lpSWRlbnRpZmllclBhcnQ6XHJcblx0ICAgIE5vbkFzY2lpSWRlbnRpZmllclBhcnQ6IC9bXFx4QUFcXHhCNVxceEI3XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDMwMC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4Ni1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0ODMtXFx1MDQ4N1xcdTA0OEEtXFx1MDUyRlxcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNTkxLVxcdTA1QkRcXHUwNUJGXFx1MDVDMVxcdTA1QzJcXHUwNUM0XFx1MDVDNVxcdTA1QzdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjEwLVxcdTA2MUFcXHUwNjIwLVxcdTA2NjlcXHUwNjZFLVxcdTA2RDNcXHUwNkQ1LVxcdTA2RENcXHUwNkRGLVxcdTA2RThcXHUwNkVBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMC1cXHUwNzRBXFx1MDc0RC1cXHUwN0IxXFx1MDdDMC1cXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgyRFxcdTA4NDAtXFx1MDg1QlxcdTA4QTAtXFx1MDhCNFxcdTA4RTMtXFx1MDk2M1xcdTA5NjYtXFx1MDk2RlxcdTA5NzEtXFx1MDk4M1xcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkMtXFx1MDlDNFxcdTA5QzdcXHUwOUM4XFx1MDlDQi1cXHUwOUNFXFx1MDlEN1xcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUzXFx1MDlFNi1cXHUwOUYxXFx1MEEwMS1cXHUwQTAzXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTNDXFx1MEEzRS1cXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNjYtXFx1MEE3NVxcdTBBODEtXFx1MEE4M1xcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCQy1cXHUwQUM1XFx1MEFDNy1cXHUwQUM5XFx1MEFDQi1cXHUwQUNEXFx1MEFEMFxcdTBBRTAtXFx1MEFFM1xcdTBBRTYtXFx1MEFFRlxcdTBBRjlcXHUwQjAxLVxcdTBCMDNcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzQy1cXHUwQjQ0XFx1MEI0N1xcdTBCNDhcXHUwQjRCLVxcdTBCNERcXHUwQjU2XFx1MEI1N1xcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYzXFx1MEI2Ni1cXHUwQjZGXFx1MEI3MVxcdTBCODJcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCQkUtXFx1MEJDMlxcdTBCQzYtXFx1MEJDOFxcdTBCQ0EtXFx1MEJDRFxcdTBCRDBcXHUwQkQ3XFx1MEJFNi1cXHUwQkVGXFx1MEMwMC1cXHUwQzAzXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRC1cXHUwQzQ0XFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzU4LVxcdTBDNUFcXHUwQzYwLVxcdTBDNjNcXHUwQzY2LVxcdTBDNkZcXHUwQzgxLVxcdTBDODNcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JDLVxcdTBDQzRcXHUwQ0M2LVxcdTBDQzhcXHUwQ0NBLVxcdTBDQ0RcXHUwQ0Q1XFx1MENENlxcdTBDREVcXHUwQ0UwLVxcdTBDRTNcXHUwQ0U2LVxcdTBDRUZcXHUwQ0YxXFx1MENGMlxcdTBEMDEtXFx1MEQwM1xcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0QtXFx1MEQ0NFxcdTBENDYtXFx1MEQ0OFxcdTBENEEtXFx1MEQ0RVxcdTBENTdcXHUwRDVGLVxcdTBENjNcXHUwRDY2LVxcdTBENkZcXHUwRDdBLVxcdTBEN0ZcXHUwRDgyXFx1MEQ4M1xcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRENBXFx1MERDRi1cXHUwREQ0XFx1MERENlxcdTBERDgtXFx1MERERlxcdTBERTYtXFx1MERFRlxcdTBERjJcXHUwREYzXFx1MEUwMS1cXHUwRTNBXFx1MEU0MC1cXHUwRTRFXFx1MEU1MC1cXHUwRTU5XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjlcXHUwRUJCLVxcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRUM2XFx1MEVDOC1cXHUwRUNEXFx1MEVEMC1cXHUwRUQ5XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGMThcXHUwRjE5XFx1MEYyMC1cXHUwRjI5XFx1MEYzNVxcdTBGMzdcXHUwRjM5XFx1MEYzRS1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY3MS1cXHUwRjg0XFx1MEY4Ni1cXHUwRjk3XFx1MEY5OS1cXHUwRkJDXFx1MEZDNlxcdTEwMDAtXFx1MTA0OVxcdTEwNTAtXFx1MTA5RFxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzVELVxcdTEzNUZcXHUxMzY5LVxcdTEzNzFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkVFLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTRcXHUxNzIwLVxcdTE3MzRcXHUxNzQwLVxcdTE3NTNcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzcyXFx1MTc3M1xcdTE3ODAtXFx1MTdEM1xcdTE3RDdcXHUxN0RDXFx1MTdERFxcdTE3RTAtXFx1MTdFOVxcdTE4MEItXFx1MTgwRFxcdTE4MTAtXFx1MTgxOVxcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5MjAtXFx1MTkyQlxcdTE5MzAtXFx1MTkzQlxcdTE5NDYtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTE5RDAtXFx1MTlEQVxcdTFBMDAtXFx1MUExQlxcdTFBMjAtXFx1MUE1RVxcdTFBNjAtXFx1MUE3Q1xcdTFBN0YtXFx1MUE4OVxcdTFBOTAtXFx1MUE5OVxcdTFBQTdcXHUxQUIwLVxcdTFBQkRcXHUxQjAwLVxcdTFCNEJcXHUxQjUwLVxcdTFCNTlcXHUxQjZCLVxcdTFCNzNcXHUxQjgwLVxcdTFCRjNcXHUxQzAwLVxcdTFDMzdcXHUxQzQwLVxcdTFDNDlcXHUxQzRELVxcdTFDN0RcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRjZcXHUxQ0Y4XFx1MUNGOVxcdTFEMDAtXFx1MURGNVxcdTFERkMtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDBDXFx1MjAwRFxcdTIwM0ZcXHUyMDQwXFx1MjA1NFxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjBEMC1cXHUyMERDXFx1MjBFMVxcdTIwRTUtXFx1MjBGMFxcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTgtXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTYwLVxcdTIxODhcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDdGLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyREUwLVxcdTJERkZcXHUzMDA1LVxcdTMwMDdcXHUzMDIxLVxcdTMwMkZcXHUzMDMxLVxcdTMwMzVcXHUzMDM4LVxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDk5LVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MkJcXHVBNjQwLVxcdUE2NkZcXHVBNjc0LVxcdUE2N0RcXHVBNjdGLVxcdUE2RjFcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3QURcXHVBN0IwLVxcdUE3QjdcXHVBN0Y3LVxcdUE4MjdcXHVBODQwLVxcdUE4NzNcXHVBODgwLVxcdUE4QzRcXHVBOEQwLVxcdUE4RDlcXHVBOEUwLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MDAtXFx1QTkyRFxcdUE5MzAtXFx1QTk1M1xcdUE5NjAtXFx1QTk3Q1xcdUE5ODAtXFx1QTlDMFxcdUE5Q0YtXFx1QTlEOVxcdUE5RTAtXFx1QTlGRVxcdUFBMDAtXFx1QUEzNlxcdUFBNDAtXFx1QUE0RFxcdUFBNTAtXFx1QUE1OVxcdUFBNjAtXFx1QUE3NlxcdUFBN0EtXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFRlxcdUFBRjItXFx1QUFGNlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2NVxcdUFCNzAtXFx1QUJFQVxcdUFCRUNcXHVBQkVEXFx1QUJGMC1cXHVBQkY5XFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkIxRC1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTAwLVxcdUZFMEZcXHVGRTIwLVxcdUZFMkZcXHVGRTMzXFx1RkUzNFxcdUZFNEQtXFx1RkU0RlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMTAtXFx1RkYxOVxcdUZGMjEtXFx1RkYzQVxcdUZGM0ZcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERDQwLVxcdURENzRcXHVEREZEXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REVFMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0QVxcdURGNTAtXFx1REY3QVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRlxcdURGRDEtXFx1REZENV18XFx1RDgwMVtcXHVEQzAwLVxcdURDOURcXHVEQ0EwLVxcdURDQTlcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTZcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XFx1REM4MC1cXHVEQ0IyXFx1RENDMC1cXHVEQ0YyXXxcXHVEODA0W1xcdURDMDAtXFx1REM0NlxcdURDNjYtXFx1REM2RlxcdURDN0YtXFx1RENCQVxcdURDRDAtXFx1RENFOFxcdURDRjAtXFx1RENGOVxcdUREMDAtXFx1REQzNFxcdUREMzYtXFx1REQzRlxcdURENTAtXFx1REQ3M1xcdURENzZcXHVERDgwLVxcdUREQzRcXHVERENBLVxcdUREQ0NcXHVEREQwLVxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTM3XFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVFQVxcdURFRjAtXFx1REVGOVxcdURGMDAtXFx1REYwM1xcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNDLVxcdURGNDRcXHVERjQ3XFx1REY0OFxcdURGNEItXFx1REY0RFxcdURGNTBcXHVERjU3XFx1REY1RC1cXHVERjYzXFx1REY2Ni1cXHVERjZDXFx1REY3MC1cXHVERjc0XXxcXHVEODA1W1xcdURDODAtXFx1RENDNVxcdURDQzdcXHVEQ0QwLVxcdURDRDlcXHVERDgwLVxcdUREQjVcXHVEREI4LVxcdUREQzBcXHVEREQ4LVxcdURERERcXHVERTAwLVxcdURFNDBcXHVERTQ0XFx1REU1MC1cXHVERTU5XFx1REU4MC1cXHVERUI3XFx1REVDMC1cXHVERUM5XFx1REYwMC1cXHVERjE5XFx1REYxRC1cXHVERjJCXFx1REYzMC1cXHVERjM5XXxcXHVEODA2W1xcdURDQTAtXFx1RENFOVxcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDMDAtXFx1REM2RVxcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFNjAtXFx1REU2OVxcdURFRDAtXFx1REVFRFxcdURFRjAtXFx1REVGNFxcdURGMDAtXFx1REYzNlxcdURGNDAtXFx1REY0M1xcdURGNTAtXFx1REY1OVxcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwLVxcdURGN0VcXHVERjhGLVxcdURGOUZdfFxcdUQ4MkNbXFx1REMwMFxcdURDMDFdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XFx1REM5RFxcdURDOUVdfFxcdUQ4MzRbXFx1REQ2NS1cXHVERDY5XFx1REQ2RC1cXHVERDcyXFx1REQ3Qi1cXHVERDgyXFx1REQ4NS1cXHVERDhCXFx1RERBQS1cXHVEREFEXFx1REU0Mi1cXHVERTQ0XXxcXHVEODM1W1xcdURDMDAtXFx1REM1NFxcdURDNTYtXFx1REM5Q1xcdURDOUVcXHVEQzlGXFx1RENBMlxcdURDQTVcXHVEQ0E2XFx1RENBOS1cXHVEQ0FDXFx1RENBRS1cXHVEQ0I5XFx1RENCQlxcdURDQkQtXFx1RENDM1xcdURDQzUtXFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMUUtXFx1REQzOVxcdUREM0ItXFx1REQzRVxcdURENDAtXFx1REQ0NFxcdURENDZcXHVERDRBLVxcdURENTBcXHVERDUyLVxcdURFQTVcXHVERUE4LVxcdURFQzBcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRkFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMzRcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNkVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGQThcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQ0JcXHVERkNFLVxcdURGRkZdfFxcdUQ4MzZbXFx1REUwMC1cXHVERTM2XFx1REUzQi1cXHVERTZDXFx1REU3NVxcdURFODRcXHVERTlCLVxcdURFOUZcXHVERUExLVxcdURFQUZdfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XFx1RENEMC1cXHVEQ0Q2XXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF18XFx1REI0MFtcXHVERDAwLVxcdURERUZdL1xyXG5cdH07XHJcblx0ZXhwb3J0cy5DaGFyYWN0ZXIgPSB7XHJcblx0ICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cclxuXHQgICAgZnJvbUNvZGVQb2ludDogZnVuY3Rpb24gKGNwKSB7XHJcblx0ICAgICAgICByZXR1cm4gKGNwIDwgMHgxMDAwMCkgPyBTdHJpbmcuZnJvbUNoYXJDb2RlKGNwKSA6XHJcblx0ICAgICAgICAgICAgU3RyaW5nLmZyb21DaGFyQ29kZSgweEQ4MDAgKyAoKGNwIC0gMHgxMDAwMCkgPj4gMTApKSArXHJcblx0ICAgICAgICAgICAgICAgIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhEQzAwICsgKChjcCAtIDB4MTAwMDApICYgMTAyMykpO1xyXG5cdCAgICB9LFxyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy13aGl0ZS1zcGFjZVxyXG5cdCAgICBpc1doaXRlU3BhY2U6IGZ1bmN0aW9uIChjcCkge1xyXG5cdCAgICAgICAgcmV0dXJuIChjcCA9PT0gMHgyMCkgfHwgKGNwID09PSAweDA5KSB8fCAoY3AgPT09IDB4MEIpIHx8IChjcCA9PT0gMHgwQykgfHwgKGNwID09PSAweEEwKSB8fFxyXG5cdCAgICAgICAgICAgIChjcCA+PSAweDE2ODAgJiYgWzB4MTY4MCwgMHgyMDAwLCAweDIwMDEsIDB4MjAwMiwgMHgyMDAzLCAweDIwMDQsIDB4MjAwNSwgMHgyMDA2LCAweDIwMDcsIDB4MjAwOCwgMHgyMDA5LCAweDIwMEEsIDB4MjAyRiwgMHgyMDVGLCAweDMwMDAsIDB4RkVGRl0uaW5kZXhPZihjcCkgPj0gMCk7XHJcblx0ICAgIH0sXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWxpbmUtdGVybWluYXRvcnNcclxuXHQgICAgaXNMaW5lVGVybWluYXRvcjogZnVuY3Rpb24gKGNwKSB7XHJcblx0ICAgICAgICByZXR1cm4gKGNwID09PSAweDBBKSB8fCAoY3AgPT09IDB4MEQpIHx8IChjcCA9PT0gMHgyMDI4KSB8fCAoY3AgPT09IDB4MjAyOSk7XHJcblx0ICAgIH0sXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW5hbWVzLWFuZC1rZXl3b3Jkc1xyXG5cdCAgICBpc0lkZW50aWZpZXJTdGFydDogZnVuY3Rpb24gKGNwKSB7XHJcblx0ICAgICAgICByZXR1cm4gKGNwID09PSAweDI0KSB8fCAoY3AgPT09IDB4NUYpIHx8XHJcblx0ICAgICAgICAgICAgKGNwID49IDB4NDEgJiYgY3AgPD0gMHg1QSkgfHxcclxuXHQgICAgICAgICAgICAoY3AgPj0gMHg2MSAmJiBjcCA8PSAweDdBKSB8fFxyXG5cdCAgICAgICAgICAgIChjcCA9PT0gMHg1QykgfHxcclxuXHQgICAgICAgICAgICAoKGNwID49IDB4ODApICYmIFJlZ2V4Lk5vbkFzY2lpSWRlbnRpZmllclN0YXJ0LnRlc3QoZXhwb3J0cy5DaGFyYWN0ZXIuZnJvbUNvZGVQb2ludChjcCkpKTtcclxuXHQgICAgfSxcclxuXHQgICAgaXNJZGVudGlmaWVyUGFydDogZnVuY3Rpb24gKGNwKSB7XHJcblx0ICAgICAgICByZXR1cm4gKGNwID09PSAweDI0KSB8fCAoY3AgPT09IDB4NUYpIHx8XHJcblx0ICAgICAgICAgICAgKGNwID49IDB4NDEgJiYgY3AgPD0gMHg1QSkgfHxcclxuXHQgICAgICAgICAgICAoY3AgPj0gMHg2MSAmJiBjcCA8PSAweDdBKSB8fFxyXG5cdCAgICAgICAgICAgIChjcCA+PSAweDMwICYmIGNwIDw9IDB4MzkpIHx8XHJcblx0ICAgICAgICAgICAgKGNwID09PSAweDVDKSB8fFxyXG5cdCAgICAgICAgICAgICgoY3AgPj0gMHg4MCkgJiYgUmVnZXguTm9uQXNjaWlJZGVudGlmaWVyUGFydC50ZXN0KGV4cG9ydHMuQ2hhcmFjdGVyLmZyb21Db2RlUG9pbnQoY3ApKSk7XHJcblx0ICAgIH0sXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWxpdGVyYWxzLW51bWVyaWMtbGl0ZXJhbHNcclxuXHQgICAgaXNEZWNpbWFsRGlnaXQ6IGZ1bmN0aW9uIChjcCkge1xyXG5cdCAgICAgICAgcmV0dXJuIChjcCA+PSAweDMwICYmIGNwIDw9IDB4MzkpOyAvLyAwLi45XHJcblx0ICAgIH0sXHJcblx0ICAgIGlzSGV4RGlnaXQ6IGZ1bmN0aW9uIChjcCkge1xyXG5cdCAgICAgICAgcmV0dXJuIChjcCA+PSAweDMwICYmIGNwIDw9IDB4MzkpIHx8XHJcblx0ICAgICAgICAgICAgKGNwID49IDB4NDEgJiYgY3AgPD0gMHg0NikgfHxcclxuXHQgICAgICAgICAgICAoY3AgPj0gMHg2MSAmJiBjcCA8PSAweDY2KTsgLy8gYS4uZlxyXG5cdCAgICB9LFxyXG5cdCAgICBpc09jdGFsRGlnaXQ6IGZ1bmN0aW9uIChjcCkge1xyXG5cdCAgICAgICAgcmV0dXJuIChjcCA+PSAweDMwICYmIGNwIDw9IDB4MzcpOyAvLyAwLi43XHJcblx0ICAgIH1cclxuXHR9O1xyXG5cblxuLyoqKi8gfSxcbi8qIDUgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHR2YXIganN4X3N5bnRheF8xID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KTtcclxuXHQvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG5cdHZhciBKU1hDbG9zaW5nRWxlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEpTWENsb3NpbmdFbGVtZW50KG5hbWUpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYQ2xvc2luZ0VsZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBKU1hDbG9zaW5nRWxlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYQ2xvc2luZ0VsZW1lbnQgPSBKU1hDbG9zaW5nRWxlbWVudDtcclxuXHR2YXIgSlNYRWxlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEpTWEVsZW1lbnQob3BlbmluZ0VsZW1lbnQsIGNoaWxkcmVuLCBjbG9zaW5nRWxlbWVudCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0ganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hFbGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5vcGVuaW5nRWxlbWVudCA9IG9wZW5pbmdFbGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG5cdCAgICAgICAgdGhpcy5jbG9zaW5nRWxlbWVudCA9IGNsb3NpbmdFbGVtZW50O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBKU1hFbGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5KU1hFbGVtZW50ID0gSlNYRWxlbWVudDtcclxuXHR2YXIgSlNYRW1wdHlFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSlNYRW1wdHlFeHByZXNzaW9uKCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0ganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hFbXB0eUV4cHJlc3Npb247XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEpTWEVtcHR5RXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYRW1wdHlFeHByZXNzaW9uID0gSlNYRW1wdHlFeHByZXNzaW9uO1xyXG5cdHZhciBKU1hFeHByZXNzaW9uQ29udGFpbmVyID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSlNYRXhwcmVzc2lvbkNvbnRhaW5lcihleHByZXNzaW9uKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBqc3hfc3ludGF4XzEuSlNYU3ludGF4LkpTWEV4cHJlc3Npb25Db250YWluZXI7XHJcblx0ICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBKU1hFeHByZXNzaW9uQ29udGFpbmVyO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5KU1hFeHByZXNzaW9uQ29udGFpbmVyID0gSlNYRXhwcmVzc2lvbkNvbnRhaW5lcjtcclxuXHR2YXIgSlNYSWRlbnRpZmllciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEpTWElkZW50aWZpZXIobmFtZSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0ganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hJZGVudGlmaWVyO1xyXG5cdCAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSlNYSWRlbnRpZmllcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYSWRlbnRpZmllciA9IEpTWElkZW50aWZpZXI7XHJcblx0dmFyIEpTWE1lbWJlckV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBKU1hNZW1iZXJFeHByZXNzaW9uKG9iamVjdCwgcHJvcGVydHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYTWVtYmVyRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG5cdCAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBKU1hNZW1iZXJFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5KU1hNZW1iZXJFeHByZXNzaW9uID0gSlNYTWVtYmVyRXhwcmVzc2lvbjtcclxuXHR2YXIgSlNYQXR0cmlidXRlID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSlNYQXR0cmlidXRlKG5hbWUsIHZhbHVlKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBqc3hfc3ludGF4XzEuSlNYU3ludGF4LkpTWEF0dHJpYnV0ZTtcclxuXHQgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcblx0ICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEpTWEF0dHJpYnV0ZTtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYQXR0cmlidXRlID0gSlNYQXR0cmlidXRlO1xyXG5cdHZhciBKU1hOYW1lc3BhY2VkTmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEpTWE5hbWVzcGFjZWROYW1lKG5hbWVzcGFjZSwgbmFtZSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0ganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hOYW1lc3BhY2VkTmFtZTtcclxuXHQgICAgICAgIHRoaXMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xyXG5cdCAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSlNYTmFtZXNwYWNlZE5hbWU7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkpTWE5hbWVzcGFjZWROYW1lID0gSlNYTmFtZXNwYWNlZE5hbWU7XHJcblx0dmFyIEpTWE9wZW5pbmdFbGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSlNYT3BlbmluZ0VsZW1lbnQobmFtZSwgc2VsZkNsb3NpbmcsIGF0dHJpYnV0ZXMpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IGpzeF9zeW50YXhfMS5KU1hTeW50YXguSlNYT3BlbmluZ0VsZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cdCAgICAgICAgdGhpcy5zZWxmQ2xvc2luZyA9IHNlbGZDbG9zaW5nO1xyXG5cdCAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSlNYT3BlbmluZ0VsZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkpTWE9wZW5pbmdFbGVtZW50ID0gSlNYT3BlbmluZ0VsZW1lbnQ7XHJcblx0dmFyIEpTWFNwcmVhZEF0dHJpYnV0ZSA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEpTWFNwcmVhZEF0dHJpYnV0ZShhcmd1bWVudCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0ganN4X3N5bnRheF8xLkpTWFN5bnRheC5KU1hTcHJlYWRBdHRyaWJ1dGU7XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEpTWFNwcmVhZEF0dHJpYnV0ZTtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYU3ByZWFkQXR0cmlidXRlID0gSlNYU3ByZWFkQXR0cmlidXRlO1xyXG5cdHZhciBKU1hUZXh0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSlNYVGV4dCh2YWx1ZSwgcmF3KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBqc3hfc3ludGF4XzEuSlNYU3ludGF4LkpTWFRleHQ7XHJcblx0ICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0ICAgICAgICB0aGlzLnJhdyA9IHJhdztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSlNYVGV4dDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSlNYVGV4dCA9IEpTWFRleHQ7XHJcblxuXG4vKioqLyB9LFxuLyogNiAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5cdGV4cG9ydHMuSlNYU3ludGF4ID0ge1xyXG5cdCAgICBKU1hBdHRyaWJ1dGU6ICdKU1hBdHRyaWJ1dGUnLFxyXG5cdCAgICBKU1hDbG9zaW5nRWxlbWVudDogJ0pTWENsb3NpbmdFbGVtZW50JyxcclxuXHQgICAgSlNYRWxlbWVudDogJ0pTWEVsZW1lbnQnLFxyXG5cdCAgICBKU1hFbXB0eUV4cHJlc3Npb246ICdKU1hFbXB0eUV4cHJlc3Npb24nLFxyXG5cdCAgICBKU1hFeHByZXNzaW9uQ29udGFpbmVyOiAnSlNYRXhwcmVzc2lvbkNvbnRhaW5lcicsXHJcblx0ICAgIEpTWElkZW50aWZpZXI6ICdKU1hJZGVudGlmaWVyJyxcclxuXHQgICAgSlNYTWVtYmVyRXhwcmVzc2lvbjogJ0pTWE1lbWJlckV4cHJlc3Npb24nLFxyXG5cdCAgICBKU1hOYW1lc3BhY2VkTmFtZTogJ0pTWE5hbWVzcGFjZWROYW1lJyxcclxuXHQgICAgSlNYT3BlbmluZ0VsZW1lbnQ6ICdKU1hPcGVuaW5nRWxlbWVudCcsXHJcblx0ICAgIEpTWFNwcmVhZEF0dHJpYnV0ZTogJ0pTWFNwcmVhZEF0dHJpYnV0ZScsXHJcblx0ICAgIEpTWFRleHQ6ICdKU1hUZXh0J1xyXG5cdH07XHJcblxuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5cdHZhciBzeW50YXhfMSA9IF9fd2VicGFja19yZXF1aXJlX18oMik7XHJcblx0LyogdHNsaW50OmRpc2FibGU6bWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cclxuXHR2YXIgQXJyYXlFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQXJyYXlFeHByZXNzaW9uKGVsZW1lbnRzKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguQXJyYXlFeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBBcnJheUV4cHJlc3Npb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkFycmF5RXhwcmVzc2lvbiA9IEFycmF5RXhwcmVzc2lvbjtcclxuXHR2YXIgQXJyYXlQYXR0ZXJuID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQXJyYXlQYXR0ZXJuKGVsZW1lbnRzKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguQXJyYXlQYXR0ZXJuO1xyXG5cdCAgICAgICAgdGhpcy5lbGVtZW50cyA9IGVsZW1lbnRzO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBBcnJheVBhdHRlcm47XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkFycmF5UGF0dGVybiA9IEFycmF5UGF0dGVybjtcclxuXHR2YXIgQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbihwYXJhbXMsIGJvZHksIGV4cHJlc3Npb24pIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMuaWQgPSBudWxsO1xyXG5cdCAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmFzeW5jID0gZmFsc2U7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEFycm93RnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiA9IEFycm93RnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdHZhciBBc3NpZ25tZW50RXhwcmVzc2lvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEFzc2lnbm1lbnRFeHByZXNzaW9uKG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkFzc2lnbm1lbnRFeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xyXG5cdCAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcclxuXHQgICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gQXNzaWdubWVudEV4cHJlc3Npb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkFzc2lnbm1lbnRFeHByZXNzaW9uID0gQXNzaWdubWVudEV4cHJlc3Npb247XHJcblx0dmFyIEFzc2lnbm1lbnRQYXR0ZXJuID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQXNzaWdubWVudFBhdHRlcm4obGVmdCwgcmlnaHQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Bc3NpZ25tZW50UGF0dGVybjtcclxuXHQgICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcblx0ICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEFzc2lnbm1lbnRQYXR0ZXJuO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5Bc3NpZ25tZW50UGF0dGVybiA9IEFzc2lnbm1lbnRQYXR0ZXJuO1xyXG5cdHZhciBBc3luY0Fycm93RnVuY3Rpb25FeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbihwYXJhbXMsIGJvZHksIGV4cHJlc3Npb24pIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMuaWQgPSBudWxsO1xyXG5cdCAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmFzeW5jID0gdHJ1ZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuQXN5bmNBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiA9IEFzeW5jQXJyb3dGdW5jdGlvbkV4cHJlc3Npb247XHJcblx0dmFyIEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbihpZCwgcGFyYW1zLCBib2R5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuaWQgPSBpZDtcclxuXHQgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdCAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuXHQgICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZmFsc2U7XHJcblx0ICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuYXN5bmMgPSB0cnVlO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBBc3luY0Z1bmN0aW9uRGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbiA9IEFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbjtcclxuXHR2YXIgQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uRXhwcmVzc2lvbihpZCwgcGFyYW1zLCBib2R5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG5cdCAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy5hc3luYyA9IHRydWU7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEFzeW5jRnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5Bc3luY0Z1bmN0aW9uRXhwcmVzc2lvbiA9IEFzeW5jRnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdHZhciBBd2FpdEV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBBd2FpdEV4cHJlc3Npb24oYXJndW1lbnQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Bd2FpdEV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEF3YWl0RXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuQXdhaXRFeHByZXNzaW9uID0gQXdhaXRFeHByZXNzaW9uO1xyXG5cdHZhciBCaW5hcnlFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQmluYXJ5RXhwcmVzc2lvbihvcGVyYXRvciwgbGVmdCwgcmlnaHQpIHtcclxuXHQgICAgICAgIHZhciBsb2dpY2FsID0gKG9wZXJhdG9yID09PSAnfHwnIHx8IG9wZXJhdG9yID09PSAnJiYnKTtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IGxvZ2ljYWwgPyBzeW50YXhfMS5TeW50YXguTG9naWNhbEV4cHJlc3Npb24gOiBzeW50YXhfMS5TeW50YXguQmluYXJ5RXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcclxuXHQgICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcblx0ICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEJpbmFyeUV4cHJlc3Npb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkJpbmFyeUV4cHJlc3Npb24gPSBCaW5hcnlFeHByZXNzaW9uO1xyXG5cdHZhciBCbG9ja1N0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEJsb2NrU3RhdGVtZW50KGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5CbG9ja1N0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEJsb2NrU3RhdGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5CbG9ja1N0YXRlbWVudCA9IEJsb2NrU3RhdGVtZW50O1xyXG5cdHZhciBCcmVha1N0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEJyZWFrU3RhdGVtZW50KGxhYmVsKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguQnJlYWtTdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEJyZWFrU3RhdGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5CcmVha1N0YXRlbWVudCA9IEJyZWFrU3RhdGVtZW50O1xyXG5cdHZhciBDYWxsRXhwcmVzc2lvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIENhbGxFeHByZXNzaW9uKGNhbGxlZSwgYXJncykge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkNhbGxFeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5jYWxsZWUgPSBjYWxsZWU7XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50cyA9IGFyZ3M7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIENhbGxFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5DYWxsRXhwcmVzc2lvbiA9IENhbGxFeHByZXNzaW9uO1xyXG5cdHZhciBDYXRjaENsYXVzZSA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIENhdGNoQ2xhdXNlKHBhcmFtLCBib2R5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguQ2F0Y2hDbGF1c2U7XHJcblx0ICAgICAgICB0aGlzLnBhcmFtID0gcGFyYW07XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBDYXRjaENsYXVzZTtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuQ2F0Y2hDbGF1c2UgPSBDYXRjaENsYXVzZTtcclxuXHR2YXIgQ2xhc3NCb2R5ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQ2xhc3NCb2R5KGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5DbGFzc0JvZHk7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBDbGFzc0JvZHk7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkNsYXNzQm9keSA9IENsYXNzQm9keTtcclxuXHR2YXIgQ2xhc3NEZWNsYXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIENsYXNzRGVjbGFyYXRpb24oaWQsIHN1cGVyQ2xhc3MsIGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5DbGFzc0RlY2xhcmF0aW9uO1xyXG5cdCAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG5cdCAgICAgICAgdGhpcy5zdXBlckNsYXNzID0gc3VwZXJDbGFzcztcclxuXHQgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIENsYXNzRGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkNsYXNzRGVjbGFyYXRpb24gPSBDbGFzc0RlY2xhcmF0aW9uO1xyXG5cdHZhciBDbGFzc0V4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBDbGFzc0V4cHJlc3Npb24oaWQsIHN1cGVyQ2xhc3MsIGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5DbGFzc0V4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmlkID0gaWQ7XHJcblx0ICAgICAgICB0aGlzLnN1cGVyQ2xhc3MgPSBzdXBlckNsYXNzO1xyXG5cdCAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gQ2xhc3NFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5DbGFzc0V4cHJlc3Npb24gPSBDbGFzc0V4cHJlc3Npb247XHJcblx0dmFyIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbihvYmplY3QsIHByb3BlcnR5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguTWVtYmVyRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMuY29tcHV0ZWQgPSB0cnVlO1xyXG5cdCAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XHJcblx0ICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uID0gQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uO1xyXG5cdHZhciBDb25kaXRpb25hbEV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBDb25kaXRpb25hbEV4cHJlc3Npb24odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguQ29uZGl0aW9uYWxFeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcclxuXHQgICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XHJcblx0ICAgICAgICB0aGlzLmFsdGVybmF0ZSA9IGFsdGVybmF0ZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gQ29uZGl0aW9uYWxFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5Db25kaXRpb25hbEV4cHJlc3Npb24gPSBDb25kaXRpb25hbEV4cHJlc3Npb247XHJcblx0dmFyIENvbnRpbnVlU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gQ29udGludWVTdGF0ZW1lbnQobGFiZWwpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Db250aW51ZVN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gQ29udGludWVTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkNvbnRpbnVlU3RhdGVtZW50ID0gQ29udGludWVTdGF0ZW1lbnQ7XHJcblx0dmFyIERlYnVnZ2VyU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gRGVidWdnZXJTdGF0ZW1lbnQoKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRGVidWdnZXJTdGF0ZW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIERlYnVnZ2VyU3RhdGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5EZWJ1Z2dlclN0YXRlbWVudCA9IERlYnVnZ2VyU3RhdGVtZW50O1xyXG5cdHZhciBEaXJlY3RpdmUgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBEaXJlY3RpdmUoZXhwcmVzc2lvbiwgZGlyZWN0aXZlKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRXhwcmVzc2lvblN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmRpcmVjdGl2ZSA9IGRpcmVjdGl2ZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gRGlyZWN0aXZlO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5EaXJlY3RpdmUgPSBEaXJlY3RpdmU7XHJcblx0dmFyIERvV2hpbGVTdGF0ZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBEb1doaWxlU3RhdGVtZW50KGJvZHksIHRlc3QpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Eb1doaWxlU3RhdGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuXHQgICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIERvV2hpbGVTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkRvV2hpbGVTdGF0ZW1lbnQgPSBEb1doaWxlU3RhdGVtZW50O1xyXG5cdHZhciBFbXB0eVN0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEVtcHR5U3RhdGVtZW50KCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkVtcHR5U3RhdGVtZW50O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBFbXB0eVN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuRW1wdHlTdGF0ZW1lbnQgPSBFbXB0eVN0YXRlbWVudDtcclxuXHR2YXIgRXhwb3J0QWxsRGVjbGFyYXRpb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBFeHBvcnRBbGxEZWNsYXJhdGlvbihzb3VyY2UpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5FeHBvcnRBbGxEZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBFeHBvcnRBbGxEZWNsYXJhdGlvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuRXhwb3J0QWxsRGVjbGFyYXRpb24gPSBFeHBvcnRBbGxEZWNsYXJhdGlvbjtcclxuXHR2YXIgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uO1xyXG5cdCAgICAgICAgdGhpcy5kZWNsYXJhdGlvbiA9IGRlY2xhcmF0aW9uO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbiA9IEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbjtcclxuXHR2YXIgRXhwb3J0TmFtZWREZWNsYXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24oZGVjbGFyYXRpb24sIHNwZWNpZmllcnMsIHNvdXJjZSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkV4cG9ydE5hbWVkRGVjbGFyYXRpb247XHJcblx0ICAgICAgICB0aGlzLmRlY2xhcmF0aW9uID0gZGVjbGFyYXRpb247XHJcblx0ICAgICAgICB0aGlzLnNwZWNpZmllcnMgPSBzcGVjaWZpZXJzO1xyXG5cdCAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEV4cG9ydE5hbWVkRGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkV4cG9ydE5hbWVkRGVjbGFyYXRpb24gPSBFeHBvcnROYW1lZERlY2xhcmF0aW9uO1xyXG5cdHZhciBFeHBvcnRTcGVjaWZpZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBFeHBvcnRTcGVjaWZpZXIobG9jYWwsIGV4cG9ydGVkKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRXhwb3J0U3BlY2lmaWVyO1xyXG5cdCAgICAgICAgdGhpcy5leHBvcnRlZCA9IGV4cG9ydGVkO1xyXG5cdCAgICAgICAgdGhpcy5sb2NhbCA9IGxvY2FsO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBFeHBvcnRTcGVjaWZpZXI7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkV4cG9ydFNwZWNpZmllciA9IEV4cG9ydFNwZWNpZmllcjtcclxuXHR2YXIgRXhwcmVzc2lvblN0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcmVzc2lvbikge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkV4cHJlc3Npb25TdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBFeHByZXNzaW9uU3RhdGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5FeHByZXNzaW9uU3RhdGVtZW50ID0gRXhwcmVzc2lvblN0YXRlbWVudDtcclxuXHR2YXIgRm9ySW5TdGF0ZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBGb3JJblN0YXRlbWVudChsZWZ0LCByaWdodCwgYm9keSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkZvckluU3RhdGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5sZWZ0ID0gbGVmdDtcclxuXHQgICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcclxuXHQgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XHJcblx0ICAgICAgICB0aGlzLmVhY2ggPSBmYWxzZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gRm9ySW5TdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkZvckluU3RhdGVtZW50ID0gRm9ySW5TdGF0ZW1lbnQ7XHJcblx0dmFyIEZvck9mU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gRm9yT2ZTdGF0ZW1lbnQobGVmdCwgcmlnaHQsIGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Gb3JPZlN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XHJcblx0ICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBGb3JPZlN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuRm9yT2ZTdGF0ZW1lbnQgPSBGb3JPZlN0YXRlbWVudDtcclxuXHR2YXIgRm9yU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gRm9yU3RhdGVtZW50KGluaXQsIHRlc3QsIHVwZGF0ZSwgYm9keSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkZvclN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMuaW5pdCA9IGluaXQ7XHJcblx0ICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xyXG5cdCAgICAgICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBGb3JTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkZvclN0YXRlbWVudCA9IEZvclN0YXRlbWVudDtcclxuXHR2YXIgRnVuY3Rpb25EZWNsYXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEZ1bmN0aW9uRGVjbGFyYXRpb24oaWQsIHBhcmFtcywgYm9keSwgZ2VuZXJhdG9yKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRnVuY3Rpb25EZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuaWQgPSBpZDtcclxuXHQgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG5cdCAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuXHQgICAgICAgIHRoaXMuZ2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xyXG5cdCAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZmFsc2U7XHJcblx0ICAgICAgICB0aGlzLmFzeW5jID0gZmFsc2U7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEZ1bmN0aW9uRGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkZ1bmN0aW9uRGVjbGFyYXRpb24gPSBGdW5jdGlvbkRlY2xhcmF0aW9uO1xyXG5cdHZhciBGdW5jdGlvbkV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBGdW5jdGlvbkV4cHJlc3Npb24oaWQsIHBhcmFtcywgYm9keSwgZ2VuZXJhdG9yKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguRnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG5cdCAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XHJcblx0ICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuYXN5bmMgPSBmYWxzZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gRnVuY3Rpb25FeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5GdW5jdGlvbkV4cHJlc3Npb24gPSBGdW5jdGlvbkV4cHJlc3Npb247XHJcblx0dmFyIElkZW50aWZpZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBJZGVudGlmaWVyKG5hbWUpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyO1xyXG5cdCAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSWRlbnRpZmllcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSWRlbnRpZmllciA9IElkZW50aWZpZXI7XHJcblx0dmFyIElmU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gSWZTdGF0ZW1lbnQodGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguSWZTdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLnRlc3QgPSB0ZXN0O1xyXG5cdCAgICAgICAgdGhpcy5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcclxuXHQgICAgICAgIHRoaXMuYWx0ZXJuYXRlID0gYWx0ZXJuYXRlO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBJZlN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSWZTdGF0ZW1lbnQgPSBJZlN0YXRlbWVudDtcclxuXHR2YXIgSW1wb3J0RGVjbGFyYXRpb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBJbXBvcnREZWNsYXJhdGlvbihzcGVjaWZpZXJzLCBzb3VyY2UpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5JbXBvcnREZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuc3BlY2lmaWVycyA9IHNwZWNpZmllcnM7XHJcblx0ICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSW1wb3J0RGVjbGFyYXRpb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLkltcG9ydERlY2xhcmF0aW9uID0gSW1wb3J0RGVjbGFyYXRpb247XHJcblx0dmFyIEltcG9ydERlZmF1bHRTcGVjaWZpZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBJbXBvcnREZWZhdWx0U3BlY2lmaWVyKGxvY2FsKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguSW1wb3J0RGVmYXVsdFNwZWNpZmllcjtcclxuXHQgICAgICAgIHRoaXMubG9jYWwgPSBsb2NhbDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSW1wb3J0RGVmYXVsdFNwZWNpZmllcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSW1wb3J0RGVmYXVsdFNwZWNpZmllciA9IEltcG9ydERlZmF1bHRTcGVjaWZpZXI7XHJcblx0dmFyIEltcG9ydE5hbWVzcGFjZVNwZWNpZmllciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEltcG9ydE5hbWVzcGFjZVNwZWNpZmllcihsb2NhbCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkltcG9ydE5hbWVzcGFjZVNwZWNpZmllcjtcclxuXHQgICAgICAgIHRoaXMubG9jYWwgPSBsb2NhbDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5JbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIgPSBJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXI7XHJcblx0dmFyIEltcG9ydFNwZWNpZmllciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIEltcG9ydFNwZWNpZmllcihsb2NhbCwgaW1wb3J0ZWQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5JbXBvcnRTcGVjaWZpZXI7XHJcblx0ICAgICAgICB0aGlzLmxvY2FsID0gbG9jYWw7XHJcblx0ICAgICAgICB0aGlzLmltcG9ydGVkID0gaW1wb3J0ZWQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIEltcG9ydFNwZWNpZmllcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuSW1wb3J0U3BlY2lmaWVyID0gSW1wb3J0U3BlY2lmaWVyO1xyXG5cdHZhciBMYWJlbGVkU3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gTGFiZWxlZFN0YXRlbWVudChsYWJlbCwgYm9keSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkxhYmVsZWRTdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmxhYmVsID0gbGFiZWw7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBMYWJlbGVkU3RhdGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5MYWJlbGVkU3RhdGVtZW50ID0gTGFiZWxlZFN0YXRlbWVudDtcclxuXHR2YXIgTGl0ZXJhbCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIExpdGVyYWwodmFsdWUsIHJhdykge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LkxpdGVyYWw7XHJcblx0ICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0ICAgICAgICB0aGlzLnJhdyA9IHJhdztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gTGl0ZXJhbDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuTGl0ZXJhbCA9IExpdGVyYWw7XHJcblx0dmFyIE1ldGFQcm9wZXJ0eSA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIE1ldGFQcm9wZXJ0eShtZXRhLCBwcm9wZXJ0eSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4Lk1ldGFQcm9wZXJ0eTtcclxuXHQgICAgICAgIHRoaXMubWV0YSA9IG1ldGE7XHJcblx0ICAgICAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIE1ldGFQcm9wZXJ0eTtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuTWV0YVByb3BlcnR5ID0gTWV0YVByb3BlcnR5O1xyXG5cdHZhciBNZXRob2REZWZpbml0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gTWV0aG9kRGVmaW5pdGlvbihrZXksIGNvbXB1dGVkLCB2YWx1ZSwga2luZCwgaXNTdGF0aWMpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5NZXRob2REZWZpbml0aW9uO1xyXG5cdCAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcblx0ICAgICAgICB0aGlzLmNvbXB1dGVkID0gY29tcHV0ZWQ7XHJcblx0ICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0ICAgICAgICB0aGlzLmtpbmQgPSBraW5kO1xyXG5cdCAgICAgICAgdGhpcy5zdGF0aWMgPSBpc1N0YXRpYztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gTWV0aG9kRGVmaW5pdGlvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuTWV0aG9kRGVmaW5pdGlvbiA9IE1ldGhvZERlZmluaXRpb247XHJcblx0dmFyIE1vZHVsZSA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIE1vZHVsZShib2R5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguUHJvZ3JhbTtcclxuXHQgICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XHJcblx0ICAgICAgICB0aGlzLnNvdXJjZVR5cGUgPSAnbW9kdWxlJztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gTW9kdWxlO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5Nb2R1bGUgPSBNb2R1bGU7XHJcblx0dmFyIE5ld0V4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBOZXdFeHByZXNzaW9uKGNhbGxlZSwgYXJncykge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4Lk5ld0V4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmNhbGxlZSA9IGNhbGxlZTtcclxuXHQgICAgICAgIHRoaXMuYXJndW1lbnRzID0gYXJncztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gTmV3RXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuTmV3RXhwcmVzc2lvbiA9IE5ld0V4cHJlc3Npb247XHJcblx0dmFyIE9iamVjdEV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBPYmplY3RFeHByZXNzaW9uKHByb3BlcnRpZXMpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5PYmplY3RFeHByZXNzaW9uO1xyXG5cdCAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gT2JqZWN0RXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuT2JqZWN0RXhwcmVzc2lvbiA9IE9iamVjdEV4cHJlc3Npb247XHJcblx0dmFyIE9iamVjdFBhdHRlcm4gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBPYmplY3RQYXR0ZXJuKHByb3BlcnRpZXMpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5PYmplY3RQYXR0ZXJuO1xyXG5cdCAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gT2JqZWN0UGF0dGVybjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuT2JqZWN0UGF0dGVybiA9IE9iamVjdFBhdHRlcm47XHJcblx0dmFyIFByb3BlcnR5ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gUHJvcGVydHkoa2luZCwga2V5LCBjb21wdXRlZCwgdmFsdWUsIG1ldGhvZCwgc2hvcnRoYW5kKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguUHJvcGVydHk7XHJcblx0ICAgICAgICB0aGlzLmtleSA9IGtleTtcclxuXHQgICAgICAgIHRoaXMuY29tcHV0ZWQgPSBjb21wdXRlZDtcclxuXHQgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHQgICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XHJcblx0ICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcclxuXHQgICAgICAgIHRoaXMuc2hvcnRoYW5kID0gc2hvcnRoYW5kO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBQcm9wZXJ0eTtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuUHJvcGVydHkgPSBQcm9wZXJ0eTtcclxuXHR2YXIgUmVnZXhMaXRlcmFsID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gUmVnZXhMaXRlcmFsKHZhbHVlLCByYXcsIHBhdHRlcm4sIGZsYWdzKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguTGl0ZXJhbDtcclxuXHQgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHQgICAgICAgIHRoaXMucmF3ID0gcmF3O1xyXG5cdCAgICAgICAgdGhpcy5yZWdleCA9IHsgcGF0dGVybjogcGF0dGVybiwgZmxhZ3M6IGZsYWdzIH07XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFJlZ2V4TGl0ZXJhbDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuUmVnZXhMaXRlcmFsID0gUmVnZXhMaXRlcmFsO1xyXG5cdHZhciBSZXN0RWxlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFJlc3RFbGVtZW50KGFyZ3VtZW50KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguUmVzdEVsZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFJlc3RFbGVtZW50O1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5SZXN0RWxlbWVudCA9IFJlc3RFbGVtZW50O1xyXG5cdHZhciBSZXR1cm5TdGF0ZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBSZXR1cm5TdGF0ZW1lbnQoYXJndW1lbnQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5SZXR1cm5TdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFJldHVyblN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuUmV0dXJuU3RhdGVtZW50ID0gUmV0dXJuU3RhdGVtZW50O1xyXG5cdHZhciBTY3JpcHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBTY3JpcHQoYm9keSkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlByb2dyYW07XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICAgICAgdGhpcy5zb3VyY2VUeXBlID0gJ3NjcmlwdCc7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFNjcmlwdDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuU2NyaXB0ID0gU2NyaXB0O1xyXG5cdHZhciBTZXF1ZW5jZUV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBTZXF1ZW5jZUV4cHJlc3Npb24oZXhwcmVzc2lvbnMpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5TZXF1ZW5jZUV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmV4cHJlc3Npb25zID0gZXhwcmVzc2lvbnM7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFNlcXVlbmNlRXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuU2VxdWVuY2VFeHByZXNzaW9uID0gU2VxdWVuY2VFeHByZXNzaW9uO1xyXG5cdHZhciBTcHJlYWRFbGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gU3ByZWFkRWxlbWVudChhcmd1bWVudCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlNwcmVhZEVsZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFNwcmVhZEVsZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlNwcmVhZEVsZW1lbnQgPSBTcHJlYWRFbGVtZW50O1xyXG5cdHZhciBTdGF0aWNNZW1iZXJFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gU3RhdGljTWVtYmVyRXhwcmVzc2lvbihvYmplY3QsIHByb3BlcnR5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguTWVtYmVyRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMuY29tcHV0ZWQgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG5cdCAgICAgICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBTdGF0aWNNZW1iZXJFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5TdGF0aWNNZW1iZXJFeHByZXNzaW9uID0gU3RhdGljTWVtYmVyRXhwcmVzc2lvbjtcclxuXHR2YXIgU3VwZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBTdXBlcigpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5TdXBlcjtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gU3VwZXI7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlN1cGVyID0gU3VwZXI7XHJcblx0dmFyIFN3aXRjaENhc2UgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBTd2l0Y2hDYXNlKHRlc3QsIGNvbnNlcXVlbnQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Td2l0Y2hDYXNlO1xyXG5cdCAgICAgICAgdGhpcy50ZXN0ID0gdGVzdDtcclxuXHQgICAgICAgIHRoaXMuY29uc2VxdWVudCA9IGNvbnNlcXVlbnQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFN3aXRjaENhc2U7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlN3aXRjaENhc2UgPSBTd2l0Y2hDYXNlO1xyXG5cdHZhciBTd2l0Y2hTdGF0ZW1lbnQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBTd2l0Y2hTdGF0ZW1lbnQoZGlzY3JpbWluYW50LCBjYXNlcykge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlN3aXRjaFN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMuZGlzY3JpbWluYW50ID0gZGlzY3JpbWluYW50O1xyXG5cdCAgICAgICAgdGhpcy5jYXNlcyA9IGNhc2VzO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBTd2l0Y2hTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlN3aXRjaFN0YXRlbWVudCA9IFN3aXRjaFN0YXRlbWVudDtcclxuXHR2YXIgVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKHRhZywgcXVhc2kpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5UYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLnRhZyA9IHRhZztcclxuXHQgICAgICAgIHRoaXMucXVhc2kgPSBxdWFzaTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5UYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24gPSBUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb247XHJcblx0dmFyIFRlbXBsYXRlRWxlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFRlbXBsYXRlRWxlbWVudCh2YWx1ZSwgdGFpbCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlRlbXBsYXRlRWxlbWVudDtcclxuXHQgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHQgICAgICAgIHRoaXMudGFpbCA9IHRhaWw7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFRlbXBsYXRlRWxlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuVGVtcGxhdGVFbGVtZW50ID0gVGVtcGxhdGVFbGVtZW50O1xyXG5cdHZhciBUZW1wbGF0ZUxpdGVyYWwgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBUZW1wbGF0ZUxpdGVyYWwocXVhc2lzLCBleHByZXNzaW9ucykge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlRlbXBsYXRlTGl0ZXJhbDtcclxuXHQgICAgICAgIHRoaXMucXVhc2lzID0gcXVhc2lzO1xyXG5cdCAgICAgICAgdGhpcy5leHByZXNzaW9ucyA9IGV4cHJlc3Npb25zO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBUZW1wbGF0ZUxpdGVyYWw7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlRlbXBsYXRlTGl0ZXJhbCA9IFRlbXBsYXRlTGl0ZXJhbDtcclxuXHR2YXIgVGhpc0V4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBUaGlzRXhwcmVzc2lvbigpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5UaGlzRXhwcmVzc2lvbjtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gVGhpc0V4cHJlc3Npb247XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlRoaXNFeHByZXNzaW9uID0gVGhpc0V4cHJlc3Npb247XHJcblx0dmFyIFRocm93U3RhdGVtZW50ID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gVGhyb3dTdGF0ZW1lbnQoYXJndW1lbnQpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5UaHJvd1N0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gVGhyb3dTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlRocm93U3RhdGVtZW50ID0gVGhyb3dTdGF0ZW1lbnQ7XHJcblx0dmFyIFRyeVN0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFRyeVN0YXRlbWVudChibG9jaywgaGFuZGxlciwgZmluYWxpemVyKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguVHJ5U3RhdGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5ibG9jayA9IGJsb2NrO1xyXG5cdCAgICAgICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcclxuXHQgICAgICAgIHRoaXMuZmluYWxpemVyID0gZmluYWxpemVyO1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBUcnlTdGF0ZW1lbnQ7XHJcblx0fSgpKTtcclxuXHRleHBvcnRzLlRyeVN0YXRlbWVudCA9IFRyeVN0YXRlbWVudDtcclxuXHR2YXIgVW5hcnlFeHByZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gVW5hcnlFeHByZXNzaW9uKG9wZXJhdG9yLCBhcmd1bWVudCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlVuYXJ5RXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcclxuXHQgICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcclxuXHQgICAgICAgIHRoaXMucHJlZml4ID0gdHJ1ZTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gVW5hcnlFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5VbmFyeUV4cHJlc3Npb24gPSBVbmFyeUV4cHJlc3Npb247XHJcblx0dmFyIFVwZGF0ZUV4cHJlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBVcGRhdGVFeHByZXNzaW9uKG9wZXJhdG9yLCBhcmd1bWVudCwgcHJlZml4KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguVXBkYXRlRXhwcmVzc2lvbjtcclxuXHQgICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcclxuXHQgICAgICAgIHRoaXMuYXJndW1lbnQgPSBhcmd1bWVudDtcclxuXHQgICAgICAgIHRoaXMucHJlZml4ID0gcHJlZml4O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBVcGRhdGVFeHByZXNzaW9uO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5VcGRhdGVFeHByZXNzaW9uID0gVXBkYXRlRXhwcmVzc2lvbjtcclxuXHR2YXIgVmFyaWFibGVEZWNsYXJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFZhcmlhYmxlRGVjbGFyYXRpb24oZGVjbGFyYXRpb25zLCBraW5kKSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguVmFyaWFibGVEZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuZGVjbGFyYXRpb25zID0gZGVjbGFyYXRpb25zO1xyXG5cdCAgICAgICAgdGhpcy5raW5kID0ga2luZDtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gVmFyaWFibGVEZWNsYXJhdGlvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuVmFyaWFibGVEZWNsYXJhdGlvbiA9IFZhcmlhYmxlRGVjbGFyYXRpb247XHJcblx0dmFyIFZhcmlhYmxlRGVjbGFyYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFZhcmlhYmxlRGVjbGFyYXRvcihpZCwgaW5pdCkge1xyXG5cdCAgICAgICAgdGhpcy50eXBlID0gc3ludGF4XzEuU3ludGF4LlZhcmlhYmxlRGVjbGFyYXRvcjtcclxuXHQgICAgICAgIHRoaXMuaWQgPSBpZDtcclxuXHQgICAgICAgIHRoaXMuaW5pdCA9IGluaXQ7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFZhcmlhYmxlRGVjbGFyYXRvcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuVmFyaWFibGVEZWNsYXJhdG9yID0gVmFyaWFibGVEZWNsYXJhdG9yO1xyXG5cdHZhciBXaGlsZVN0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFdoaWxlU3RhdGVtZW50KHRlc3QsIGJvZHkpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5XaGlsZVN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMudGVzdCA9IHRlc3Q7XHJcblx0ICAgICAgICB0aGlzLmJvZHkgPSBib2R5O1xyXG5cdCAgICB9XHJcblx0ICAgIHJldHVybiBXaGlsZVN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuV2hpbGVTdGF0ZW1lbnQgPSBXaGlsZVN0YXRlbWVudDtcclxuXHR2YXIgV2l0aFN0YXRlbWVudCA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFdpdGhTdGF0ZW1lbnQob2JqZWN0LCBib2R5KSB7XHJcblx0ICAgICAgICB0aGlzLnR5cGUgPSBzeW50YXhfMS5TeW50YXguV2l0aFN0YXRlbWVudDtcclxuXHQgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG5cdCAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcclxuXHQgICAgfVxyXG5cdCAgICByZXR1cm4gV2l0aFN0YXRlbWVudDtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuV2l0aFN0YXRlbWVudCA9IFdpdGhTdGF0ZW1lbnQ7XHJcblx0dmFyIFlpZWxkRXhwcmVzc2lvbiA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFlpZWxkRXhwcmVzc2lvbihhcmd1bWVudCwgZGVsZWdhdGUpIHtcclxuXHQgICAgICAgIHRoaXMudHlwZSA9IHN5bnRheF8xLlN5bnRheC5ZaWVsZEV4cHJlc3Npb247XHJcblx0ICAgICAgICB0aGlzLmFyZ3VtZW50ID0gYXJndW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmRlbGVnYXRlID0gZGVsZWdhdGU7XHJcblx0ICAgIH1cclxuXHQgICAgcmV0dXJuIFlpZWxkRXhwcmVzc2lvbjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuWWllbGRFeHByZXNzaW9uID0gWWllbGRFeHByZXNzaW9uO1xyXG5cblxuLyoqKi8gfSxcbi8qIDggKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHR2YXIgYXNzZXJ0XzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpO1xyXG5cdHZhciBlcnJvcl9oYW5kbGVyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKTtcclxuXHR2YXIgbWVzc2FnZXNfMSA9IF9fd2VicGFja19yZXF1aXJlX18oMTEpO1xyXG5cdHZhciBOb2RlID0gX193ZWJwYWNrX3JlcXVpcmVfXyg3KTtcclxuXHR2YXIgc2Nhbm5lcl8xID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMik7XHJcblx0dmFyIHN5bnRheF8xID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKTtcclxuXHR2YXIgdG9rZW5fMSA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xyXG5cdHZhciBBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyID0gJ0Fycm93UGFyYW1ldGVyUGxhY2VIb2xkZXInO1xyXG5cdHZhciBQYXJzZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBQYXJzZXIoY29kZSwgb3B0aW9ucywgZGVsZWdhdGUpIHtcclxuXHQgICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XHJcblx0ICAgICAgICB0aGlzLmNvbmZpZyA9IHtcclxuXHQgICAgICAgICAgICByYW5nZTogKHR5cGVvZiBvcHRpb25zLnJhbmdlID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMucmFuZ2UsXHJcblx0ICAgICAgICAgICAgbG9jOiAodHlwZW9mIG9wdGlvbnMubG9jID09PSAnYm9vbGVhbicpICYmIG9wdGlvbnMubG9jLFxyXG5cdCAgICAgICAgICAgIHNvdXJjZTogbnVsbCxcclxuXHQgICAgICAgICAgICB0b2tlbnM6ICh0eXBlb2Ygb3B0aW9ucy50b2tlbnMgPT09ICdib29sZWFuJykgJiYgb3B0aW9ucy50b2tlbnMsXHJcblx0ICAgICAgICAgICAgY29tbWVudDogKHR5cGVvZiBvcHRpb25zLmNvbW1lbnQgPT09ICdib29sZWFuJykgJiYgb3B0aW9ucy5jb21tZW50LFxyXG5cdCAgICAgICAgICAgIHRvbGVyYW50OiAodHlwZW9mIG9wdGlvbnMudG9sZXJhbnQgPT09ICdib29sZWFuJykgJiYgb3B0aW9ucy50b2xlcmFudFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbmZpZy5sb2MgJiYgb3B0aW9ucy5zb3VyY2UgJiYgb3B0aW9ucy5zb3VyY2UgIT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbmZpZy5zb3VyY2UgPSBTdHJpbmcob3B0aW9ucy5zb3VyY2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG5cdCAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIgPSBuZXcgZXJyb3JfaGFuZGxlcl8xLkVycm9ySGFuZGxlcigpO1xyXG5cdCAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIudG9sZXJhbnQgPSB0aGlzLmNvbmZpZy50b2xlcmFudDtcclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lciA9IG5ldyBzY2FubmVyXzEuU2Nhbm5lcihjb2RlLCB0aGlzLmVycm9ySGFuZGxlcik7XHJcblx0ICAgICAgICB0aGlzLnNjYW5uZXIudHJhY2tDb21tZW50ID0gdGhpcy5jb25maWcuY29tbWVudDtcclxuXHQgICAgICAgIHRoaXMub3BlcmF0b3JQcmVjZWRlbmNlID0ge1xyXG5cdCAgICAgICAgICAgICcpJzogMCxcclxuXHQgICAgICAgICAgICAnOyc6IDAsXHJcblx0ICAgICAgICAgICAgJywnOiAwLFxyXG5cdCAgICAgICAgICAgICc9JzogMCxcclxuXHQgICAgICAgICAgICAnXSc6IDAsXHJcblx0ICAgICAgICAgICAgJ3x8JzogMSxcclxuXHQgICAgICAgICAgICAnJiYnOiAyLFxyXG5cdCAgICAgICAgICAgICd8JzogMyxcclxuXHQgICAgICAgICAgICAnXic6IDQsXHJcblx0ICAgICAgICAgICAgJyYnOiA1LFxyXG5cdCAgICAgICAgICAgICc9PSc6IDYsXHJcblx0ICAgICAgICAgICAgJyE9JzogNixcclxuXHQgICAgICAgICAgICAnPT09JzogNixcclxuXHQgICAgICAgICAgICAnIT09JzogNixcclxuXHQgICAgICAgICAgICAnPCc6IDcsXHJcblx0ICAgICAgICAgICAgJz4nOiA3LFxyXG5cdCAgICAgICAgICAgICc8PSc6IDcsXHJcblx0ICAgICAgICAgICAgJz49JzogNyxcclxuXHQgICAgICAgICAgICAnPDwnOiA4LFxyXG5cdCAgICAgICAgICAgICc+Pic6IDgsXHJcblx0ICAgICAgICAgICAgJz4+Pic6IDgsXHJcblx0ICAgICAgICAgICAgJysnOiA5LFxyXG5cdCAgICAgICAgICAgICctJzogOSxcclxuXHQgICAgICAgICAgICAnKic6IDExLFxyXG5cdCAgICAgICAgICAgICcvJzogMTEsXHJcblx0ICAgICAgICAgICAgJyUnOiAxMVxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgICAgIHRoaXMubG9va2FoZWFkID0ge1xyXG5cdCAgICAgICAgICAgIHR5cGU6IDIgLyogRU9GICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiAnJyxcclxuXHQgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLnNjYW5uZXIubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICBsaW5lU3RhcnQ6IDAsXHJcblx0ICAgICAgICAgICAgc3RhcnQ6IDAsXHJcblx0ICAgICAgICAgICAgZW5kOiAwXHJcblx0ICAgICAgICB9O1xyXG5cdCAgICAgICAgdGhpcy5oYXNMaW5lVGVybWluYXRvciA9IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0ID0ge1xyXG5cdCAgICAgICAgICAgIGlzTW9kdWxlOiBmYWxzZSxcclxuXHQgICAgICAgICAgICBhd2FpdDogZmFsc2UsXHJcblx0ICAgICAgICAgICAgYWxsb3dJbjogdHJ1ZSxcclxuXHQgICAgICAgICAgICBhbGxvd1N0cmljdERpcmVjdGl2ZTogdHJ1ZSxcclxuXHQgICAgICAgICAgICBhbGxvd1lpZWxkOiB0cnVlLFxyXG5cdCAgICAgICAgICAgIGZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvcjogbnVsbCxcclxuXHQgICAgICAgICAgICBpc0Fzc2lnbm1lbnRUYXJnZXQ6IGZhbHNlLFxyXG5cdCAgICAgICAgICAgIGlzQmluZGluZ0VsZW1lbnQ6IGZhbHNlLFxyXG5cdCAgICAgICAgICAgIGluRnVuY3Rpb25Cb2R5OiBmYWxzZSxcclxuXHQgICAgICAgICAgICBpbkl0ZXJhdGlvbjogZmFsc2UsXHJcblx0ICAgICAgICAgICAgaW5Td2l0Y2g6IGZhbHNlLFxyXG5cdCAgICAgICAgICAgIGxhYmVsU2V0OiB7fSxcclxuXHQgICAgICAgICAgICBzdHJpY3Q6IGZhbHNlXHJcblx0ICAgICAgICB9O1xyXG5cdCAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcclxuXHQgICAgICAgIHRoaXMuc3RhcnRNYXJrZXIgPSB7XHJcblx0ICAgICAgICAgICAgaW5kZXg6IDAsXHJcblx0ICAgICAgICAgICAgbGluZTogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgY29sdW1uOiAwXHJcblx0ICAgICAgICB9O1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyID0ge1xyXG5cdCAgICAgICAgICAgIGluZGV4OiAwLFxyXG5cdCAgICAgICAgICAgIGxpbmU6IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGNvbHVtbjogMFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICB0aGlzLmxhc3RNYXJrZXIgPSB7XHJcblx0ICAgICAgICAgICAgaW5kZXg6IHRoaXMuc2Nhbm5lci5pbmRleCxcclxuXHQgICAgICAgICAgICBsaW5lOiB0aGlzLnNjYW5uZXIubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICBjb2x1bW46IHRoaXMuc2Nhbm5lci5pbmRleCAtIHRoaXMuc2Nhbm5lci5saW5lU3RhcnRcclxuXHQgICAgICAgIH07XHJcblx0ICAgIH1cclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS50aHJvd0Vycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2VGb3JtYXQpIHtcclxuXHQgICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuXHQgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcblx0ICAgICAgICAgICAgdmFsdWVzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cdCAgICAgICAgdmFyIG1zZyA9IG1lc3NhZ2VGb3JtYXQucmVwbGFjZSgvJShcXGQpL2csIGZ1bmN0aW9uICh3aG9sZSwgaWR4KSB7XHJcblx0ICAgICAgICAgICAgYXNzZXJ0XzEuYXNzZXJ0KGlkeCA8IGFyZ3MubGVuZ3RoLCAnTWVzc2FnZSByZWZlcmVuY2UgbXVzdCBiZSBpbiByYW5nZScpO1xyXG5cdCAgICAgICAgICAgIHJldHVybiBhcmdzW2lkeF07XHJcblx0ICAgICAgICB9KTtcclxuXHQgICAgICAgIHZhciBpbmRleCA9IHRoaXMubGFzdE1hcmtlci5pbmRleDtcclxuXHQgICAgICAgIHZhciBsaW5lID0gdGhpcy5sYXN0TWFya2VyLmxpbmU7XHJcblx0ICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5sYXN0TWFya2VyLmNvbHVtbiArIDE7XHJcblx0ICAgICAgICB0aHJvdyB0aGlzLmVycm9ySGFuZGxlci5jcmVhdGVFcnJvcihpbmRleCwgbGluZSwgY29sdW1uLCBtc2cpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnRvbGVyYXRlRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZUZvcm1hdCkge1xyXG5cdCAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG5cdCAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcclxuXHQgICAgICAgICAgICB2YWx1ZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblx0ICAgICAgICB2YXIgbXNnID0gbWVzc2FnZUZvcm1hdC5yZXBsYWNlKC8lKFxcZCkvZywgZnVuY3Rpb24gKHdob2xlLCBpZHgpIHtcclxuXHQgICAgICAgICAgICBhc3NlcnRfMS5hc3NlcnQoaWR4IDwgYXJncy5sZW5ndGgsICdNZXNzYWdlIHJlZmVyZW5jZSBtdXN0IGJlIGluIHJhbmdlJyk7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIGFyZ3NbaWR4XTtcclxuXHQgICAgICAgIH0pO1xyXG5cdCAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5sYXN0TWFya2VyLmluZGV4O1xyXG5cdCAgICAgICAgdmFyIGxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLmxhc3RNYXJrZXIuY29sdW1uICsgMTtcclxuXHQgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLnRvbGVyYXRlRXJyb3IoaW5kZXgsIGxpbmUsIGNvbHVtbiwgbXNnKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gVGhyb3cgYW4gZXhjZXB0aW9uIGJlY2F1c2Ugb2YgdGhlIHRva2VuLlxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnVuZXhwZWN0ZWRUb2tlbkVycm9yID0gZnVuY3Rpb24gKHRva2VuLCBtZXNzYWdlKSB7XHJcblx0ICAgICAgICB2YXIgbXNnID0gbWVzc2FnZSB8fCBtZXNzYWdlc18xLk1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbjtcclxuXHQgICAgICAgIHZhciB2YWx1ZTtcclxuXHQgICAgICAgIGlmICh0b2tlbikge1xyXG5cdCAgICAgICAgICAgIGlmICghbWVzc2FnZSkge1xyXG5cdCAgICAgICAgICAgICAgICBtc2cgPSAodG9rZW4udHlwZSA9PT0gMiAvKiBFT0YgKi8pID8gbWVzc2FnZXNfMS5NZXNzYWdlcy5VbmV4cGVjdGVkRU9TIDpcclxuXHQgICAgICAgICAgICAgICAgICAgICh0b2tlbi50eXBlID09PSAzIC8qIElkZW50aWZpZXIgKi8pID8gbWVzc2FnZXNfMS5NZXNzYWdlcy5VbmV4cGVjdGVkSWRlbnRpZmllciA6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09IDYgLyogTnVtZXJpY0xpdGVyYWwgKi8pID8gbWVzc2FnZXNfMS5NZXNzYWdlcy5VbmV4cGVjdGVkTnVtYmVyIDpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09IDggLyogU3RyaW5nTGl0ZXJhbCAqLykgPyBtZXNzYWdlc18xLk1lc3NhZ2VzLlVuZXhwZWN0ZWRTdHJpbmcgOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09IDEwIC8qIFRlbXBsYXRlICovKSA/IG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW5leHBlY3RlZFRlbXBsYXRlIDpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlc18xLk1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbjtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDQgLyogS2V5d29yZCAqLykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc0Z1dHVyZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlVuZXhwZWN0ZWRSZXNlcnZlZDtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgdGhpcy5zY2FubmVyLmlzU3RyaWN0TW9kZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB2YWx1ZSA9IHRva2VuLnZhbHVlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdmFsdWUgPSAnSUxMRUdBTCc7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBtc2cgPSBtc2cucmVwbGFjZSgnJTAnLCB2YWx1ZSk7XHJcblx0ICAgICAgICBpZiAodG9rZW4gJiYgdHlwZW9mIHRva2VuLmxpbmVOdW1iZXIgPT09ICdudW1iZXInKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGluZGV4ID0gdG9rZW4uc3RhcnQ7XHJcblx0ICAgICAgICAgICAgdmFyIGxpbmUgPSB0b2tlbi5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgIHZhciBsYXN0TWFya2VyTGluZVN0YXJ0ID0gdGhpcy5sYXN0TWFya2VyLmluZGV4IC0gdGhpcy5sYXN0TWFya2VyLmNvbHVtbjtcclxuXHQgICAgICAgICAgICB2YXIgY29sdW1uID0gdG9rZW4uc3RhcnQgLSBsYXN0TWFya2VyTGluZVN0YXJ0ICsgMTtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXIuY3JlYXRlRXJyb3IoaW5kZXgsIGxpbmUsIGNvbHVtbiwgbXNnKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMubGFzdE1hcmtlci5pbmRleDtcclxuXHQgICAgICAgICAgICB2YXIgbGluZSA9IHRoaXMubGFzdE1hcmtlci5saW5lO1xyXG5cdCAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLmxhc3RNYXJrZXIuY29sdW1uICsgMTtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXIuY3JlYXRlRXJyb3IoaW5kZXgsIGxpbmUsIGNvbHVtbiwgbXNnKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS50aHJvd1VuZXhwZWN0ZWRUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbiwgbWVzc2FnZSkge1xyXG5cdCAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkVG9rZW5FcnJvcih0b2tlbiwgbWVzc2FnZSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4sIG1lc3NhZ2UpIHtcclxuXHQgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLnRvbGVyYXRlKHRoaXMudW5leHBlY3RlZFRva2VuRXJyb3IodG9rZW4sIG1lc3NhZ2UpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5jb2xsZWN0Q29tbWVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmNvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnNjYW5uZXIuc2NhbkNvbW1lbnRzKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB2YXIgY29tbWVudHMgPSB0aGlzLnNjYW5uZXIuc2NhbkNvbW1lbnRzKCk7XHJcblx0ICAgICAgICAgICAgaWYgKGNvbW1lbnRzLmxlbmd0aCA+IDAgJiYgdGhpcy5kZWxlZ2F0ZSkge1xyXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRzLmxlbmd0aDsgKytpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGNvbW1lbnRzW2ldO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB2b2lkIDA7XHJcblx0ICAgICAgICAgICAgICAgICAgICBub2RlID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGUubXVsdGlMaW5lID8gJ0Jsb2NrQ29tbWVudCcgOiAnTGluZUNvbW1lbnQnLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnNjYW5uZXIuc291cmNlLnNsaWNlKGUuc2xpY2VbMF0sIGUuc2xpY2VbMV0pXHJcblx0ICAgICAgICAgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnJhbmdlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yYW5nZSA9IGUucmFuZ2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maWcubG9jKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5sb2MgPSBlLmxvYztcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBtZXRhZGF0YSA9IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGFydDoge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiBlLmxvYy5zdGFydC5saW5lLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IGUubG9jLnN0YXJ0LmNvbHVtbixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBlLnJhbmdlWzBdXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbmQ6IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogZS5sb2MuZW5kLmxpbmUsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogZS5sb2MuZW5kLmNvbHVtbixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBlLnJhbmdlWzFdXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZWdhdGUobm9kZSwgbWV0YWRhdGEpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBGcm9tIGludGVybmFsIHJlcHJlc2VudGF0aW9uIHRvIGFuIGV4dGVybmFsIHN0cnVjdHVyZVxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLmdldFRva2VuUmF3ID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5zY2FubmVyLnNvdXJjZS5zbGljZSh0b2tlbi5zdGFydCwgdG9rZW4uZW5kKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5jb252ZXJ0VG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuXHQgICAgICAgIHZhciB0ID0ge1xyXG5cdCAgICAgICAgICAgIHR5cGU6IHRva2VuXzEuVG9rZW5OYW1lW3Rva2VuLnR5cGVdLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiB0aGlzLmdldFRva2VuUmF3KHRva2VuKVxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbmZpZy5yYW5nZSkge1xyXG5cdCAgICAgICAgICAgIHQucmFuZ2UgPSBbdG9rZW4uc3RhcnQsIHRva2VuLmVuZF07XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAodGhpcy5jb25maWcubG9jKSB7XHJcblx0ICAgICAgICAgICAgdC5sb2MgPSB7XHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLnN0YXJ0TWFya2VyLmxpbmUsXHJcblx0ICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuc3RhcnRNYXJrZXIuY29sdW1uXHJcblx0ICAgICAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgICAgIGVuZDoge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuc2Nhbm5lci5pbmRleCAtIHRoaXMuc2Nhbm5lci5saW5lU3RhcnRcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH07XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gOSAvKiBSZWd1bGFyRXhwcmVzc2lvbiAqLykge1xyXG5cdCAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gdG9rZW4ucGF0dGVybjtcclxuXHQgICAgICAgICAgICB2YXIgZmxhZ3MgPSB0b2tlbi5mbGFncztcclxuXHQgICAgICAgICAgICB0LnJlZ2V4ID0geyBwYXR0ZXJuOiBwYXR0ZXJuLCBmbGFnczogZmxhZ3MgfTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0O1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLm5leHRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgdGhpcy5sYXN0TWFya2VyLmxpbmUgPSB0aGlzLnNjYW5uZXIubGluZU51bWJlcjtcclxuXHQgICAgICAgIHRoaXMubGFzdE1hcmtlci5jb2x1bW4gPSB0aGlzLnNjYW5uZXIuaW5kZXggLSB0aGlzLnNjYW5uZXIubGluZVN0YXJ0O1xyXG5cdCAgICAgICAgdGhpcy5jb2xsZWN0Q29tbWVudHMoKTtcclxuXHQgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuaW5kZXggIT09IHRoaXMuc3RhcnRNYXJrZXIuaW5kZXgpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnN0YXJ0TWFya2VyLmluZGV4ID0gdGhpcy5zY2FubmVyLmluZGV4O1xyXG5cdCAgICAgICAgICAgIHRoaXMuc3RhcnRNYXJrZXIubGluZSA9IHRoaXMuc2Nhbm5lci5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgIHRoaXMuc3RhcnRNYXJrZXIuY29sdW1uID0gdGhpcy5zY2FubmVyLmluZGV4IC0gdGhpcy5zY2FubmVyLmxpbmVTdGFydDtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBuZXh0ID0gdGhpcy5zY2FubmVyLmxleCgpO1xyXG5cdCAgICAgICAgdGhpcy5oYXNMaW5lVGVybWluYXRvciA9ICh0b2tlbi5saW5lTnVtYmVyICE9PSBuZXh0LmxpbmVOdW1iZXIpO1xyXG5cdCAgICAgICAgaWYgKG5leHQgJiYgdGhpcy5jb250ZXh0LnN0cmljdCAmJiBuZXh0LnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKG5leHQudmFsdWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgIG5leHQudHlwZSA9IDQgLyogS2V5d29yZCAqLztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmxvb2thaGVhZCA9IG5leHQ7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb25maWcudG9rZW5zICYmIG5leHQudHlwZSAhPT0gMiAvKiBFT0YgKi8pIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHRoaXMuY29udmVydFRva2VuKG5leHQpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0b2tlbjtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5uZXh0UmVnZXhUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHRoaXMuY29sbGVjdENvbW1lbnRzKCk7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLnNjYW5uZXIuc2NhblJlZ0V4cCgpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29uZmlnLnRva2Vucykge1xyXG5cdCAgICAgICAgICAgIC8vIFBvcCB0aGUgcHJldmlvdXMgdG9rZW4sICcvJyBvciAnLz0nXHJcblx0ICAgICAgICAgICAgLy8gVGhpcyBpcyBhZGRlZCBmcm9tIHRoZSBsb29rYWhlYWQgdG9rZW4uXHJcblx0ICAgICAgICAgICAgdGhpcy50b2tlbnMucG9wKCk7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2tlbnMucHVzaCh0aGlzLmNvbnZlcnRUb2tlbih0b2tlbikpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgLy8gUHJpbWUgdGhlIG5leHQgbG9va2FoZWFkLlxyXG5cdCAgICAgICAgdGhpcy5sb29rYWhlYWQgPSB0b2tlbjtcclxuXHQgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICByZXR1cm4gdG9rZW47XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgaW5kZXg6IHRoaXMuc3RhcnRNYXJrZXIuaW5kZXgsXHJcblx0ICAgICAgICAgICAgbGluZTogdGhpcy5zdGFydE1hcmtlci5saW5lLFxyXG5cdCAgICAgICAgICAgIGNvbHVtbjogdGhpcy5zdGFydE1hcmtlci5jb2x1bW5cclxuXHQgICAgICAgIH07XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuc3RhcnROb2RlID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcblx0ICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgIGluZGV4OiB0b2tlbi5zdGFydCxcclxuXHQgICAgICAgICAgICBsaW5lOiB0b2tlbi5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGNvbHVtbjogdG9rZW4uc3RhcnQgLSB0b2tlbi5saW5lU3RhcnRcclxuXHQgICAgICAgIH07XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuZmluYWxpemUgPSBmdW5jdGlvbiAobWFya2VyLCBub2RlKSB7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb25maWcucmFuZ2UpIHtcclxuXHQgICAgICAgICAgICBub2RlLnJhbmdlID0gW21hcmtlci5pbmRleCwgdGhpcy5sYXN0TWFya2VyLmluZGV4XTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICh0aGlzLmNvbmZpZy5sb2MpIHtcclxuXHQgICAgICAgICAgICBub2RlLmxvYyA9IHtcclxuXHQgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGxpbmU6IG1hcmtlci5saW5lLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBtYXJrZXIuY29sdW1uLFxyXG5cdCAgICAgICAgICAgICAgICB9LFxyXG5cdCAgICAgICAgICAgICAgICBlbmQ6IHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGFzdE1hcmtlci5saW5lLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmxhc3RNYXJrZXIuY29sdW1uXHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zb3VyY2UpIHtcclxuXHQgICAgICAgICAgICAgICAgbm9kZS5sb2Muc291cmNlID0gdGhpcy5jb25maWcuc291cmNlO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICh0aGlzLmRlbGVnYXRlKSB7XHJcblx0ICAgICAgICAgICAgdmFyIG1ldGFkYXRhID0ge1xyXG5cdCAgICAgICAgICAgICAgICBzdGFydDoge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbGluZTogbWFya2VyLmxpbmUsXHJcblx0ICAgICAgICAgICAgICAgICAgICBjb2x1bW46IG1hcmtlci5jb2x1bW4sXHJcblx0ICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG1hcmtlci5pbmRleFxyXG5cdCAgICAgICAgICAgICAgICB9LFxyXG5cdCAgICAgICAgICAgICAgICBlbmQ6IHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGFzdE1hcmtlci5saW5lLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmxhc3RNYXJrZXIuY29sdW1uLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLmxhc3RNYXJrZXIuaW5kZXhcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgdGhpcy5kZWxlZ2F0ZShub2RlLCBtZXRhZGF0YSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gbm9kZTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gRXhwZWN0IHRoZSBuZXh0IHRva2VuIHRvIG1hdGNoIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cclxuXHQgICAgLy8gSWYgbm90LCBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuZXhwZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IDcgLyogUHVuY3R1YXRvciAqLyB8fCB0b2tlbi52YWx1ZSAhPT0gdmFsdWUpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKHRva2VuKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgLy8gUXVpZXRseSBleHBlY3QgYSBjb21tYSB3aGVuIGluIHRvbGVyYW50IG1vZGUsIG90aGVyd2lzZSBkZWxlZ2F0ZXMgdG8gZXhwZWN0KCkuXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuZXhwZWN0Q29tbWFTZXBhcmF0b3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb25maWcudG9sZXJhbnQpIHtcclxuXHQgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gNyAvKiBQdW5jdHVhdG9yICovICYmIHRva2VuLnZhbHVlID09PSAnLCcpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gNyAvKiBQdW5jdHVhdG9yICovICYmIHRva2VuLnZhbHVlID09PSAnOycpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbik7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuLCBtZXNzYWdlc18xLk1lc3NhZ2VzLlVuZXhwZWN0ZWRUb2tlbik7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJywnKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgLy8gRXhwZWN0IHRoZSBuZXh0IHRva2VuIHRvIG1hdGNoIHRoZSBzcGVjaWZpZWQga2V5d29yZC5cclxuXHQgICAgLy8gSWYgbm90LCBhbiBleGNlcHRpb24gd2lsbCBiZSB0aHJvd24uXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuZXhwZWN0S2V5d29yZCA9IGZ1bmN0aW9uIChrZXl3b3JkKSB7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IDQgLyogS2V5d29yZCAqLyB8fCB0b2tlbi52YWx1ZSAhPT0ga2V5d29yZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgbmV4dCB0b2tlbiBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgcHVuY3R1YXRvci5cclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9va2FoZWFkLnR5cGUgPT09IDcgLyogUHVuY3R1YXRvciAqLyAmJiB0aGlzLmxvb2thaGVhZC52YWx1ZSA9PT0gdmFsdWU7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBrZXl3b3JkXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUubWF0Y2hLZXl3b3JkID0gZnVuY3Rpb24gKGtleXdvcmQpIHtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmxvb2thaGVhZC50eXBlID09PSA0IC8qIEtleXdvcmQgKi8gJiYgdGhpcy5sb29rYWhlYWQudmFsdWUgPT09IGtleXdvcmQ7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBuZXh0IHRva2VuIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBjb250ZXh0dWFsIGtleXdvcmRcclxuXHQgICAgLy8gKHdoZXJlIGFuIGlkZW50aWZpZXIgaXMgc29tZXRpbWVzIGEga2V5d29yZCBkZXBlbmRpbmcgb24gdGhlIGNvbnRleHQpXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUubWF0Y2hDb250ZXh0dWFsS2V5d29yZCA9IGZ1bmN0aW9uIChrZXl3b3JkKSB7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb29rYWhlYWQudHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmIHRoaXMubG9va2FoZWFkLnZhbHVlID09PSBrZXl3b3JkO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgbmV4dCB0b2tlbiBpcyBhbiBhc3NpZ25tZW50IG9wZXJhdG9yXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUubWF0Y2hBc3NpZ24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpZiAodGhpcy5sb29rYWhlYWQudHlwZSAhPT0gNyAvKiBQdW5jdHVhdG9yICovKSB7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIG9wID0gdGhpcy5sb29rYWhlYWQudmFsdWU7XHJcblx0ICAgICAgICByZXR1cm4gb3AgPT09ICc9JyB8fFxyXG5cdCAgICAgICAgICAgIG9wID09PSAnKj0nIHx8XHJcblx0ICAgICAgICAgICAgb3AgPT09ICcqKj0nIHx8XHJcblx0ICAgICAgICAgICAgb3AgPT09ICcvPScgfHxcclxuXHQgICAgICAgICAgICBvcCA9PT0gJyU9JyB8fFxyXG5cdCAgICAgICAgICAgIG9wID09PSAnKz0nIHx8XHJcblx0ICAgICAgICAgICAgb3AgPT09ICctPScgfHxcclxuXHQgICAgICAgICAgICBvcCA9PT0gJzw8PScgfHxcclxuXHQgICAgICAgICAgICBvcCA9PT0gJz4+PScgfHxcclxuXHQgICAgICAgICAgICBvcCA9PT0gJz4+Pj0nIHx8XHJcblx0ICAgICAgICAgICAgb3AgPT09ICcmPScgfHxcclxuXHQgICAgICAgICAgICBvcCA9PT0gJ149JyB8fFxyXG5cdCAgICAgICAgICAgIG9wID09PSAnfD0nO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBDb3ZlciBncmFtbWFyIHN1cHBvcnQuXHJcblx0ICAgIC8vXHJcblx0ICAgIC8vIFdoZW4gYW4gYXNzaWdubWVudCBleHByZXNzaW9uIHBvc2l0aW9uIHN0YXJ0cyB3aXRoIGFuIGxlZnQgcGFyZW50aGVzaXMsIHRoZSBkZXRlcm1pbmF0aW9uIG9mIHRoZSB0eXBlXHJcblx0ICAgIC8vIG9mIHRoZSBzeW50YXggaXMgdG8gYmUgZGVmZXJyZWQgYXJiaXRyYXJpbHkgbG9uZyB1bnRpbCB0aGUgZW5kIG9mIHRoZSBwYXJlbnRoZXNlcyBwYWlyIChwbHVzIGEgbG9va2FoZWFkKVxyXG5cdCAgICAvLyBvciB0aGUgZmlyc3QgY29tbWEuIFRoaXMgc2l0dWF0aW9uIGFsc28gZGVmZXJzIHRoZSBkZXRlcm1pbmF0aW9uIG9mIGFsbCB0aGUgZXhwcmVzc2lvbnMgbmVzdGVkIGluIHRoZSBwYWlyLlxyXG5cdCAgICAvL1xyXG5cdCAgICAvLyBUaGVyZSBhcmUgdGhyZWUgcHJvZHVjdGlvbnMgdGhhdCBjYW4gYmUgcGFyc2VkIGluIGEgcGFyZW50aGVzZXMgcGFpciB0aGF0IG5lZWRzIHRvIGJlIGRldGVybWluZWRcclxuXHQgICAgLy8gYWZ0ZXIgdGhlIG91dGVybW9zdCBwYWlyIGlzIGNsb3NlZC4gVGhleSBhcmU6XHJcblx0ICAgIC8vXHJcblx0ICAgIC8vICAgMS4gQXNzaWdubWVudEV4cHJlc3Npb25cclxuXHQgICAgLy8gICAyLiBCaW5kaW5nRWxlbWVudHNcclxuXHQgICAgLy8gICAzLiBBc3NpZ25tZW50VGFyZ2V0c1xyXG5cdCAgICAvL1xyXG5cdCAgICAvLyBJbiBvcmRlciB0byBhdm9pZCBleHBvbmVudGlhbCBiYWNrdHJhY2tpbmcsIHdlIHVzZSB0d28gZmxhZ3MgdG8gZGVub3RlIGlmIHRoZSBwcm9kdWN0aW9uIGNhbiBiZVxyXG5cdCAgICAvLyBiaW5kaW5nIGVsZW1lbnQgb3IgYXNzaWdubWVudCB0YXJnZXQuXHJcblx0ICAgIC8vXHJcblx0ICAgIC8vIFRoZSB0aHJlZSBwcm9kdWN0aW9ucyBoYXZlIHRoZSByZWxhdGlvbnNoaXA6XHJcblx0ICAgIC8vXHJcblx0ICAgIC8vICAgQmluZGluZ0VsZW1lbnRzIOKKhiBBc3NpZ25tZW50VGFyZ2V0cyDiioYgQXNzaWdubWVudEV4cHJlc3Npb25cclxuXHQgICAgLy9cclxuXHQgICAgLy8gd2l0aCBhIHNpbmdsZSBleGNlcHRpb24gdGhhdCBDb3ZlckluaXRpYWxpemVkTmFtZSB3aGVuIHVzZWQgZGlyZWN0bHkgaW4gYW4gRXhwcmVzc2lvbiwgZ2VuZXJhdGVzXHJcblx0ICAgIC8vIGFuIGVhcmx5IGVycm9yLiBUaGVyZWZvcmUsIHdlIG5lZWQgdGhlIHRoaXJkIHN0YXRlLCBmaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IsIHRvIHRyYWNrIHRoZVxyXG5cdCAgICAvLyBmaXJzdCB1c2FnZSBvZiBDb3ZlckluaXRpYWxpemVkTmFtZSBhbmQgcmVwb3J0IGl0IHdoZW4gd2UgcmVhY2hlZCB0aGUgZW5kIG9mIHRoZSBwYXJlbnRoZXNlcyBwYWlyLlxyXG5cdCAgICAvL1xyXG5cdCAgICAvLyBpc29sYXRlQ292ZXJHcmFtbWFyIGZ1bmN0aW9uIHJ1bnMgdGhlIGdpdmVuIHBhcnNlciBmdW5jdGlvbiB3aXRoIGEgbmV3IGNvdmVyIGdyYW1tYXIgY29udGV4dCwgYW5kIGl0IGRvZXMgbm90XHJcblx0ICAgIC8vIGVmZmVjdCB0aGUgY3VycmVudCBmbGFncy4gVGhpcyBtZWFucyB0aGUgcHJvZHVjdGlvbiB0aGUgcGFyc2VyIHBhcnNlcyBpcyBvbmx5IHVzZWQgYXMgYW4gZXhwcmVzc2lvbi4gVGhlcmVmb3JlXHJcblx0ICAgIC8vIHRoZSBDb3ZlckluaXRpYWxpemVkTmFtZSBjaGVjayBpcyBjb25kdWN0ZWQuXHJcblx0ICAgIC8vXHJcblx0ICAgIC8vIGluaGVyaXRDb3ZlckdyYW1tYXIgZnVuY3Rpb24gcnVucyB0aGUgZ2l2ZW4gcGFyc2UgZnVuY3Rpb24gd2l0aCBhIG5ldyBjb3ZlciBncmFtbWFyIGNvbnRleHQsIGFuZCBpdCBwcm9wYWdhdGVzXHJcblx0ICAgIC8vIHRoZSBmbGFncyBvdXRzaWRlIG9mIHRoZSBwYXJzZXIuIFRoaXMgbWVhbnMgdGhlIHByb2R1Y3Rpb24gdGhlIHBhcnNlciBwYXJzZXMgaXMgdXNlZCBhcyBhIHBhcnQgb2YgYSBwb3RlbnRpYWxcclxuXHQgICAgLy8gcGF0dGVybi4gVGhlIENvdmVySW5pdGlhbGl6ZWROYW1lIGNoZWNrIGlzIGRlZmVycmVkLlxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLmlzb2xhdGVDb3ZlckdyYW1tYXIgPSBmdW5jdGlvbiAocGFyc2VGdW5jdGlvbikge1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzSXNCaW5kaW5nRWxlbWVudCA9IHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50O1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzSXNBc3NpZ25tZW50VGFyZ2V0ID0gdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldDtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0ZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IHRoaXMuY29udGV4dC5maXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3I7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IHRydWU7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gdHJ1ZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5maXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IgPSBudWxsO1xyXG5cdCAgICAgICAgdmFyIHJlc3VsdCA9IHBhcnNlRnVuY3Rpb24uY2FsbCh0aGlzKTtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yICE9PSBudWxsKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gcHJldmlvdXNJc0JpbmRpbmdFbGVtZW50O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IHByZXZpb3VzSXNBc3NpZ25tZW50VGFyZ2V0O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IHByZXZpb3VzRmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yO1xyXG5cdCAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5pbmhlcml0Q292ZXJHcmFtbWFyID0gZnVuY3Rpb24gKHBhcnNlRnVuY3Rpb24pIHtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0lzQmluZGluZ0VsZW1lbnQgPSB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudDtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0lzQXNzaWdubWVudFRhcmdldCA9IHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQ7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNGaXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IgPSB0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSB0cnVlO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gbnVsbDtcclxuXHQgICAgICAgIHZhciByZXN1bHQgPSBwYXJzZUZ1bmN0aW9uLmNhbGwodGhpcyk7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ICYmIHByZXZpb3VzSXNCaW5kaW5nRWxlbWVudDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgPSB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ICYmIHByZXZpb3VzSXNBc3NpZ25tZW50VGFyZ2V0O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IHByZXZpb3VzRmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yIHx8IHRoaXMuY29udGV4dC5maXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3I7XHJcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLmNvbnN1bWVTZW1pY29sb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnOycpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKCF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDIgLyogRU9GICovICYmICF0aGlzLm1hdGNoKCd9JykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRoaXMubGFzdE1hcmtlci5pbmRleCA9IHRoaXMuc3RhcnRNYXJrZXIuaW5kZXg7XHJcblx0ICAgICAgICAgICAgdGhpcy5sYXN0TWFya2VyLmxpbmUgPSB0aGlzLnN0YXJ0TWFya2VyLmxpbmU7XHJcblx0ICAgICAgICAgICAgdGhpcy5sYXN0TWFya2VyLmNvbHVtbiA9IHRoaXMuc3RhcnRNYXJrZXIuY29sdW1uO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wcmltYXJ5LWV4cHJlc3Npb25cclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVByaW1hcnlFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBleHByO1xyXG5cdCAgICAgICAgdmFyIHRva2VuLCByYXc7XHJcblx0ICAgICAgICBzd2l0Y2ggKHRoaXMubG9va2FoZWFkLnR5cGUpIHtcclxuXHQgICAgICAgICAgICBjYXNlIDMgLyogSWRlbnRpZmllciAqLzpcclxuXHQgICAgICAgICAgICAgICAgaWYgKCh0aGlzLmNvbnRleHQuaXNNb2R1bGUgfHwgdGhpcy5jb250ZXh0LmF3YWl0KSAmJiB0aGlzLmxvb2thaGVhZC52YWx1ZSA9PT0gJ2F3YWl0Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZXhwciA9IHRoaXMubWF0Y2hBc3luY0Z1bmN0aW9uKCkgPyB0aGlzLnBhcnNlRnVuY3Rpb25FeHByZXNzaW9uKCkgOiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLklkZW50aWZpZXIodGhpcy5uZXh0VG9rZW4oKS52YWx1ZSkpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIDYgLyogTnVtZXJpY0xpdGVyYWwgKi86XHJcblx0ICAgICAgICAgICAgY2FzZSA4IC8qIFN0cmluZ0xpdGVyYWwgKi86XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0ICYmIHRoaXMubG9va2FoZWFkLm9jdGFsKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRoaXMubG9va2FoZWFkLCBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgIHJhdyA9IHRoaXMuZ2V0VG9rZW5SYXcodG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5MaXRlcmFsKHRva2VuLnZhbHVlLCByYXcpKTtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSAxIC8qIEJvb2xlYW5MaXRlcmFsICovOlxyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgcmF3ID0gdGhpcy5nZXRUb2tlblJhdyh0b2tlbik7XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkxpdGVyYWwodG9rZW4udmFsdWUgPT09ICd0cnVlJywgcmF3KSk7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGNhc2UgNSAvKiBOdWxsTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0b2tlbiA9IHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgIHJhdyA9IHRoaXMuZ2V0VG9rZW5SYXcodG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5MaXRlcmFsKG51bGwsIHJhdykpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIDEwIC8qIFRlbXBsYXRlICovOlxyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZVRlbXBsYXRlTGl0ZXJhbCgpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIDcgLyogUHVuY3R1YXRvciAqLzpcclxuXHQgICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLmxvb2thaGVhZC52YWx1ZSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAnKCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VHcm91cEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAnWyc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZXhwciA9IHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXJyYXlJbml0aWFsaXplcik7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICd7JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VPYmplY3RJbml0aWFsaXplcik7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICcvJzpcclxuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgJy89JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYW5uZXIuaW5kZXggPSB0aGlzLnN0YXJ0TWFya2VyLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5uZXh0UmVnZXhUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJhdyA9IHRoaXMuZ2V0VG9rZW5SYXcodG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlJlZ2V4TGl0ZXJhbCh0b2tlbi5yZWdleCwgcmF3LCB0b2tlbi5wYXR0ZXJuLCB0b2tlbi5mbGFncykpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIDQgLyogS2V5d29yZCAqLzpcclxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuc3RyaWN0ICYmIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkICYmIHRoaXMubWF0Y2hLZXl3b3JkKCd5aWVsZCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuY29udGV4dC5zdHJpY3QgJiYgdGhpcy5tYXRjaEtleXdvcmQoJ2xldCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5JZGVudGlmaWVyKHRoaXMubmV4dFRva2VuKCkudmFsdWUpKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ2Z1bmN0aW9uJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZUZ1bmN0aW9uRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ3RoaXMnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZXhwciA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVGhpc0V4cHJlc3Npb24oKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnY2xhc3MnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLnBhcnNlQ2xhc3NFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS1pbml0aWFsaXplclxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlU3ByZWFkRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnLi4uJyk7XHJcblx0ICAgICAgICB2YXIgYXJnID0gdGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5TcHJlYWRFbGVtZW50KGFyZykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXJyYXlJbml0aWFsaXplciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgZWxlbWVudHMgPSBbXTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCdbJyk7XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMubWF0Y2goJ10nKSkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcsJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChudWxsKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaCgnLi4uJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnBhcnNlU3ByZWFkRWxlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJ10nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcsJyk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50KTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2godGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbikpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJ10nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBlY3QoJywnKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCddJyk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5BcnJheUV4cHJlc3Npb24oZWxlbWVudHMpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LWluaXRpYWxpemVyXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VQcm9wZXJ0eU1ldGhvZCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNTdHJpY3QgPSB0aGlzLmNvbnRleHQuc3RyaWN0O1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dTdHJpY3REaXJlY3RpdmUgPSB0aGlzLmNvbnRleHQuYWxsb3dTdHJpY3REaXJlY3RpdmU7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dTdHJpY3REaXJlY3RpdmUgPSBwYXJhbXMuc2ltcGxlO1xyXG5cdCAgICAgICAgdmFyIGJvZHkgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgcGFyYW1zLmZpcnN0UmVzdHJpY3RlZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4ocGFyYW1zLmZpcnN0UmVzdHJpY3RlZCwgcGFyYW1zLm1lc3NhZ2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgcGFyYW1zLnN0cmljdGVkKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbihwYXJhbXMuc3RyaWN0ZWQsIHBhcmFtcy5tZXNzYWdlKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5zdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZSA9IHByZXZpb3VzQWxsb3dTdHJpY3REaXJlY3RpdmU7XHJcblx0ICAgICAgICByZXR1cm4gYm9keTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVByb3BlcnR5TWV0aG9kRnVuY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgaXNHZW5lcmF0b3IgPSBmYWxzZTtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNBbGxvd1lpZWxkID0gdGhpcy5jb250ZXh0LmFsbG93WWllbGQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyc2VGb3JtYWxQYXJhbWV0ZXJzKCk7XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5wYXJzZVByb3BlcnR5TWV0aG9kKHBhcmFtcyk7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IHByZXZpb3VzQWxsb3dZaWVsZDtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkZ1bmN0aW9uRXhwcmVzc2lvbihudWxsLCBwYXJhbXMucGFyYW1zLCBtZXRob2QsIGlzR2VuZXJhdG9yKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VQcm9wZXJ0eU1ldGhvZEFzeW5jRnVuY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dZaWVsZCA9IHRoaXMuY29udGV4dC5hbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQXdhaXQgPSB0aGlzLmNvbnRleHQuYXdhaXQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmF3YWl0ID0gdHJ1ZTtcclxuXHQgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcnNlRm9ybWFsUGFyYW1ldGVycygpO1xyXG5cdCAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZChwYXJhbXMpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSBwcmV2aW91c0FsbG93WWllbGQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYXdhaXQgPSBwcmV2aW91c0F3YWl0O1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuQXN5bmNGdW5jdGlvbkV4cHJlc3Npb24obnVsbCwgcGFyYW1zLnBhcmFtcywgbWV0aG9kKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VPYmplY3RQcm9wZXJ0eUtleSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgdmFyIGtleTtcclxuXHQgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdCAgICAgICAgICAgIGNhc2UgOCAvKiBTdHJpbmdMaXRlcmFsICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgNiAvKiBOdW1lcmljTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgdG9rZW4ub2N0YWwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0T2N0YWxMaXRlcmFsKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB2YXIgcmF3ID0gdGhpcy5nZXRUb2tlblJhdyh0b2tlbik7XHJcblx0ICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuTGl0ZXJhbCh0b2tlbi52YWx1ZSwgcmF3KSk7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGNhc2UgMyAvKiBJZGVudGlmaWVyICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgMSAvKiBCb29sZWFuTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICBjYXNlIDUgLyogTnVsbExpdGVyYWwgKi86XHJcblx0ICAgICAgICAgICAgY2FzZSA0IC8qIEtleXdvcmQgKi86XHJcblx0ICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuSWRlbnRpZmllcih0b2tlbi52YWx1ZSkpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIDcgLyogUHVuY3R1YXRvciAqLzpcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09PSAnWycpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBlY3QoJ10nKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgIGtleSA9IHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGtleTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5pc1Byb3BlcnR5S2V5ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuXHQgICAgICAgIHJldHVybiAoa2V5LnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyICYmIGtleS5uYW1lID09PSB2YWx1ZSkgfHxcclxuXHQgICAgICAgICAgICAoa2V5LnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5MaXRlcmFsICYmIGtleS52YWx1ZSA9PT0gdmFsdWUpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlT2JqZWN0UHJvcGVydHkgPSBmdW5jdGlvbiAoaGFzUHJvdG8pIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgIHZhciBraW5kO1xyXG5cdCAgICAgICAgdmFyIGtleSA9IG51bGw7XHJcblx0ICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG5cdCAgICAgICAgdmFyIGNvbXB1dGVkID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgc2hvcnRoYW5kID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgaXNBc3luYyA9IGZhbHNlO1xyXG5cdCAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgIHZhciBpZCA9IHRva2VuLnZhbHVlO1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgY29tcHV0ZWQgPSB0aGlzLm1hdGNoKCdbJyk7XHJcblx0ICAgICAgICAgICAgaXNBc3luYyA9ICF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yICYmIChpZCA9PT0gJ2FzeW5jJykgJiZcclxuXHQgICAgICAgICAgICAgICAgIXRoaXMubWF0Y2goJzonKSAmJiAhdGhpcy5tYXRjaCgnKCcpICYmICF0aGlzLm1hdGNoKCcqJyk7XHJcblx0ICAgICAgICAgICAga2V5ID0gaXNBc3luYyA/IHRoaXMucGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpIDogdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5JZGVudGlmaWVyKGlkKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoKCcqJykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgY29tcHV0ZWQgPSB0aGlzLm1hdGNoKCdbJyk7XHJcblx0ICAgICAgICAgICAga2V5ID0gdGhpcy5wYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbG9va2FoZWFkUHJvcGVydHlLZXkgPSB0aGlzLnF1YWxpZmllZFByb3BlcnR5TmFtZSh0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmICFpc0FzeW5jICYmIHRva2VuLnZhbHVlID09PSAnZ2V0JyAmJiBsb29rYWhlYWRQcm9wZXJ0eUtleSkge1xyXG5cdCAgICAgICAgICAgIGtpbmQgPSAnZ2V0JztcclxuXHQgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZUdldHRlck1ldGhvZCgpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmICFpc0FzeW5jICYmIHRva2VuLnZhbHVlID09PSAnc2V0JyAmJiBsb29rYWhlYWRQcm9wZXJ0eUtleSkge1xyXG5cdCAgICAgICAgICAgIGtpbmQgPSAnc2V0JztcclxuXHQgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucGFyc2VTZXR0ZXJNZXRob2QoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IDcgLyogUHVuY3R1YXRvciAqLyAmJiB0b2tlbi52YWx1ZSA9PT0gJyonICYmIGxvb2thaGVhZFByb3BlcnR5S2V5KSB7XHJcblx0ICAgICAgICAgICAga2luZCA9ICdpbml0JztcclxuXHQgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucGFyc2VHZW5lcmF0b3JNZXRob2QoKTtcclxuXHQgICAgICAgICAgICBtZXRob2QgPSB0cnVlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgaWYgKCFrZXkpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGtpbmQgPSAnaW5pdCc7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJzonKSAmJiAhaXNBc3luYykge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoIWNvbXB1dGVkICYmIHRoaXMuaXNQcm9wZXJ0eUtleShrZXksICdfX3Byb3RvX18nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1Byb3RvLnZhbHVlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuRHVwbGljYXRlUHJvdG9Qcm9wZXJ0eSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBoYXNQcm90by52YWx1ZSA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmluaGVyaXRDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaCgnKCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlID0gaXNBc3luYyA/IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZEFzeW5jRnVuY3Rpb24oKSA6IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZEZ1bmN0aW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgIG1ldGhvZCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLklkZW50aWZpZXIodG9rZW4udmFsdWUpKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJz0nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpcnN0Q292ZXJJbml0aWFsaXplZE5hbWVFcnJvciA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHNob3J0aGFuZCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgaW5pdCA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkFzc2lnbm1lbnRQYXR0ZXJuKGlkLCBpbml0KSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBzaG9ydGhhbmQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpZDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Qcm9wZXJ0eShraW5kLCBrZXksIGNvbXB1dGVkLCB2YWx1ZSwgbWV0aG9kLCBzaG9ydGhhbmQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZU9iamVjdEluaXRpYWxpemVyID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd7Jyk7XHJcblx0ICAgICAgICB2YXIgcHJvcGVydGllcyA9IFtdO1xyXG5cdCAgICAgICAgdmFyIGhhc1Byb3RvID0geyB2YWx1ZTogZmFsc2UgfTtcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5tYXRjaCgnfScpKSB7XHJcblx0ICAgICAgICAgICAgcHJvcGVydGllcy5wdXNoKHRoaXMucGFyc2VPYmplY3RQcm9wZXJ0eShoYXNQcm90bykpO1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnfScpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0Q29tbWFTZXBhcmF0b3IoKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnfScpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuT2JqZWN0RXhwcmVzc2lvbihwcm9wZXJ0aWVzKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRlbXBsYXRlLWxpdGVyYWxzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VUZW1wbGF0ZUhlYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBhc3NlcnRfMS5hc3NlcnQodGhpcy5sb29rYWhlYWQuaGVhZCwgJ1RlbXBsYXRlIGxpdGVyYWwgbXVzdCBzdGFydCB3aXRoIGEgdGVtcGxhdGUgaGVhZCcpO1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICB2YXIgcmF3ID0gdG9rZW4udmFsdWU7XHJcblx0ICAgICAgICB2YXIgY29va2VkID0gdG9rZW4uY29va2VkO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVGVtcGxhdGVFbGVtZW50KHsgcmF3OiByYXcsIGNvb2tlZDogY29va2VkIH0sIHRva2VuLnRhaWwpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRlbXBsYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGlmICh0aGlzLmxvb2thaGVhZC50eXBlICE9PSAxMCAvKiBUZW1wbGF0ZSAqLykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgdmFyIHJhdyA9IHRva2VuLnZhbHVlO1xyXG5cdCAgICAgICAgdmFyIGNvb2tlZCA9IHRva2VuLmNvb2tlZDtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlRlbXBsYXRlRWxlbWVudCh7IHJhdzogcmF3LCBjb29rZWQ6IGNvb2tlZCB9LCB0b2tlbi50YWlsKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VUZW1wbGF0ZUxpdGVyYWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGV4cHJlc3Npb25zID0gW107XHJcblx0ICAgICAgICB2YXIgcXVhc2lzID0gW107XHJcblx0ICAgICAgICB2YXIgcXVhc2kgPSB0aGlzLnBhcnNlVGVtcGxhdGVIZWFkKCk7XHJcblx0ICAgICAgICBxdWFzaXMucHVzaChxdWFzaSk7XHJcblx0ICAgICAgICB3aGlsZSAoIXF1YXNpLnRhaWwpIHtcclxuXHQgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMucGFyc2VFeHByZXNzaW9uKCkpO1xyXG5cdCAgICAgICAgICAgIHF1YXNpID0gdGhpcy5wYXJzZVRlbXBsYXRlRWxlbWVudCgpO1xyXG5cdCAgICAgICAgICAgIHF1YXNpcy5wdXNoKHF1YXNpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlRlbXBsYXRlTGl0ZXJhbChxdWFzaXMsIGV4cHJlc3Npb25zKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdyb3VwaW5nLW9wZXJhdG9yXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuID0gZnVuY3Rpb24gKGV4cHIpIHtcclxuXHQgICAgICAgIHN3aXRjaCAoZXhwci50eXBlKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllcjpcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5NZW1iZXJFeHByZXNzaW9uOlxyXG5cdCAgICAgICAgICAgIGNhc2Ugc3ludGF4XzEuU3ludGF4LlJlc3RFbGVtZW50OlxyXG5cdCAgICAgICAgICAgIGNhc2Ugc3ludGF4XzEuU3ludGF4LkFzc2lnbm1lbnRQYXR0ZXJuOlxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5TcHJlYWRFbGVtZW50OlxyXG5cdCAgICAgICAgICAgICAgICBleHByLnR5cGUgPSBzeW50YXhfMS5TeW50YXguUmVzdEVsZW1lbnQ7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIuYXJndW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5BcnJheUV4cHJlc3Npb246XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIudHlwZSA9IHN5bnRheF8xLlN5bnRheC5BcnJheVBhdHRlcm47XHJcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwci5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGV4cHIuZWxlbWVudHNbaV0gIT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByLmVsZW1lbnRzW2ldKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5PYmplY3RFeHByZXNzaW9uOlxyXG5cdCAgICAgICAgICAgICAgICBleHByLnR5cGUgPSBzeW50YXhfMS5TeW50YXguT2JqZWN0UGF0dGVybjtcclxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHByLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIucHJvcGVydGllc1tpXS52YWx1ZSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguQXNzaWdubWVudEV4cHJlc3Npb246XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIudHlwZSA9IHN5bnRheF8xLlN5bnRheC5Bc3NpZ25tZW50UGF0dGVybjtcclxuXHQgICAgICAgICAgICAgICAgZGVsZXRlIGV4cHIub3BlcmF0b3I7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIubGVmdCk7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgIC8vIEFsbG93IG90aGVyIG5vZGUgdHlwZSBmb3IgdG9sZXJhbnQgcGFyc2luZy5cclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VHcm91cEV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgZXhwcjtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcoJyk7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnKScpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJz0+JykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5leHBlY3QoJz0+Jyk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGV4cHIgPSB7XHJcblx0ICAgICAgICAgICAgICAgIHR5cGU6IEFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXHJcblx0ICAgICAgICAgICAgICAgIHBhcmFtczogW10sXHJcblx0ICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZVxyXG5cdCAgICAgICAgICAgIH07XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB2YXIgc3RhcnRUb2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnLi4uJykpIHtcclxuXHQgICAgICAgICAgICAgICAgZXhwciA9IHRoaXMucGFyc2VSZXN0RWxlbWVudChwYXJhbXMpO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnKScpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJz0+JykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCc9PicpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbZXhwcl0sXHJcblx0ICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2VcclxuXHQgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBhcnJvdyA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmluaGVyaXRDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJywnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGV4cHJlc3Npb25zID0gW107XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHIpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDIgLyogRU9GICovKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCcsJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJyknKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cHJlc3Npb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByZXNzaW9uc1tpXSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyb3cgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQXJyb3dQYXJhbWV0ZXJQbGFjZUhvbGRlcixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczogZXhwcmVzc2lvbnMsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2VcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaCgnLi4uJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaCh0aGlzLnBhcnNlUmVzdEVsZW1lbnQocGFyYW1zKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcpJyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnPT4nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBlY3QoJz0+Jyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oZXhwcmVzc2lvbnNbaV0pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93ID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwciA9IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGV4cHJlc3Npb25zLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycm93KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghYXJyb3cpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuU2VxdWVuY2VFeHByZXNzaW9uKGV4cHJlc3Npb25zKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKCFhcnJvdykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCc9PicpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cHIudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LklkZW50aWZpZXIgJiYgZXhwci5uYW1lID09PSAneWllbGQnKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycm93ID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwciA9IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtleHByXSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFycm93KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHByLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5TZXF1ZW5jZUV4cHJlc3Npb24pIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwci5leHByZXNzaW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGV4cHIuZXhwcmVzc2lvbnNbaV0pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oZXhwcik7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSAoZXhwci50eXBlID09PSBzeW50YXhfMS5TeW50YXguU2VxdWVuY2VFeHByZXNzaW9uID8gZXhwci5leHByZXNzaW9ucyA6IFtleHByXSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cHIgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbWV0ZXJzLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1sZWZ0LWhhbmQtc2lkZS1leHByZXNzaW9uc1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXJndW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJygnKTtcclxuXHQgICAgICAgIHZhciBhcmdzID0gW107XHJcblx0ICAgICAgICBpZiAoIXRoaXMubWF0Y2goJyknKSkge1xyXG5cdCAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5tYXRjaCgnLi4uJykgPyB0aGlzLnBhcnNlU3ByZWFkRWxlbWVudCgpIDpcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICBhcmdzLnB1c2goZXhwcik7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcpJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0Q29tbWFTZXBhcmF0b3IoKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJyknKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnKScpO1xyXG5cdCAgICAgICAgcmV0dXJuIGFyZ3M7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuaXNJZGVudGlmaWVyTmFtZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG5cdCAgICAgICAgcmV0dXJuIHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLyB8fFxyXG5cdCAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IDQgLyogS2V5d29yZCAqLyB8fFxyXG5cdCAgICAgICAgICAgIHRva2VuLnR5cGUgPT09IDEgLyogQm9vbGVhbkxpdGVyYWwgKi8gfHxcclxuXHQgICAgICAgICAgICB0b2tlbi50eXBlID09PSA1IC8qIE51bGxMaXRlcmFsICovO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlSWRlbnRpZmllck5hbWUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIHRva2VuID0gdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIGlmICghdGhpcy5pc0lkZW50aWZpZXJOYW1lKHRva2VuKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuSWRlbnRpZmllcih0b2tlbi52YWx1ZSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlTmV3RXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllck5hbWUoKTtcclxuXHQgICAgICAgIGFzc2VydF8xLmFzc2VydChpZC5uYW1lID09PSAnbmV3JywgJ05ldyBleHByZXNzaW9uIG11c3Qgc3RhcnQgd2l0aCBgbmV3YCcpO1xyXG5cdCAgICAgICAgdmFyIGV4cHI7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnLicpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5sb29rYWhlYWQudHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmIHRoaXMuY29udGV4dC5pbkZ1bmN0aW9uQm9keSAmJiB0aGlzLmxvb2thaGVhZC52YWx1ZSA9PT0gJ3RhcmdldCcpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKCk7XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSBuZXcgTm9kZS5NZXRhUHJvcGVydHkoaWQsIHByb3BlcnR5KTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHZhciBjYWxsZWUgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUxlZnRIYW5kU2lkZUV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgIHZhciBhcmdzID0gdGhpcy5tYXRjaCgnKCcpID8gdGhpcy5wYXJzZUFyZ3VtZW50cygpIDogW107XHJcblx0ICAgICAgICAgICAgZXhwciA9IG5ldyBOb2RlLk5ld0V4cHJlc3Npb24oY2FsbGVlLCBhcmdzKTtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIGV4cHIpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXN5bmNBcmd1bWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBhcmcgPSB0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5maXJzdENvdmVySW5pdGlhbGl6ZWROYW1lRXJyb3IgPSBudWxsO1xyXG5cdCAgICAgICAgcmV0dXJuIGFyZztcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFzeW5jQXJndW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJygnKTtcclxuXHQgICAgICAgIHZhciBhcmdzID0gW107XHJcblx0ICAgICAgICBpZiAoIXRoaXMubWF0Y2goJyknKSkge1xyXG5cdCAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBleHByID0gdGhpcy5tYXRjaCgnLi4uJykgPyB0aGlzLnBhcnNlU3ByZWFkRWxlbWVudCgpIDpcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXN5bmNBcmd1bWVudCk7XHJcblx0ICAgICAgICAgICAgICAgIGFyZ3MucHVzaChleHByKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJyknKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgdGhpcy5leHBlY3RDb21tYVNlcGFyYXRvcigpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnKScpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcpJyk7XHJcblx0ICAgICAgICByZXR1cm4gYXJncztcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUxlZnRIYW5kU2lkZUV4cHJlc3Npb25BbGxvd0NhbGwgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgc3RhcnRUb2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgdmFyIG1heWJlQXN5bmMgPSB0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2FzeW5jJyk7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNBbGxvd0luID0gdGhpcy5jb250ZXh0LmFsbG93SW47XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dJbiA9IHRydWU7XHJcblx0ICAgICAgICB2YXIgZXhwcjtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnc3VwZXInKSAmJiB0aGlzLmNvbnRleHQuaW5GdW5jdGlvbkJvZHkpIHtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShleHByLCBuZXcgTm9kZS5TdXBlcigpKTtcclxuXHQgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJygnKSAmJiAhdGhpcy5tYXRjaCgnLicpICYmICF0aGlzLm1hdGNoKCdbJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLm1hdGNoS2V5d29yZCgnbmV3JykgPyB0aGlzLnBhcnNlTmV3RXhwcmVzc2lvbiA6IHRoaXMucGFyc2VQcmltYXJ5RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcuJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcuJyk7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucGFyc2VJZGVudGlmaWVyTmFtZSgpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuU3RhdGljTWVtYmVyRXhwcmVzc2lvbihleHByLCBwcm9wZXJ0eSkpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoKCcoJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGFzeW5jQXJyb3cgPSBtYXliZUFzeW5jICYmIChzdGFydFRva2VuLmxpbmVOdW1iZXIgPT09IHRoaXMubG9va2FoZWFkLmxpbmVOdW1iZXIpO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXN5bmNBcnJvdyA/IHRoaXMucGFyc2VBc3luY0FyZ3VtZW50cygpIDogdGhpcy5wYXJzZUFyZ3VtZW50cygpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuQ2FsbEV4cHJlc3Npb24oZXhwciwgYXJncykpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoYXN5bmNBcnJvdyAmJiB0aGlzLm1hdGNoKCc9PicpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihhcmdzW2ldKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGV4cHIgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogQXJyb3dQYXJhbWV0ZXJQbGFjZUhvbGRlcixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGFyZ3MsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWVcclxuXHQgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaCgnWycpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnWycpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnXScpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuQ29tcHV0ZWRNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgPT09IDEwIC8qIFRlbXBsYXRlICovICYmIHRoaXMubG9va2FoZWFkLmhlYWQpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIHF1YXNpID0gdGhpcy5wYXJzZVRlbXBsYXRlTGl0ZXJhbCgpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uKGV4cHIsIHF1YXNpKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlU3VwZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdzdXBlcicpO1xyXG5cdCAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCdbJykgJiYgIXRoaXMubWF0Y2goJy4nKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuU3VwZXIoKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgYXNzZXJ0XzEuYXNzZXJ0KHRoaXMuY29udGV4dC5hbGxvd0luLCAnY2FsbGVlIG9mIG5ldyBleHByZXNzaW9uIGFsd2F5cyBhbGxvdyBpbiBrZXl3b3JkLicpO1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSh0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICB2YXIgZXhwciA9ICh0aGlzLm1hdGNoS2V5d29yZCgnc3VwZXInKSAmJiB0aGlzLmNvbnRleHQuaW5GdW5jdGlvbkJvZHkpID8gdGhpcy5wYXJzZVN1cGVyKCkgOlxyXG5cdCAgICAgICAgICAgIHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLm1hdGNoS2V5d29yZCgnbmV3JykgPyB0aGlzLnBhcnNlTmV3RXhwcmVzc2lvbiA6IHRoaXMucGFyc2VQcmltYXJ5RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCdbJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCdbJyk7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlRXhwcmVzc2lvbik7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCddJyk7XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkNvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbihleHByLCBwcm9wZXJ0eSkpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoKCcuJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcuJyk7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucGFyc2VJZGVudGlmaWVyTmFtZSgpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5TdGF0aWNNZW1iZXJFeHByZXNzaW9uKGV4cHIsIHByb3BlcnR5KSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgPT09IDEwIC8qIFRlbXBsYXRlICovICYmIHRoaXMubG9va2FoZWFkLmhlYWQpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIHF1YXNpID0gdGhpcy5wYXJzZVRlbXBsYXRlTGl0ZXJhbCgpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5UYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24oZXhwciwgcXVhc2kpKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy11cGRhdGUtZXhwcmVzc2lvbnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVVwZGF0ZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgZXhwcjtcclxuXHQgICAgICAgIHZhciBzdGFydFRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnKysnKSB8fCB0aGlzLm1hdGNoKCctLScpKSB7XHJcblx0ICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKTtcclxuXHQgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIGV4cHIgPSB0aGlzLmluaGVyaXRDb3ZlckdyYW1tYXIodGhpcy5wYXJzZVVuYXJ5RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgZXhwci50eXBlID09PSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllciAmJiB0aGlzLnNjYW5uZXIuaXNSZXN0cmljdGVkV29yZChleHByLm5hbWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdExIU1ByZWZpeCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCkge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5JbnZhbGlkTEhTSW5Bc3NpZ25tZW50KTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdmFyIHByZWZpeCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVXBkYXRlRXhwcmVzc2lvbih0b2tlbi52YWx1ZSwgZXhwciwgcHJlZml4KSk7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKTtcclxuXHQgICAgICAgICAgICBpZiAoIXRoaXMuaGFzTGluZVRlcm1pbmF0b3IgJiYgdGhpcy5sb29rYWhlYWQudHlwZSA9PT0gNyAvKiBQdW5jdHVhdG9yICovKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcrKycpIHx8IHRoaXMubWF0Y2goJy0tJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0ICYmIGV4cHIudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LklkZW50aWZpZXIgJiYgdGhpcy5zY2FubmVyLmlzUmVzdHJpY3RlZFdvcmQoZXhwci5uYW1lKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdExIU1Bvc3RmaXgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZExIU0luQXNzaWdubWVudCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIG9wZXJhdG9yID0gdGhpcy5uZXh0VG9rZW4oKS52YWx1ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwcmVmaXggPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKHRoaXMuc3RhcnROb2RlKHN0YXJ0VG9rZW4pLCBuZXcgTm9kZS5VcGRhdGVFeHByZXNzaW9uKG9wZXJhdG9yLCBleHByLCBwcmVmaXgpKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy11bmFyeS1vcGVyYXRvcnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUF3YWl0RXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgdmFyIGFyZ3VtZW50ID0gdGhpcy5wYXJzZVVuYXJ5RXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuQXdhaXRFeHByZXNzaW9uKGFyZ3VtZW50KSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VVbmFyeUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgZXhwcjtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoKCcrJykgfHwgdGhpcy5tYXRjaCgnLScpIHx8IHRoaXMubWF0Y2goJ34nKSB8fCB0aGlzLm1hdGNoKCchJykgfHxcclxuXHQgICAgICAgICAgICB0aGlzLm1hdGNoS2V5d29yZCgnZGVsZXRlJykgfHwgdGhpcy5tYXRjaEtleXdvcmQoJ3ZvaWQnKSB8fCB0aGlzLm1hdGNoS2V5d29yZCgndHlwZW9mJykpIHtcclxuXHQgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuc3RhcnROb2RlKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIGV4cHIgPSB0aGlzLmluaGVyaXRDb3ZlckdyYW1tYXIodGhpcy5wYXJzZVVuYXJ5RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVW5hcnlFeHByZXNzaW9uKHRva2VuLnZhbHVlLCBleHByKSk7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgZXhwci5vcGVyYXRvciA9PT0gJ2RlbGV0ZScgJiYgZXhwci5hcmd1bWVudC50eXBlID09PSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllcikge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3REZWxldGUpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQmluZGluZ0VsZW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRoaXMuY29udGV4dC5hd2FpdCAmJiB0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2F3YWl0JykpIHtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZUF3YWl0RXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMucGFyc2VVcGRhdGVFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gZXhwcjtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUV4cG9uZW50aWF0aW9uRXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydFRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICB2YXIgZXhwciA9IHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLnBhcnNlVW5hcnlFeHByZXNzaW9uKTtcclxuXHQgICAgICAgIGlmIChleHByLnR5cGUgIT09IHN5bnRheF8xLlN5bnRheC5VbmFyeUV4cHJlc3Npb24gJiYgdGhpcy5tYXRjaCgnKionKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgdmFyIGxlZnQgPSBleHByO1xyXG5cdCAgICAgICAgICAgIHZhciByaWdodCA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlRXhwb25lbnRpYXRpb25FeHByZXNzaW9uKTtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuQmluYXJ5RXhwcmVzc2lvbignKionLCBsZWZ0LCByaWdodCkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGV4cHI7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWV4cC1vcGVyYXRvclxyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1tdWx0aXBsaWNhdGl2ZS1vcGVyYXRvcnNcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYWRkaXRpdmUtb3BlcmF0b3JzXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWJpdHdpc2Utc2hpZnQtb3BlcmF0b3JzXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlbGF0aW9uYWwtb3BlcmF0b3JzXHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWVxdWFsaXR5LW9wZXJhdG9yc1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1iaW5hcnktYml0d2lzZS1vcGVyYXRvcnNcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYmluYXJ5LWxvZ2ljYWwtb3BlcmF0b3JzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuYmluYXJ5UHJlY2VkZW5jZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG5cdCAgICAgICAgdmFyIG9wID0gdG9rZW4udmFsdWU7XHJcblx0ICAgICAgICB2YXIgcHJlY2VkZW5jZTtcclxuXHQgICAgICAgIGlmICh0b2tlbi50eXBlID09PSA3IC8qIFB1bmN0dWF0b3IgKi8pIHtcclxuXHQgICAgICAgICAgICBwcmVjZWRlbmNlID0gdGhpcy5vcGVyYXRvclByZWNlZGVuY2Vbb3BdIHx8IDA7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmICh0b2tlbi50eXBlID09PSA0IC8qIEtleXdvcmQgKi8pIHtcclxuXHQgICAgICAgICAgICBwcmVjZWRlbmNlID0gKG9wID09PSAnaW5zdGFuY2VvZicgfHwgKHRoaXMuY29udGV4dC5hbGxvd0luICYmIG9wID09PSAnaW4nKSkgPyA3IDogMDtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHByZWNlZGVuY2UgPSAwO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHByZWNlZGVuY2U7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VCaW5hcnlFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0VG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgIHZhciBleHByID0gdGhpcy5pbmhlcml0Q292ZXJHcmFtbWFyKHRoaXMucGFyc2VFeHBvbmVudGlhdGlvbkV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgdmFyIHRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICB2YXIgcHJlYyA9IHRoaXMuYmluYXJ5UHJlY2VkZW5jZSh0b2tlbik7XHJcblx0ICAgICAgICBpZiAocHJlYyA+IDApIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgIHZhciBtYXJrZXJzID0gW3N0YXJ0VG9rZW4sIHRoaXMubG9va2FoZWFkXTtcclxuXHQgICAgICAgICAgICB2YXIgbGVmdCA9IGV4cHI7XHJcblx0ICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGhpcy5pc29sYXRlQ292ZXJHcmFtbWFyKHRoaXMucGFyc2VFeHBvbmVudGlhdGlvbkV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgIHZhciBzdGFjayA9IFtsZWZ0LCB0b2tlbi52YWx1ZSwgcmlnaHRdO1xyXG5cdCAgICAgICAgICAgIHZhciBwcmVjZWRlbmNlcyA9IFtwcmVjXTtcclxuXHQgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG5cdCAgICAgICAgICAgICAgICBwcmVjID0gdGhpcy5iaW5hcnlQcmVjZWRlbmNlKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHByZWMgPD0gMCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgLy8gUmVkdWNlOiBtYWtlIGEgYmluYXJ5IGV4cHJlc3Npb24gZnJvbSB0aGUgdGhyZWUgdG9wbW9zdCBlbnRyaWVzLlxyXG5cdCAgICAgICAgICAgICAgICB3aGlsZSAoKHN0YWNrLmxlbmd0aCA+IDIpICYmIChwcmVjIDw9IHByZWNlZGVuY2VzW3ByZWNlZGVuY2VzLmxlbmd0aCAtIDFdKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSBzdGFjay5wb3AoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBvcGVyYXRvciA9IHN0YWNrLnBvcCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgcHJlY2VkZW5jZXMucG9wKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gc3RhY2sucG9wKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBtYXJrZXJzLnBvcCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZShtYXJrZXJzW21hcmtlcnMubGVuZ3RoIC0gMV0pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RhY2sucHVzaCh0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIGxlZnQsIHJpZ2h0KSkpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIC8vIFNoaWZ0LlxyXG5cdCAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMubmV4dFRva2VuKCkudmFsdWUpO1xyXG5cdCAgICAgICAgICAgICAgICBwcmVjZWRlbmNlcy5wdXNoKHByZWMpO1xyXG5cdCAgICAgICAgICAgICAgICBtYXJrZXJzLnB1c2godGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlRXhwb25lbnRpYXRpb25FeHByZXNzaW9uKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIC8vIEZpbmFsIHJlZHVjZSB0byBjbGVhbi11cCB0aGUgc3RhY2suXHJcblx0ICAgICAgICAgICAgdmFyIGkgPSBzdGFjay5sZW5ndGggLSAxO1xyXG5cdCAgICAgICAgICAgIGV4cHIgPSBzdGFja1tpXTtcclxuXHQgICAgICAgICAgICBtYXJrZXJzLnBvcCgpO1xyXG5cdCAgICAgICAgICAgIHdoaWxlIChpID4gMSkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuc3RhcnROb2RlKG1hcmtlcnMucG9wKCkpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBzdGFja1tpIC0gMV07XHJcblx0ICAgICAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkJpbmFyeUV4cHJlc3Npb24ob3BlcmF0b3IsIHN0YWNrW2kgLSAyXSwgZXhwcikpO1xyXG5cdCAgICAgICAgICAgICAgICBpIC09IDI7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGV4cHI7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNvbmRpdGlvbmFsLW9wZXJhdG9yXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VDb25kaXRpb25hbEV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgc3RhcnRUb2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgdmFyIGV4cHIgPSB0aGlzLmluaGVyaXRDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUJpbmFyeUV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2goJz8nKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dJbiA9IHRoaXMuY29udGV4dC5hbGxvd0luO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd0luID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICB2YXIgY29uc2VxdWVudCA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd0luID0gcHJldmlvdXNBbGxvd0luO1xyXG5cdCAgICAgICAgICAgIHRoaXMuZXhwZWN0KCc6Jyk7XHJcblx0ICAgICAgICAgICAgdmFyIGFsdGVybmF0ZSA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmFsaXplKHRoaXMuc3RhcnROb2RlKHN0YXJ0VG9rZW4pLCBuZXcgTm9kZS5Db25kaXRpb25hbEV4cHJlc3Npb24oZXhwciwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKSk7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gZXhwcjtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXNzaWdubWVudC1vcGVyYXRvcnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5jaGVja1BhdHRlcm5QYXJhbSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXJhbSkge1xyXG5cdCAgICAgICAgc3dpdGNoIChwYXJhbS50eXBlKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllcjpcclxuXHQgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZVBhcmFtKG9wdGlvbnMsIHBhcmFtLCBwYXJhbS5uYW1lKTtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguUmVzdEVsZW1lbnQ6XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQYXR0ZXJuUGFyYW0ob3B0aW9ucywgcGFyYW0uYXJndW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5Bc3NpZ25tZW50UGF0dGVybjpcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jaGVja1BhdHRlcm5QYXJhbShvcHRpb25zLCBwYXJhbS5sZWZ0KTtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguQXJyYXlQYXR0ZXJuOlxyXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0uZWxlbWVudHNbaV0gIT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrUGF0dGVyblBhcmFtKG9wdGlvbnMsIHBhcmFtLmVsZW1lbnRzW2ldKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlIHN5bnRheF8xLlN5bnRheC5PYmplY3RQYXR0ZXJuOlxyXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQYXR0ZXJuUGFyYW0ob3B0aW9ucywgcGFyYW0ucHJvcGVydGllc1tpXS52YWx1ZSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBvcHRpb25zLnNpbXBsZSA9IG9wdGlvbnMuc2ltcGxlICYmIChwYXJhbSBpbnN0YW5jZW9mIE5vZGUuSWRlbnRpZmllcik7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucmVpbnRlcnByZXRBc0NvdmVyRm9ybWFsc0xpc3QgPSBmdW5jdGlvbiAoZXhwcikge1xyXG5cdCAgICAgICAgdmFyIHBhcmFtcyA9IFtleHByXTtcclxuXHQgICAgICAgIHZhciBvcHRpb25zO1xyXG5cdCAgICAgICAgdmFyIGFzeW5jQXJyb3cgPSBmYWxzZTtcclxuXHQgICAgICAgIHN3aXRjaCAoZXhwci50eXBlKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllcjpcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSBBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyOlxyXG5cdCAgICAgICAgICAgICAgICBwYXJhbXMgPSBleHByLnBhcmFtcztcclxuXHQgICAgICAgICAgICAgICAgYXN5bmNBcnJvdyA9IGV4cHIuYXN5bmM7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgb3B0aW9ucyA9IHtcclxuXHQgICAgICAgICAgICBzaW1wbGU6IHRydWUsXHJcblx0ICAgICAgICAgICAgcGFyYW1TZXQ6IHt9XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyArK2kpIHtcclxuXHQgICAgICAgICAgICB2YXIgcGFyYW0gPSBwYXJhbXNbaV07XHJcblx0ICAgICAgICAgICAgaWYgKHBhcmFtLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5Bc3NpZ25tZW50UGF0dGVybikge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAocGFyYW0ucmlnaHQudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LllpZWxkRXhwcmVzc2lvbikge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtLnJpZ2h0LmFyZ3VtZW50KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBwYXJhbS5yaWdodC50eXBlID0gc3ludGF4XzEuU3ludGF4LklkZW50aWZpZXI7XHJcblx0ICAgICAgICAgICAgICAgICAgICBwYXJhbS5yaWdodC5uYW1lID0gJ3lpZWxkJztcclxuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwYXJhbS5yaWdodC5hcmd1bWVudDtcclxuXHQgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwYXJhbS5yaWdodC5kZWxlZ2F0ZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChhc3luY0Fycm93ICYmIHBhcmFtLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyICYmIHBhcmFtLm5hbWUgPT09ICdhd2FpdCcpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRoaXMuY2hlY2tQYXR0ZXJuUGFyYW0ob3B0aW9ucywgcGFyYW0pO1xyXG5cdCAgICAgICAgICAgIHBhcmFtc1tpXSA9IHBhcmFtO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgfHwgIXRoaXMuY29udGV4dC5hbGxvd1lpZWxkKSB7XHJcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyArK2kpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIHBhcmFtID0gcGFyYW1zW2ldO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAocGFyYW0udHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LllpZWxkRXhwcmVzc2lvbikge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAob3B0aW9ucy5tZXNzYWdlID09PSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFBhcmFtRHVwZSkge1xyXG5cdCAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMuY29udGV4dC5zdHJpY3QgPyBvcHRpb25zLnN0cmljdGVkIDogb3B0aW9ucy5maXJzdFJlc3RyaWN0ZWQ7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbiwgb3B0aW9ucy5tZXNzYWdlKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgc2ltcGxlOiBvcHRpb25zLnNpbXBsZSxcclxuXHQgICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcclxuXHQgICAgICAgICAgICBzdHJpY3RlZDogb3B0aW9ucy5zdHJpY3RlZCxcclxuXHQgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQ6IG9wdGlvbnMuZmlyc3RSZXN0cmljdGVkLFxyXG5cdCAgICAgICAgICAgIG1lc3NhZ2U6IG9wdGlvbnMubWVzc2FnZVxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGV4cHI7XHJcblx0ICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5hbGxvd1lpZWxkICYmIHRoaXMubWF0Y2hLZXl3b3JkKCd5aWVsZCcpKSB7XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMucGFyc2VZaWVsZEV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHZhciBzdGFydFRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICAgICAgdmFyIHRva2VuID0gc3RhcnRUb2tlbjtcclxuXHQgICAgICAgICAgICBleHByID0gdGhpcy5wYXJzZUNvbmRpdGlvbmFsRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSAzIC8qIElkZW50aWZpZXIgKi8gJiYgKHRva2VuLmxpbmVOdW1iZXIgPT09IHRoaXMubG9va2FoZWFkLmxpbmVOdW1iZXIpICYmIHRva2VuLnZhbHVlID09PSAnYXN5bmMnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvb2thaGVhZC50eXBlID09PSAzIC8qIElkZW50aWZpZXIgKi8gfHwgdGhpcy5tYXRjaEtleXdvcmQoJ3lpZWxkJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBhcmcgPSB0aGlzLnBhcnNlUHJpbWFyeUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRFeHByZXNzaW9uQXNQYXR0ZXJuKGFyZyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBleHByID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFycm93UGFyYW1ldGVyUGxhY2VIb2xkZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbYXJnXSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoZXhwci50eXBlID09PSBBcnJvd1BhcmFtZXRlclBsYWNlSG9sZGVyIHx8IHRoaXMubWF0Y2goJz0+JykpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyb3ctZnVuY3Rpb24tZGVmaW5pdGlvbnNcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuaXNCaW5kaW5nRWxlbWVudCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgaXNBc3luYyA9IGV4cHIuYXN5bmM7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5yZWludGVycHJldEFzQ292ZXJGb3JtYWxzTGlzdChleHByKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKGxpc3QpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gbnVsbDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1N0cmljdCA9IHRoaXMuY29udGV4dC5zdHJpY3Q7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNBbGxvd1N0cmljdERpcmVjdGl2ZSA9IHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZSA9IGxpc3Quc2ltcGxlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dZaWVsZCA9IHRoaXMuY29udGV4dC5hbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQXdhaXQgPSB0aGlzLmNvbnRleHQuYXdhaXQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYXdhaXQgPSBpc0FzeW5jO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCc9PicpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGJvZHkgPSB2b2lkIDA7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgneycpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dJbiA9IHRoaXMuY29udGV4dC5hbGxvd0luO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd0luID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBib2R5ID0gdGhpcy5wYXJzZUZ1bmN0aW9uU291cmNlRWxlbWVudHMoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBleHByZXNzaW9uID0gYm9keS50eXBlICE9PSBzeW50YXhfMS5TeW50YXguQmxvY2tTdGF0ZW1lbnQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBsaXN0LmZpcnN0UmVzdHJpY3RlZCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4obGlzdC5maXJzdFJlc3RyaWN0ZWQsIGxpc3QubWVzc2FnZSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBsaXN0LnN0cmljdGVkKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbihsaXN0LnN0cmljdGVkLCBsaXN0Lm1lc3NhZ2UpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgZXhwciA9IGlzQXN5bmMgPyB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkFzeW5jQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24obGlzdC5wYXJhbXMsIGJvZHksIGV4cHJlc3Npb24pKSA6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbihsaXN0LnBhcmFtcywgYm9keSwgZXhwcmVzc2lvbikpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93U3RyaWN0RGlyZWN0aXZlID0gcHJldmlvdXNBbGxvd1N0cmljdERpcmVjdGl2ZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gcHJldmlvdXNBbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmF3YWl0ID0gcHJldmlvdXNBd2FpdDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2hBc3NpZ24oKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZExIU0luQXNzaWdubWVudCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBleHByLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZXhwcjtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zY2FubmVyLmlzUmVzdHJpY3RlZFdvcmQoaWQubmFtZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RMSFNBc3NpZ25tZW50KTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQoaWQubmFtZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnPScpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmlzQXNzaWdubWVudFRhcmdldCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlaW50ZXJwcmV0RXhwcmVzc2lvbkFzUGF0dGVybihleHByKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBvcGVyYXRvciA9IHRva2VuLnZhbHVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGhpcy5pc29sYXRlQ292ZXJHcmFtbWFyKHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICAgICAgICAgICAgICBleHByID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShzdGFydFRva2VuKSwgbmV3IE5vZGUuQXNzaWdubWVudEV4cHJlc3Npb24ob3BlcmF0b3IsIGV4cHIsIHJpZ2h0KSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlyc3RDb3ZlckluaXRpYWxpemVkTmFtZUVycm9yID0gbnVsbDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBleHByO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1jb21tYS1vcGVyYXRvclxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydFRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICB2YXIgZXhwciA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2goJywnKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBleHByZXNzaW9ucyA9IFtdO1xyXG5cdCAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcik7XHJcblx0ICAgICAgICAgICAgd2hpbGUgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDIgLyogRU9GICovKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnLCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZXhwciA9IHRoaXMuZmluYWxpemUodGhpcy5zdGFydE5vZGUoc3RhcnRUb2tlbiksIG5ldyBOb2RlLlNlcXVlbmNlRXhwcmVzc2lvbihleHByZXNzaW9ucykpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGV4cHI7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWJsb2NrXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VTdGF0ZW1lbnRMaXN0SXRlbSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGF0ZW1lbnQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0ID0gdHJ1ZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc0JpbmRpbmdFbGVtZW50ID0gdHJ1ZTtcclxuXHQgICAgICAgIGlmICh0aGlzLmxvb2thaGVhZC50eXBlID09PSA0IC8qIEtleXdvcmQgKi8pIHtcclxuXHQgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubG9va2FoZWFkLnZhbHVlKSB7XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ2V4cG9ydCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5pc01vZHVsZSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQsIG1lc3NhZ2VzXzEuTWVzc2FnZXMuSWxsZWdhbEV4cG9ydERlY2xhcmF0aW9uKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VFeHBvcnREZWNsYXJhdGlvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ2ltcG9ydCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5pc01vZHVsZSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQsIG1lc3NhZ2VzXzEuTWVzc2FnZXMuSWxsZWdhbEltcG9ydERlY2xhcmF0aW9uKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VJbXBvcnREZWNsYXJhdGlvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnN0JzpcclxuXHQgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VMZXhpY2FsRGVjbGFyYXRpb24oeyBpbkZvcjogZmFsc2UgfSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICBjYXNlICdjbGFzcyc6XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlQ2xhc3NEZWNsYXJhdGlvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ2xldCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLmlzTGV4aWNhbERlY2xhcmF0aW9uKCkgPyB0aGlzLnBhcnNlTGV4aWNhbERlY2xhcmF0aW9uKHsgaW5Gb3I6IGZhbHNlIH0pIDogdGhpcy5wYXJzZVN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gc3RhdGVtZW50O1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQmxvY2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJ3snKTtcclxuXHQgICAgICAgIHZhciBibG9jayA9IFtdO1xyXG5cdCAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnfScpKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBibG9jay5wdXNoKHRoaXMucGFyc2VTdGF0ZW1lbnRMaXN0SXRlbSgpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd9Jyk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5CbG9ja1N0YXRlbWVudChibG9jaykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1sZXQtYW5kLWNvbnN0LWRlY2xhcmF0aW9uc1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlTGV4aWNhbEJpbmRpbmcgPSBmdW5jdGlvbiAoa2luZCwgb3B0aW9ucykge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuXHQgICAgICAgIHZhciBpZCA9IHRoaXMucGFyc2VQYXR0ZXJuKHBhcmFtcywga2luZCk7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBpZC50eXBlID09PSBzeW50YXhfMS5TeW50YXguSWRlbnRpZmllcikge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuaXNSZXN0cmljdGVkV29yZChpZC5uYW1lKSkge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RWYXJOYW1lKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgaW5pdCA9IG51bGw7XHJcblx0ICAgICAgICBpZiAoa2luZCA9PT0gJ2NvbnN0Jykge1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaEtleXdvcmQoJ2luJykgJiYgIXRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnb2YnKSkge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnPScpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuRGVjbGFyYXRpb25NaXNzaW5nSW5pdGlhbGl6ZXIsICdjb25zdCcpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAoKCFvcHRpb25zLmluRm9yICYmIGlkLnR5cGUgIT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyKSB8fCB0aGlzLm1hdGNoKCc9JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnPScpO1xyXG5cdCAgICAgICAgICAgIGluaXQgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlZhcmlhYmxlRGVjbGFyYXRvcihpZCwgaW5pdCkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQmluZGluZ0xpc3QgPSBmdW5jdGlvbiAoa2luZCwgb3B0aW9ucykge1xyXG5cdCAgICAgICAgdmFyIGxpc3QgPSBbdGhpcy5wYXJzZUxleGljYWxCaW5kaW5nKGtpbmQsIG9wdGlvbnMpXTtcclxuXHQgICAgICAgIHdoaWxlICh0aGlzLm1hdGNoKCcsJykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLnBhcnNlTGV4aWNhbEJpbmRpbmcoa2luZCwgb3B0aW9ucykpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGxpc3Q7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUuaXNMZXhpY2FsRGVjbGFyYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnNjYW5uZXIuc2F2ZVN0YXRlKCk7XHJcblx0ICAgICAgICB0aGlzLnNjYW5uZXIuc2NhbkNvbW1lbnRzKCk7XHJcblx0ICAgICAgICB2YXIgbmV4dCA9IHRoaXMuc2Nhbm5lci5sZXgoKTtcclxuXHQgICAgICAgIHRoaXMuc2Nhbm5lci5yZXN0b3JlU3RhdGUoc3RhdGUpO1xyXG5cdCAgICAgICAgcmV0dXJuIChuZXh0LnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykgfHxcclxuXHQgICAgICAgICAgICAobmV4dC50eXBlID09PSA3IC8qIFB1bmN0dWF0b3IgKi8gJiYgbmV4dC52YWx1ZSA9PT0gJ1snKSB8fFxyXG5cdCAgICAgICAgICAgIChuZXh0LnR5cGUgPT09IDcgLyogUHVuY3R1YXRvciAqLyAmJiBuZXh0LnZhbHVlID09PSAneycpIHx8XHJcblx0ICAgICAgICAgICAgKG5leHQudHlwZSA9PT0gNCAvKiBLZXl3b3JkICovICYmIG5leHQudmFsdWUgPT09ICdsZXQnKSB8fFxyXG5cdCAgICAgICAgICAgIChuZXh0LnR5cGUgPT09IDQgLyogS2V5d29yZCAqLyAmJiBuZXh0LnZhbHVlID09PSAneWllbGQnKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUxleGljYWxEZWNsYXJhdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGtpbmQgPSB0aGlzLm5leHRUb2tlbigpLnZhbHVlO1xyXG5cdCAgICAgICAgYXNzZXJ0XzEuYXNzZXJ0KGtpbmQgPT09ICdsZXQnIHx8IGtpbmQgPT09ICdjb25zdCcsICdMZXhpY2FsIGRlY2xhcmF0aW9uIG11c3QgYmUgZWl0aGVyIGxldCBvciBjb25zdCcpO1xyXG5cdCAgICAgICAgdmFyIGRlY2xhcmF0aW9ucyA9IHRoaXMucGFyc2VCaW5kaW5nTGlzdChraW5kLCBvcHRpb25zKTtcclxuXHQgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsIGtpbmQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZGVzdHJ1Y3R1cmluZy1iaW5kaW5nLXBhdHRlcm5zXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VCaW5kaW5nUmVzdEVsZW1lbnQgPSBmdW5jdGlvbiAocGFyYW1zLCBraW5kKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJy4uLicpO1xyXG5cdCAgICAgICAgdmFyIGFyZyA9IHRoaXMucGFyc2VQYXR0ZXJuKHBhcmFtcywga2luZCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5SZXN0RWxlbWVudChhcmcpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFycmF5UGF0dGVybiA9IGZ1bmN0aW9uIChwYXJhbXMsIGtpbmQpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnWycpO1xyXG5cdCAgICAgICAgdmFyIGVsZW1lbnRzID0gW107XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMubWF0Y2goJ10nKSkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcsJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChudWxsKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcuLi4nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaCh0aGlzLnBhcnNlQmluZGluZ1Jlc3RFbGVtZW50KHBhcmFtcywga2luZCkpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKHRoaXMucGFyc2VQYXR0ZXJuV2l0aERlZmF1bHQocGFyYW1zLCBraW5kKSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCddJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcsJyk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnXScpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuQXJyYXlQYXR0ZXJuKGVsZW1lbnRzKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VQcm9wZXJ0eVBhdHRlcm4gPSBmdW5jdGlvbiAocGFyYW1zLCBraW5kKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGNvbXB1dGVkID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgc2hvcnRoYW5kID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIga2V5O1xyXG5cdCAgICAgICAgdmFyIHZhbHVlO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgIHZhciBrZXlUb2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgICAgIGtleSA9IHRoaXMucGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcclxuXHQgICAgICAgICAgICB2YXIgaW5pdCA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuSWRlbnRpZmllcihrZXlUb2tlbi52YWx1ZSkpO1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCc9JykpIHtcclxuXHQgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goa2V5VG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICBzaG9ydGhhbmQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgZXhwciA9IHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZmluYWxpemUodGhpcy5zdGFydE5vZGUoa2V5VG9rZW4pLCBuZXcgTm9kZS5Bc3NpZ25tZW50UGF0dGVybihpbml0LCBleHByKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLm1hdGNoKCc6JykpIHtcclxuXHQgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goa2V5VG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICBzaG9ydGhhbmQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICB2YWx1ZSA9IGluaXQ7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnOicpO1xyXG5cdCAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucGFyc2VQYXR0ZXJuV2l0aERlZmF1bHQocGFyYW1zLCBraW5kKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnOicpO1xyXG5cdCAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZVBhdHRlcm5XaXRoRGVmYXVsdChwYXJhbXMsIGtpbmQpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuUHJvcGVydHkoJ2luaXQnLCBrZXksIGNvbXB1dGVkLCB2YWx1ZSwgbWV0aG9kLCBzaG9ydGhhbmQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZU9iamVjdFBhdHRlcm4gPSBmdW5jdGlvbiAocGFyYW1zLCBraW5kKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBbXTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd7Jyk7XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgIHByb3BlcnRpZXMucHVzaCh0aGlzLnBhcnNlUHJvcGVydHlQYXR0ZXJuKHBhcmFtcywga2luZCkpO1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnfScpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcsJyk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJ30nKTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLk9iamVjdFBhdHRlcm4ocHJvcGVydGllcykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlUGF0dGVybiA9IGZ1bmN0aW9uIChwYXJhbXMsIGtpbmQpIHtcclxuXHQgICAgICAgIHZhciBwYXR0ZXJuO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2goJ1snKSkge1xyXG5cdCAgICAgICAgICAgIHBhdHRlcm4gPSB0aGlzLnBhcnNlQXJyYXlQYXR0ZXJuKHBhcmFtcywga2luZCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoKCd7JykpIHtcclxuXHQgICAgICAgICAgICBwYXR0ZXJuID0gdGhpcy5wYXJzZU9iamVjdFBhdHRlcm4ocGFyYW1zLCBraW5kKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnbGV0JykgJiYgKGtpbmQgPT09ICdjb25zdCcgfHwga2luZCA9PT0gJ2xldCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQsIG1lc3NhZ2VzXzEuTWVzc2FnZXMuTGV0SW5MZXhpY2FsQmluZGluZyk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgICAgICBwYXR0ZXJuID0gdGhpcy5wYXJzZVZhcmlhYmxlSWRlbnRpZmllcihraW5kKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBwYXR0ZXJuO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlUGF0dGVybldpdGhEZWZhdWx0ID0gZnVuY3Rpb24gKHBhcmFtcywga2luZCkge1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0VG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgIHZhciBwYXR0ZXJuID0gdGhpcy5wYXJzZVBhdHRlcm4ocGFyYW1zLCBraW5kKTtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoKCc9JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIHZhciBwcmV2aW91c0FsbG93WWllbGQgPSB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZDtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGhpcy5pc29sYXRlQ292ZXJHcmFtbWFyKHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbik7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSBwcmV2aW91c0FsbG93WWllbGQ7XHJcblx0ICAgICAgICAgICAgcGF0dGVybiA9IHRoaXMuZmluYWxpemUodGhpcy5zdGFydE5vZGUoc3RhcnRUb2tlbiksIG5ldyBOb2RlLkFzc2lnbm1lbnRQYXR0ZXJuKHBhdHRlcm4sIHJpZ2h0KSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gcGF0dGVybjtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdmFyaWFibGUtc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VWYXJpYWJsZUlkZW50aWZpZXIgPSBmdW5jdGlvbiAoa2luZCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gNCAvKiBLZXl3b3JkICovICYmIHRva2VuLnZhbHVlID09PSAneWllbGQnKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICghdGhpcy5jb250ZXh0LmFsbG93WWllbGQpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbik7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAodG9rZW4udHlwZSAhPT0gMyAvKiBJZGVudGlmaWVyICovKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgdG9rZW4udHlwZSA9PT0gNCAvKiBLZXl3b3JkICovICYmIHRoaXMuc2Nhbm5lci5pc1N0cmljdE1vZGVSZXNlcnZlZFdvcmQodG9rZW4udmFsdWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0UmVzZXJ2ZWRXb3JkKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0IHx8IHRva2VuLnZhbHVlICE9PSAnbGV0JyB8fCBraW5kICE9PSAndmFyJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbik7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmICgodGhpcy5jb250ZXh0LmlzTW9kdWxlIHx8IHRoaXMuY29udGV4dC5hd2FpdCkgJiYgdG9rZW4udHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmIHRva2VuLnZhbHVlID09PSAnYXdhaXQnKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5JZGVudGlmaWVyKHRva2VuLnZhbHVlKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VWYXJpYWJsZURlY2xhcmF0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgcGFyYW1zID0gW107XHJcblx0ICAgICAgICB2YXIgaWQgPSB0aGlzLnBhcnNlUGF0dGVybihwYXJhbXMsICd2YXInKTtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0ICYmIGlkLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc1Jlc3RyaWN0ZWRXb3JkKGlkLm5hbWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFZhck5hbWUpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBpbml0ID0gbnVsbDtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoKCc9JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIGluaXQgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKGlkLnR5cGUgIT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyICYmICFvcHRpb25zLmluRm9yKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJz0nKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlZhcmlhYmxlRGVjbGFyYXRvcihpZCwgaW5pdCkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cdCAgICAgICAgdmFyIG9wdCA9IHsgaW5Gb3I6IG9wdGlvbnMuaW5Gb3IgfTtcclxuXHQgICAgICAgIHZhciBsaXN0ID0gW107XHJcblx0ICAgICAgICBsaXN0LnB1c2godGhpcy5wYXJzZVZhcmlhYmxlRGVjbGFyYXRpb24ob3B0KSk7XHJcblx0ICAgICAgICB3aGlsZSAodGhpcy5tYXRjaCgnLCcpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5wYXJzZVZhcmlhYmxlRGVjbGFyYXRpb24ob3B0KSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gbGlzdDtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVZhcmlhYmxlU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgndmFyJyk7XHJcblx0ICAgICAgICB2YXIgZGVjbGFyYXRpb25zID0gdGhpcy5wYXJzZVZhcmlhYmxlRGVjbGFyYXRpb25MaXN0KHsgaW5Gb3I6IGZhbHNlIH0pO1xyXG5cdCAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5WYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywgJ3ZhcicpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZW1wdHktc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VFbXB0eVN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnOycpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRW1wdHlTdGF0ZW1lbnQoKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWV4cHJlc3Npb24tc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VFeHByZXNzaW9uU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBleHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRXhwcmVzc2lvblN0YXRlbWVudChleHByKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlmLXN0YXRlbWVudFxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlSWZDbGF1c2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiB0aGlzLm1hdGNoS2V5d29yZCgnZnVuY3Rpb24nKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdEZ1bmN0aW9uKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VJZlN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgY29uc2VxdWVudDtcclxuXHQgICAgICAgIHZhciBhbHRlcm5hdGUgPSBudWxsO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdpZicpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJygnKTtcclxuXHQgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIGlmICghdGhpcy5tYXRjaCgnKScpICYmIHRoaXMuY29uZmlnLnRvbGVyYW50KSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICBjb25zZXF1ZW50ID0gdGhpcy5maW5hbGl6ZSh0aGlzLmNyZWF0ZU5vZGUoKSwgbmV3IE5vZGUuRW1wdHlTdGF0ZW1lbnQoKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnKScpO1xyXG5cdCAgICAgICAgICAgIGNvbnNlcXVlbnQgPSB0aGlzLnBhcnNlSWZDbGF1c2UoKTtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ2Vsc2UnKSkge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICBhbHRlcm5hdGUgPSB0aGlzLnBhcnNlSWZDbGF1c2UoKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5JZlN0YXRlbWVudCh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZG8td2hpbGUtc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VEb1doaWxlU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnZG8nKTtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0luSXRlcmF0aW9uID0gdGhpcy5jb250ZXh0LmluSXRlcmF0aW9uO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmluSXRlcmF0aW9uID0gdHJ1ZTtcclxuXHQgICAgICAgIHZhciBib2R5ID0gdGhpcy5wYXJzZVN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmluSXRlcmF0aW9uID0gcHJldmlvdXNJbkl0ZXJhdGlvbjtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnd2hpbGUnKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcoJyk7XHJcblx0ICAgICAgICB2YXIgdGVzdCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICBpZiAoIXRoaXMubWF0Y2goJyknKSAmJiB0aGlzLmNvbmZpZy50b2xlcmFudCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5uZXh0VG9rZW4oKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnKScpO1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCc7JykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Eb1doaWxlU3RhdGVtZW50KGJvZHksIHRlc3QpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtd2hpbGUtc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VXaGlsZVN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgYm9keTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnd2hpbGUnKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcoJyk7XHJcblx0ICAgICAgICB2YXIgdGVzdCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICBpZiAoIXRoaXMubWF0Y2goJyknKSAmJiB0aGlzLmNvbmZpZy50b2xlcmFudCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5uZXh0VG9rZW4oKSk7XHJcblx0ICAgICAgICAgICAgYm9keSA9IHRoaXMuZmluYWxpemUodGhpcy5jcmVhdGVOb2RlKCksIG5ldyBOb2RlLkVtcHR5U3RhdGVtZW50KCkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgICAgICB2YXIgcHJldmlvdXNJbkl0ZXJhdGlvbiA9IHRoaXMuY29udGV4dC5pbkl0ZXJhdGlvbjtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuaW5JdGVyYXRpb24gPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIGJvZHkgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmluSXRlcmF0aW9uID0gcHJldmlvdXNJbkl0ZXJhdGlvbjtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLldoaWxlU3RhdGVtZW50KHRlc3QsIGJvZHkpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZm9yLXN0YXRlbWVudFxyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1mb3ItaW4tYW5kLWZvci1vZi1zdGF0ZW1lbnRzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VGb3JTdGF0ZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgaW5pdCA9IG51bGw7XHJcblx0ICAgICAgICB2YXIgdGVzdCA9IG51bGw7XHJcblx0ICAgICAgICB2YXIgdXBkYXRlID0gbnVsbDtcclxuXHQgICAgICAgIHZhciBmb3JJbiA9IHRydWU7XHJcblx0ICAgICAgICB2YXIgbGVmdCwgcmlnaHQ7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdmb3InKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcoJyk7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnOycpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoS2V5d29yZCgndmFyJykpIHtcclxuXHQgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNBbGxvd0luID0gdGhpcy5jb250ZXh0LmFsbG93SW47XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd0luID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSB0aGlzLnBhcnNlVmFyaWFibGVEZWNsYXJhdGlvbkxpc3QoeyBpbkZvcjogdHJ1ZSB9KTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93SW4gPSBwcmV2aW91c0FsbG93SW47XHJcblx0ICAgICAgICAgICAgICAgIGlmIChkZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxICYmIHRoaXMubWF0Y2hLZXl3b3JkKCdpbicpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZGVjbCA9IGRlY2xhcmF0aW9uc1swXTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChkZWNsLmluaXQgJiYgKGRlY2wuaWQudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LkFycmF5UGF0dGVybiB8fCBkZWNsLmlkLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5PYmplY3RQYXR0ZXJuIHx8IHRoaXMuY29udGV4dC5zdHJpY3QpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuRm9ySW5PZkxvb3BJbml0aWFsaXplciwgJ2Zvci1pbicpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuZmluYWxpemUoaW5pdCwgbmV3IE5vZGUuVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsICd2YXInKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGluaXQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICByaWdodCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIGlmIChkZWNsYXJhdGlvbnMubGVuZ3RoID09PSAxICYmIGRlY2xhcmF0aW9uc1swXS5pbml0ID09PSBudWxsICYmIHRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnb2YnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuZmluYWxpemUoaW5pdCwgbmV3IE5vZGUuVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsICd2YXInKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGluaXQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICByaWdodCA9IHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5pdCA9IG51bGw7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmb3JJbiA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuZmluYWxpemUoaW5pdCwgbmV3IE5vZGUuVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsICd2YXInKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnOycpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2hLZXl3b3JkKCdjb25zdCcpIHx8IHRoaXMubWF0Y2hLZXl3b3JkKCdsZXQnKSkge1xyXG5cdCAgICAgICAgICAgICAgICBpbml0ID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBraW5kID0gdGhpcy5uZXh0VG9rZW4oKS52YWx1ZTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuc3RyaWN0ICYmIHRoaXMubG9va2FoZWFkLnZhbHVlID09PSAnaW4nKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpbml0ID0gdGhpcy5maW5hbGl6ZShpbml0LCBuZXcgTm9kZS5JZGVudGlmaWVyKGtpbmQpKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gaW5pdDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGluaXQgPSBudWxsO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dJbiA9IHRoaXMuY29udGV4dC5hbGxvd0luO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93SW4gPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBkZWNsYXJhdGlvbnMgPSB0aGlzLnBhcnNlQmluZGluZ0xpc3Qoa2luZCwgeyBpbkZvcjogdHJ1ZSB9KTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd0luID0gcHJldmlvdXNBbGxvd0luO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDEgJiYgZGVjbGFyYXRpb25zWzBdLmluaXQgPT09IG51bGwgJiYgdGhpcy5tYXRjaEtleXdvcmQoJ2luJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbml0ID0gdGhpcy5maW5hbGl6ZShpbml0LCBuZXcgTm9kZS5WYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywga2luZCkpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGluaXQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGluaXQgPSBudWxsO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZGVjbGFyYXRpb25zLmxlbmd0aCA9PT0gMSAmJiBkZWNsYXJhdGlvbnNbMF0uaW5pdCA9PT0gbnVsbCAmJiB0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ29mJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbml0ID0gdGhpcy5maW5hbGl6ZShpbml0LCBuZXcgTm9kZS5WYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9ucywga2luZCkpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbGVmdCA9IGluaXQ7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgPSB0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3JJbiA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuZmluYWxpemUoaW5pdCwgbmV3IE5vZGUuVmFyaWFibGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbnMsIGtpbmQpKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGluaXRTdGFydFRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c0FsbG93SW4gPSB0aGlzLmNvbnRleHQuYWxsb3dJbjtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93SW4gPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgaW5pdCA9IHRoaXMuaW5oZXJpdENvdmVyR3JhbW1hcih0aGlzLnBhcnNlQXNzaWdubWVudEV4cHJlc3Npb24pO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dJbiA9IHByZXZpb3VzQWxsb3dJbjtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2hLZXl3b3JkKCdpbicpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dC5pc0Fzc2lnbm1lbnRUYXJnZXQgfHwgaW5pdC50eXBlID09PSBzeW50YXhfMS5TeW50YXguQXNzaWdubWVudEV4cHJlc3Npb24pIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5JbnZhbGlkTEhTSW5Gb3JJbik7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oaW5pdCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gaW5pdDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGluaXQgPSBudWxsO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnb2YnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuaXNBc3NpZ25tZW50VGFyZ2V0IHx8IGluaXQudHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LkFzc2lnbm1lbnRFeHByZXNzaW9uKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZExIU0luRm9yTG9vcCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWludGVycHJldEV4cHJlc3Npb25Bc1BhdHRlcm4oaW5pdCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gaW5pdDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpbml0ID0gbnVsbDtcclxuXHQgICAgICAgICAgICAgICAgICAgIGZvckluID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnLCcpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRTZXEgPSBbaW5pdF07XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubWF0Y2goJywnKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0U2VxLnB1c2godGhpcy5pc29sYXRlQ292ZXJHcmFtbWFyKHRoaXMucGFyc2VBc3NpZ25tZW50RXhwcmVzc2lvbikpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBpbml0ID0gdGhpcy5maW5hbGl6ZSh0aGlzLnN0YXJ0Tm9kZShpbml0U3RhcnRUb2tlbiksIG5ldyBOb2RlLlNlcXVlbmNlRXhwcmVzc2lvbihpbml0U2VxKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnOycpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHR5cGVvZiBsZWZ0ID09PSAndW5kZWZpbmVkJykge1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnOycpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRlc3QgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnOycpO1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaCgnKScpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHVwZGF0ZSA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGJvZHk7XHJcblx0ICAgICAgICBpZiAoIXRoaXMubWF0Y2goJyknKSAmJiB0aGlzLmNvbmZpZy50b2xlcmFudCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odGhpcy5uZXh0VG9rZW4oKSk7XHJcblx0ICAgICAgICAgICAgYm9keSA9IHRoaXMuZmluYWxpemUodGhpcy5jcmVhdGVOb2RlKCksIG5ldyBOb2RlLkVtcHR5U3RhdGVtZW50KCkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgICAgICB2YXIgcHJldmlvdXNJbkl0ZXJhdGlvbiA9IHRoaXMuY29udGV4dC5pbkl0ZXJhdGlvbjtcclxuXHQgICAgICAgICAgICB0aGlzLmNvbnRleHQuaW5JdGVyYXRpb24gPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIGJvZHkgPSB0aGlzLmlzb2xhdGVDb3ZlckdyYW1tYXIodGhpcy5wYXJzZVN0YXRlbWVudCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5jb250ZXh0LmluSXRlcmF0aW9uID0gcHJldmlvdXNJbkl0ZXJhdGlvbjtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiAodHlwZW9mIGxlZnQgPT09ICd1bmRlZmluZWQnKSA/XHJcblx0ICAgICAgICAgICAgdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Gb3JTdGF0ZW1lbnQoaW5pdCwgdGVzdCwgdXBkYXRlLCBib2R5KSkgOlxyXG5cdCAgICAgICAgICAgIGZvckluID8gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Gb3JJblN0YXRlbWVudChsZWZ0LCByaWdodCwgYm9keSkpIDpcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Gb3JPZlN0YXRlbWVudChsZWZ0LCByaWdodCwgYm9keSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1jb250aW51ZS1zdGF0ZW1lbnRcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNvbnRpbnVlU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnY29udGludWUnKTtcclxuXHQgICAgICAgIHZhciBsYWJlbCA9IG51bGw7XHJcblx0ICAgICAgICBpZiAodGhpcy5sb29rYWhlYWQudHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmICF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5wYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIGxhYmVsID0gaWQ7XHJcblx0ICAgICAgICAgICAgdmFyIGtleSA9ICckJyArIGlkLm5hbWU7XHJcblx0ICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5jb250ZXh0LmxhYmVsU2V0LCBrZXkpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLlVua25vd25MYWJlbCwgaWQubmFtZSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICBpZiAobGFiZWwgPT09IG51bGwgJiYgIXRoaXMuY29udGV4dC5pbkl0ZXJhdGlvbikge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLklsbGVnYWxDb250aW51ZSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Db250aW51ZVN0YXRlbWVudChsYWJlbCkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1icmVhay1zdGF0ZW1lbnRcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUJyZWFrU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnYnJlYWsnKTtcclxuXHQgICAgICAgIHZhciBsYWJlbCA9IG51bGw7XHJcblx0ICAgICAgICBpZiAodGhpcy5sb29rYWhlYWQudHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovICYmICF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5wYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIHZhciBrZXkgPSAnJCcgKyBpZC5uYW1lO1xyXG5cdCAgICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuY29udGV4dC5sYWJlbFNldCwga2V5KSkge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5Vbmtub3duTGFiZWwsIGlkLm5hbWUpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBsYWJlbCA9IGlkO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICBpZiAobGFiZWwgPT09IG51bGwgJiYgIXRoaXMuY29udGV4dC5pbkl0ZXJhdGlvbiAmJiAhdGhpcy5jb250ZXh0LmluU3dpdGNoKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSWxsZWdhbEJyZWFrKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkJyZWFrU3RhdGVtZW50KGxhYmVsKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJldHVybi1zdGF0ZW1lbnRcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVJldHVyblN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGlmICghdGhpcy5jb250ZXh0LmluRnVuY3Rpb25Cb2R5KSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSWxsZWdhbFJldHVybik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdyZXR1cm4nKTtcclxuXHQgICAgICAgIHZhciBoYXNBcmd1bWVudCA9ICF0aGlzLm1hdGNoKCc7JykgJiYgIXRoaXMubWF0Y2goJ30nKSAmJlxyXG5cdCAgICAgICAgICAgICF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yICYmIHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDIgLyogRU9GICovO1xyXG5cdCAgICAgICAgdmFyIGFyZ3VtZW50ID0gaGFzQXJndW1lbnQgPyB0aGlzLnBhcnNlRXhwcmVzc2lvbigpIDogbnVsbDtcclxuXHQgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuUmV0dXJuU3RhdGVtZW50KGFyZ3VtZW50KSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXdpdGgtc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VXaXRoU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RNb2RlV2l0aCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGJvZHk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEtleXdvcmQoJ3dpdGgnKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcoJyk7XHJcblx0ICAgICAgICB2YXIgb2JqZWN0ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIGlmICghdGhpcy5tYXRjaCgnKScpICYmIHRoaXMuY29uZmlnLnRvbGVyYW50KSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICBib2R5ID0gdGhpcy5maW5hbGl6ZSh0aGlzLmNyZWF0ZU5vZGUoKSwgbmV3IE5vZGUuRW1wdHlTdGF0ZW1lbnQoKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0aGlzLmV4cGVjdCgnKScpO1xyXG5cdCAgICAgICAgICAgIGJvZHkgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5XaXRoU3RhdGVtZW50KG9iamVjdCwgYm9keSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zd2l0Y2gtc3RhdGVtZW50XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VTd2l0Y2hDYXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciB0ZXN0O1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2hLZXl3b3JkKCdkZWZhdWx0JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIHRlc3QgPSBudWxsO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdjYXNlJyk7XHJcblx0ICAgICAgICAgICAgdGVzdCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnOicpO1xyXG5cdCAgICAgICAgdmFyIGNvbnNlcXVlbnQgPSBbXTtcclxuXHQgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJ30nKSB8fCB0aGlzLm1hdGNoS2V5d29yZCgnZGVmYXVsdCcpIHx8IHRoaXMubWF0Y2hLZXl3b3JkKCdjYXNlJykpIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGNvbnNlcXVlbnQucHVzaCh0aGlzLnBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Td2l0Y2hDYXNlKHRlc3QsIGNvbnNlcXVlbnQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVN3aXRjaFN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEtleXdvcmQoJ3N3aXRjaCcpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJygnKTtcclxuXHQgICAgICAgIHZhciBkaXNjcmltaW5hbnQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0luU3dpdGNoID0gdGhpcy5jb250ZXh0LmluU3dpdGNoO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmluU3dpdGNoID0gdHJ1ZTtcclxuXHQgICAgICAgIHZhciBjYXNlcyA9IFtdO1xyXG5cdCAgICAgICAgdmFyIGRlZmF1bHRGb3VuZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJ3snKTtcclxuXHQgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdmFyIGNsYXVzZSA9IHRoaXMucGFyc2VTd2l0Y2hDYXNlKCk7XHJcblx0ICAgICAgICAgICAgaWYgKGNsYXVzZS50ZXN0ID09PSBudWxsKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0Rm91bmQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLk11bHRpcGxlRGVmYXVsdHNJblN3aXRjaCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZGVmYXVsdEZvdW5kID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgY2FzZXMucHVzaChjbGF1c2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJ30nKTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pblN3aXRjaCA9IHByZXZpb3VzSW5Td2l0Y2g7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Td2l0Y2hTdGF0ZW1lbnQoZGlzY3JpbWluYW50LCBjYXNlcykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1sYWJlbGxlZC1zdGF0ZW1lbnRzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VMYWJlbGxlZFN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgZXhwciA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICB2YXIgc3RhdGVtZW50O1xyXG5cdCAgICAgICAgaWYgKChleHByLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5JZGVudGlmaWVyKSAmJiB0aGlzLm1hdGNoKCc6JykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIHZhciBpZCA9IGV4cHI7XHJcblx0ICAgICAgICAgICAgdmFyIGtleSA9ICckJyArIGlkLm5hbWU7XHJcblx0ICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmNvbnRleHQubGFiZWxTZXQsIGtleSkpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuUmVkZWNsYXJhdGlvbiwgJ0xhYmVsJywgaWQubmFtZSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5sYWJlbFNldFtrZXldID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICB2YXIgYm9keSA9IHZvaWQgMDtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ2NsYXNzJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgICAgIGJvZHkgPSB0aGlzLnBhcnNlQ2xhc3NEZWNsYXJhdGlvbigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnZnVuY3Rpb24nKSkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmF0aW9uID0gdGhpcy5wYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24oKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb24pO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRlY2xhcmF0aW9uLmdlbmVyYXRvcikge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5HZW5lcmF0b3JJbkxlZ2FjeUNvbnRleHQpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGJvZHkgPSBkZWNsYXJhdGlvbjtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGJvZHkgPSB0aGlzLnBhcnNlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQubGFiZWxTZXRba2V5XTtcclxuXHQgICAgICAgICAgICBzdGF0ZW1lbnQgPSBuZXcgTm9kZS5MYWJlbGVkU3RhdGVtZW50KGlkLCBib2R5KTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgICAgIHN0YXRlbWVudCA9IG5ldyBOb2RlLkV4cHJlc3Npb25TdGF0ZW1lbnQoZXhwcik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBzdGF0ZW1lbnQpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10aHJvdy1zdGF0ZW1lbnRcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRocm93U3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgndGhyb3cnKTtcclxuXHQgICAgICAgIGlmICh0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuTmV3bGluZUFmdGVyVGhyb3cpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGFyZ3VtZW50ID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcclxuXHQgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuVGhyb3dTdGF0ZW1lbnQoYXJndW1lbnQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdHJ5LXN0YXRlbWVudFxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQ2F0Y2hDbGF1c2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdjYXRjaCcpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJygnKTtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoKCcpJykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuXHQgICAgICAgIHZhciBwYXJhbSA9IHRoaXMucGFyc2VQYXR0ZXJuKHBhcmFtcyk7XHJcblx0ICAgICAgICB2YXIgcGFyYW1NYXAgPSB7fTtcclxuXHQgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGtleSA9ICckJyArIHBhcmFtc1tpXS52YWx1ZTtcclxuXHQgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtTWFwLCBrZXkpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLkR1cGxpY2F0ZUJpbmRpbmcsIHBhcmFtc1tpXS52YWx1ZSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHBhcmFtTWFwW2tleV0gPSB0cnVlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgcGFyYW0udHlwZSA9PT0gc3ludGF4XzEuU3ludGF4LklkZW50aWZpZXIpIHtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5zY2FubmVyLmlzUmVzdHJpY3RlZFdvcmQocGFyYW0ubmFtZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0Q2F0Y2hWYXJpYWJsZSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgIHZhciBib2R5ID0gdGhpcy5wYXJzZUJsb2NrKCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5DYXRjaENsYXVzZShwYXJhbSwgYm9keSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRmluYWxseUNsYXVzZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnZmluYWxseScpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VCbG9jaygpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlVHJ5U3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgndHJ5Jyk7XHJcblx0ICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLnBhcnNlQmxvY2soKTtcclxuXHQgICAgICAgIHZhciBoYW5kbGVyID0gdGhpcy5tYXRjaEtleXdvcmQoJ2NhdGNoJykgPyB0aGlzLnBhcnNlQ2F0Y2hDbGF1c2UoKSA6IG51bGw7XHJcblx0ICAgICAgICB2YXIgZmluYWxpemVyID0gdGhpcy5tYXRjaEtleXdvcmQoJ2ZpbmFsbHknKSA/IHRoaXMucGFyc2VGaW5hbGx5Q2xhdXNlKCkgOiBudWxsO1xyXG5cdCAgICAgICAgaWYgKCFoYW5kbGVyICYmICFmaW5hbGl6ZXIpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5Ob0NhdGNoT3JGaW5hbGx5KTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlRyeVN0YXRlbWVudChibG9jaywgaGFuZGxlciwgZmluYWxpemVyKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWRlYnVnZ2VyLXN0YXRlbWVudFxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRGVidWdnZXJTdGF0ZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdkZWJ1Z2dlcicpO1xyXG5cdCAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5EZWJ1Z2dlclN0YXRlbWVudCgpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS1zdGF0ZW1lbnRzLWFuZC1kZWNsYXJhdGlvbnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVN0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGF0ZW1lbnQ7XHJcblx0ICAgICAgICBzd2l0Y2ggKHRoaXMubG9va2FoZWFkLnR5cGUpIHtcclxuXHQgICAgICAgICAgICBjYXNlIDEgLyogQm9vbGVhbkxpdGVyYWwgKi86XHJcblx0ICAgICAgICAgICAgY2FzZSA1IC8qIE51bGxMaXRlcmFsICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgNiAvKiBOdW1lcmljTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICBjYXNlIDggLyogU3RyaW5nTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICBjYXNlIDEwIC8qIFRlbXBsYXRlICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgOSAvKiBSZWd1bGFyRXhwcmVzc2lvbiAqLzpcclxuXHQgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSA3IC8qIFB1bmN0dWF0b3IgKi86XHJcblx0ICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMubG9va2FoZWFkLnZhbHVlO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09ICd7Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUJsb2NrKCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPT09ICcoJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PT0gJzsnKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlRW1wdHlTdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VFeHByZXNzaW9uU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSAzIC8qIElkZW50aWZpZXIgKi86XHJcblx0ICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMubWF0Y2hBc3luY0Z1bmN0aW9uKCkgPyB0aGlzLnBhcnNlRnVuY3Rpb25EZWNsYXJhdGlvbigpIDogdGhpcy5wYXJzZUxhYmVsbGVkU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGNhc2UgNCAvKiBLZXl3b3JkICovOlxyXG5cdCAgICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMubG9va2FoZWFkLnZhbHVlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdicmVhayc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUJyZWFrU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdjb250aW51ZSc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUNvbnRpbnVlU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJ1Z2dlcic6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZURlYnVnZ2VyU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdkbyc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZURvV2hpbGVTdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Zvcic6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUZvclN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdpZic6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUlmU3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICdyZXR1cm4nOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VSZXR1cm5TdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3N3aXRjaCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZVN3aXRjaFN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAndGhyb3cnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VUaHJvd1N0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAndHJ5JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlVHJ5U3RhdGVtZW50KCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICBjYXNlICd2YXInOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VWYXJpYWJsZVN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2hpbGUnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9IHRoaXMucGFyc2VXaGlsZVN0YXRlbWVudCgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2l0aCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZVdpdGhTdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gdGhpcy5wYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICBzdGF0ZW1lbnQgPSB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWZ1bmN0aW9uLWRlZmluaXRpb25zXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VGdW5jdGlvblNvdXJjZUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd7Jyk7XHJcblx0ICAgICAgICB2YXIgYm9keSA9IHRoaXMucGFyc2VEaXJlY3RpdmVQcm9sb2d1ZXMoKTtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0xhYmVsU2V0ID0gdGhpcy5jb250ZXh0LmxhYmVsU2V0O1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzSW5JdGVyYXRpb24gPSB0aGlzLmNvbnRleHQuaW5JdGVyYXRpb247XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNJblN3aXRjaCA9IHRoaXMuY29udGV4dC5pblN3aXRjaDtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0luRnVuY3Rpb25Cb2R5ID0gdGhpcy5jb250ZXh0LmluRnVuY3Rpb25Cb2R5O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmxhYmVsU2V0ID0ge307XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaW5JdGVyYXRpb24gPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pblN3aXRjaCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmluRnVuY3Rpb25Cb2R5ID0gdHJ1ZTtcclxuXHQgICAgICAgIHdoaWxlICh0aGlzLmxvb2thaGVhZC50eXBlICE9PSAyIC8qIEVPRiAqLykge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCd9JykpIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnfScpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmxhYmVsU2V0ID0gcHJldmlvdXNMYWJlbFNldDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pbkl0ZXJhdGlvbiA9IHByZXZpb3VzSW5JdGVyYXRpb247XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuaW5Td2l0Y2ggPSBwcmV2aW91c0luU3dpdGNoO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmluRnVuY3Rpb25Cb2R5ID0gcHJldmlvdXNJbkZ1bmN0aW9uQm9keTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkJsb2NrU3RhdGVtZW50KGJvZHkpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS52YWxpZGF0ZVBhcmFtID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBhcmFtLCBuYW1lKSB7XHJcblx0ICAgICAgICB2YXIga2V5ID0gJyQnICsgbmFtZTtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0KSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc1Jlc3RyaWN0ZWRXb3JkKG5hbWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgIG9wdGlvbnMuc3RyaWN0ZWQgPSBwYXJhbTtcclxuXHQgICAgICAgICAgICAgICAgb3B0aW9ucy5tZXNzYWdlID0gbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RQYXJhbU5hbWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3B0aW9ucy5wYXJhbVNldCwga2V5KSkge1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLnN0cmljdGVkID0gcGFyYW07XHJcblx0ICAgICAgICAgICAgICAgIG9wdGlvbnMubWVzc2FnZSA9IG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0UGFyYW1EdXBlO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKCFvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuaXNSZXN0cmljdGVkV29yZChuYW1lKSkge1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCA9IHBhcmFtO1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFBhcmFtTmFtZTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zY2FubmVyLmlzU3RyaWN0TW9kZVJlc2VydmVkV29yZChuYW1lKSkge1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLmZpcnN0UmVzdHJpY3RlZCA9IHBhcmFtO1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFJlc2VydmVkV29yZDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMucGFyYW1TZXQsIGtleSkpIHtcclxuXHQgICAgICAgICAgICAgICAgb3B0aW9ucy5zdHJpY3RlZCA9IHBhcmFtO1xyXG5cdCAgICAgICAgICAgICAgICBvcHRpb25zLm1lc3NhZ2UgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdFBhcmFtRHVwZTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG5cdCAgICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgPT09ICdmdW5jdGlvbicpIHtcclxuXHQgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3B0aW9ucy5wYXJhbVNldCwga2V5LCB7IHZhbHVlOiB0cnVlLCBlbnVtZXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgb3B0aW9ucy5wYXJhbVNldFtrZXldID0gdHJ1ZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVJlc3RFbGVtZW50ID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCcuLi4nKTtcclxuXHQgICAgICAgIHZhciBhcmcgPSB0aGlzLnBhcnNlUGF0dGVybihwYXJhbXMpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2goJz0nKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLkRlZmF1bHRSZXN0UGFyYW1ldGVyKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICghdGhpcy5tYXRjaCgnKScpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuUGFyYW1ldGVyQWZ0ZXJSZXN0UGFyYW1ldGVyKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLlJlc3RFbGVtZW50KGFyZykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRm9ybWFsUGFyYW1ldGVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHQgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuXHQgICAgICAgIHZhciBwYXJhbSA9IHRoaXMubWF0Y2goJy4uLicpID8gdGhpcy5wYXJzZVJlc3RFbGVtZW50KHBhcmFtcykgOiB0aGlzLnBhcnNlUGF0dGVybldpdGhEZWZhdWx0KHBhcmFtcyk7XHJcblx0ICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudmFsaWRhdGVQYXJhbShvcHRpb25zLCBwYXJhbXNbaV0sIHBhcmFtc1tpXS52YWx1ZSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBvcHRpb25zLnNpbXBsZSA9IG9wdGlvbnMuc2ltcGxlICYmIChwYXJhbSBpbnN0YW5jZW9mIE5vZGUuSWRlbnRpZmllcik7XHJcblx0ICAgICAgICBvcHRpb25zLnBhcmFtcy5wdXNoKHBhcmFtKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZvcm1hbFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoZmlyc3RSZXN0cmljdGVkKSB7XHJcblx0ICAgICAgICB2YXIgb3B0aW9ucztcclxuXHQgICAgICAgIG9wdGlvbnMgPSB7XHJcblx0ICAgICAgICAgICAgc2ltcGxlOiB0cnVlLFxyXG5cdCAgICAgICAgICAgIHBhcmFtczogW10sXHJcblx0ICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkOiBmaXJzdFJlc3RyaWN0ZWRcclxuXHQgICAgICAgIH07XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnKCcpO1xyXG5cdCAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCcpJykpIHtcclxuXHQgICAgICAgICAgICBvcHRpb25zLnBhcmFtU2V0ID0ge307XHJcblx0ICAgICAgICAgICAgd2hpbGUgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDIgLyogRU9GICovKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMucGFyc2VGb3JtYWxQYXJhbWV0ZXIob3B0aW9ucyk7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcpJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcsJyk7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcpJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJyknKTtcclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgc2ltcGxlOiBvcHRpb25zLnNpbXBsZSxcclxuXHQgICAgICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxyXG5cdCAgICAgICAgICAgIHN0cmljdGVkOiBvcHRpb25zLnN0cmljdGVkLFxyXG5cdCAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZDogb3B0aW9ucy5maXJzdFJlc3RyaWN0ZWQsXHJcblx0ICAgICAgICAgICAgbWVzc2FnZTogb3B0aW9ucy5tZXNzYWdlXHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLm1hdGNoQXN5bmNGdW5jdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBtYXRjaCA9IHRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnYXN5bmMnKTtcclxuXHQgICAgICAgIGlmIChtYXRjaCkge1xyXG5cdCAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc2Nhbm5lci5zYXZlU3RhdGUoKTtcclxuXHQgICAgICAgICAgICB0aGlzLnNjYW5uZXIuc2NhbkNvbW1lbnRzKCk7XHJcblx0ICAgICAgICAgICAgdmFyIG5leHQgPSB0aGlzLnNjYW5uZXIubGV4KCk7XHJcblx0ICAgICAgICAgICAgdGhpcy5zY2FubmVyLnJlc3RvcmVTdGF0ZShzdGF0ZSk7XHJcblx0ICAgICAgICAgICAgbWF0Y2ggPSAoc3RhdGUubGluZU51bWJlciA9PT0gbmV4dC5saW5lTnVtYmVyKSAmJiAobmV4dC50eXBlID09PSA0IC8qIEtleXdvcmQgKi8pICYmIChuZXh0LnZhbHVlID09PSAnZnVuY3Rpb24nKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBtYXRjaDtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZ1bmN0aW9uRGVjbGFyYXRpb24gPSBmdW5jdGlvbiAoaWRlbnRpZmllcklzT3B0aW9uYWwpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgaXNBc3luYyA9IHRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnYXN5bmMnKTtcclxuXHQgICAgICAgIGlmIChpc0FzeW5jKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnZnVuY3Rpb24nKTtcclxuXHQgICAgICAgIHZhciBpc0dlbmVyYXRvciA9IGlzQXN5bmMgPyBmYWxzZSA6IHRoaXMubWF0Y2goJyonKTtcclxuXHQgICAgICAgIGlmIChpc0dlbmVyYXRvcikge1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbWVzc2FnZTtcclxuXHQgICAgICAgIHZhciBpZCA9IG51bGw7XHJcblx0ICAgICAgICB2YXIgZmlyc3RSZXN0cmljdGVkID0gbnVsbDtcclxuXHQgICAgICAgIGlmICghaWRlbnRpZmllcklzT3B0aW9uYWwgfHwgIXRoaXMubWF0Y2goJygnKSkge1xyXG5cdCAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgICAgIGlkID0gdGhpcy5wYXJzZVZhcmlhYmxlSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHQuc3RyaWN0KSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnNjYW5uZXIuaXNSZXN0cmljdGVkV29yZCh0b2tlbi52YWx1ZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0RnVuY3Rpb25OYW1lKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc1Jlc3RyaWN0ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gdG9rZW47XHJcblx0ICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RGdW5jdGlvbk5hbWU7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zY2FubmVyLmlzU3RyaWN0TW9kZVJlc2VydmVkV29yZCh0b2tlbi52YWx1ZSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGZpcnN0UmVzdHJpY3RlZCA9IHRva2VuO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RyaWN0UmVzZXJ2ZWRXb3JkO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dBd2FpdCA9IHRoaXMuY29udGV4dC5hd2FpdDtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0FsbG93WWllbGQgPSB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hd2FpdCA9IGlzQXN5bmM7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9ICFpc0dlbmVyYXRvcjtcclxuXHQgICAgICAgIHZhciBmb3JtYWxQYXJhbWV0ZXJzID0gdGhpcy5wYXJzZUZvcm1hbFBhcmFtZXRlcnMoZmlyc3RSZXN0cmljdGVkKTtcclxuXHQgICAgICAgIHZhciBwYXJhbXMgPSBmb3JtYWxQYXJhbWV0ZXJzLnBhcmFtcztcclxuXHQgICAgICAgIHZhciBzdHJpY3RlZCA9IGZvcm1hbFBhcmFtZXRlcnMuc3RyaWN0ZWQ7XHJcblx0ICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSBmb3JtYWxQYXJhbWV0ZXJzLmZpcnN0UmVzdHJpY3RlZDtcclxuXHQgICAgICAgIGlmIChmb3JtYWxQYXJhbWV0ZXJzLm1lc3NhZ2UpIHtcclxuXHQgICAgICAgICAgICBtZXNzYWdlID0gZm9ybWFsUGFyYW1ldGVycy5tZXNzYWdlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzU3RyaWN0ID0gdGhpcy5jb250ZXh0LnN0cmljdDtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0FsbG93U3RyaWN0RGlyZWN0aXZlID0gdGhpcy5jb250ZXh0LmFsbG93U3RyaWN0RGlyZWN0aXZlO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93U3RyaWN0RGlyZWN0aXZlID0gZm9ybWFsUGFyYW1ldGVycy5zaW1wbGU7XHJcblx0ICAgICAgICB2YXIgYm9keSA9IHRoaXMucGFyc2VGdW5jdGlvblNvdXJjZUVsZW1lbnRzKCk7XHJcblx0ICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBmaXJzdFJlc3RyaWN0ZWQpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKGZpcnN0UmVzdHJpY3RlZCwgbWVzc2FnZSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAodGhpcy5jb250ZXh0LnN0cmljdCAmJiBzdHJpY3RlZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oc3RyaWN0ZWQsIG1lc3NhZ2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93U3RyaWN0RGlyZWN0aXZlID0gcHJldmlvdXNBbGxvd1N0cmljdERpcmVjdGl2ZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hd2FpdCA9IHByZXZpb3VzQWxsb3dBd2FpdDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gcHJldmlvdXNBbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgcmV0dXJuIGlzQXN5bmMgPyB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkFzeW5jRnVuY3Rpb25EZWNsYXJhdGlvbihpZCwgcGFyYW1zLCBib2R5KSkgOlxyXG5cdCAgICAgICAgICAgIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRnVuY3Rpb25EZWNsYXJhdGlvbihpZCwgcGFyYW1zLCBib2R5LCBpc0dlbmVyYXRvcikpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRnVuY3Rpb25FeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBpc0FzeW5jID0gdGhpcy5tYXRjaENvbnRleHR1YWxLZXl3b3JkKCdhc3luYycpO1xyXG5cdCAgICAgICAgaWYgKGlzQXN5bmMpIHtcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdmdW5jdGlvbicpO1xyXG5cdCAgICAgICAgdmFyIGlzR2VuZXJhdG9yID0gaXNBc3luYyA/IGZhbHNlIDogdGhpcy5tYXRjaCgnKicpO1xyXG5cdCAgICAgICAgaWYgKGlzR2VuZXJhdG9yKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBtZXNzYWdlO1xyXG5cdCAgICAgICAgdmFyIGlkID0gbnVsbDtcclxuXHQgICAgICAgIHZhciBmaXJzdFJlc3RyaWN0ZWQ7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNBbGxvd0F3YWl0ID0gdGhpcy5jb250ZXh0LmF3YWl0O1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dZaWVsZCA9IHRoaXMuY29udGV4dC5hbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmF3YWl0ID0gaXNBc3luYztcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gIWlzR2VuZXJhdG9yO1xyXG5cdCAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCcoJykpIHtcclxuXHQgICAgICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgICAgICBpZCA9ICghdGhpcy5jb250ZXh0LnN0cmljdCAmJiAhaXNHZW5lcmF0b3IgJiYgdGhpcy5tYXRjaEtleXdvcmQoJ3lpZWxkJykpID8gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKCkgOiB0aGlzLnBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QpIHtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci5pc1Jlc3RyaWN0ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RGdW5jdGlvbk5hbWUpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5zY2FubmVyLmlzUmVzdHJpY3RlZFdvcmQodG9rZW4udmFsdWUpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcclxuXHQgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdEZ1bmN0aW9uTmFtZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnNjYW5uZXIuaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkKHRva2VuLnZhbHVlKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gdG9rZW47XHJcblx0ICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gbWVzc2FnZXNfMS5NZXNzYWdlcy5TdHJpY3RSZXNlcnZlZFdvcmQ7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgZm9ybWFsUGFyYW1ldGVycyA9IHRoaXMucGFyc2VGb3JtYWxQYXJhbWV0ZXJzKGZpcnN0UmVzdHJpY3RlZCk7XHJcblx0ICAgICAgICB2YXIgcGFyYW1zID0gZm9ybWFsUGFyYW1ldGVycy5wYXJhbXM7XHJcblx0ICAgICAgICB2YXIgc3RyaWN0ZWQgPSBmb3JtYWxQYXJhbWV0ZXJzLnN0cmljdGVkO1xyXG5cdCAgICAgICAgZmlyc3RSZXN0cmljdGVkID0gZm9ybWFsUGFyYW1ldGVycy5maXJzdFJlc3RyaWN0ZWQ7XHJcblx0ICAgICAgICBpZiAoZm9ybWFsUGFyYW1ldGVycy5tZXNzYWdlKSB7XHJcblx0ICAgICAgICAgICAgbWVzc2FnZSA9IGZvcm1hbFBhcmFtZXRlcnMubWVzc2FnZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBwcmV2aW91c1N0cmljdCA9IHRoaXMuY29udGV4dC5zdHJpY3Q7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNBbGxvd1N0cmljdERpcmVjdGl2ZSA9IHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZSA9IGZvcm1hbFBhcmFtZXRlcnMuc2ltcGxlO1xyXG5cdCAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnBhcnNlRnVuY3Rpb25Tb3VyY2VFbGVtZW50cygpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgZmlyc3RSZXN0cmljdGVkKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbihmaXJzdFJlc3RyaWN0ZWQsIG1lc3NhZ2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5zdHJpY3QgJiYgc3RyaWN0ZWQpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHN0cmljdGVkLCBtZXNzYWdlKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5zdHJpY3QgPSBwcmV2aW91c1N0cmljdDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1N0cmljdERpcmVjdGl2ZSA9IHByZXZpb3VzQWxsb3dTdHJpY3REaXJlY3RpdmU7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYXdhaXQgPSBwcmV2aW91c0FsbG93QXdhaXQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IHByZXZpb3VzQWxsb3dZaWVsZDtcclxuXHQgICAgICAgIHJldHVybiBpc0FzeW5jID8gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5Bc3luY0Z1bmN0aW9uRXhwcmVzc2lvbihpZCwgcGFyYW1zLCBib2R5KSkgOlxyXG5cdCAgICAgICAgICAgIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRnVuY3Rpb25FeHByZXNzaW9uKGlkLCBwYXJhbXMsIGJvZHksIGlzR2VuZXJhdG9yKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWRpcmVjdGl2ZS1wcm9sb2d1ZXMtYW5kLXRoZS11c2Utc3RyaWN0LWRpcmVjdGl2ZVxyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRGlyZWN0aXZlID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIHRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGV4cHIgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xyXG5cdCAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IChleHByLnR5cGUgPT09IHN5bnRheF8xLlN5bnRheC5MaXRlcmFsKSA/IHRoaXMuZ2V0VG9rZW5SYXcodG9rZW4pLnNsaWNlKDEsIC0xKSA6IG51bGw7XHJcblx0ICAgICAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIGRpcmVjdGl2ZSA/IG5ldyBOb2RlLkRpcmVjdGl2ZShleHByLCBkaXJlY3RpdmUpIDogbmV3IE5vZGUuRXhwcmVzc2lvblN0YXRlbWVudChleHByKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VEaXJlY3RpdmVQcm9sb2d1ZXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgZmlyc3RSZXN0cmljdGVkID0gbnVsbDtcclxuXHQgICAgICAgIHZhciBib2R5ID0gW107XHJcblx0ICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG5cdCAgICAgICAgICAgIHZhciB0b2tlbiA9IHRoaXMubG9va2FoZWFkO1xyXG5cdCAgICAgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSA4IC8qIFN0cmluZ0xpdGVyYWwgKi8pIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHZhciBzdGF0ZW1lbnQgPSB0aGlzLnBhcnNlRGlyZWN0aXZlKCk7XHJcblx0ICAgICAgICAgICAgYm9keS5wdXNoKHN0YXRlbWVudCk7XHJcblx0ICAgICAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHN0YXRlbWVudC5kaXJlY3RpdmU7XHJcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBkaXJlY3RpdmUgIT09ICdzdHJpbmcnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoZGlyZWN0aXZlID09PSAndXNlIHN0cmljdCcpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChmaXJzdFJlc3RyaWN0ZWQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oZmlyc3RSZXN0cmljdGVkLCBtZXNzYWdlc18xLk1lc3NhZ2VzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbnRleHQuYWxsb3dTdHJpY3REaXJlY3RpdmUpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuSWxsZWdhbExhbmd1YWdlTW9kZURpcmVjdGl2ZSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICghZmlyc3RSZXN0cmljdGVkICYmIHRva2VuLm9jdGFsKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBmaXJzdFJlc3RyaWN0ZWQgPSB0b2tlbjtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBib2R5O1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1tZXRob2QtZGVmaW5pdGlvbnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5xdWFsaWZpZWRQcm9wZXJ0eU5hbWUgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuXHQgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG5cdCAgICAgICAgICAgIGNhc2UgMyAvKiBJZGVudGlmaWVyICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgOCAvKiBTdHJpbmdMaXRlcmFsICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgMSAvKiBCb29sZWFuTGl0ZXJhbCAqLzpcclxuXHQgICAgICAgICAgICBjYXNlIDUgLyogTnVsbExpdGVyYWwgKi86XHJcblx0ICAgICAgICAgICAgY2FzZSA2IC8qIE51bWVyaWNMaXRlcmFsICovOlxyXG5cdCAgICAgICAgICAgIGNhc2UgNCAvKiBLZXl3b3JkICovOlxyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHQgICAgICAgICAgICBjYXNlIDcgLyogUHVuY3R1YXRvciAqLzpcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuLnZhbHVlID09PSAnWyc7XHJcblx0ICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VHZXR0ZXJNZXRob2QgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGlzR2VuZXJhdG9yID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNBbGxvd1lpZWxkID0gdGhpcy5jb250ZXh0LmFsbG93WWllbGQ7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdmFyIGZvcm1hbFBhcmFtZXRlcnMgPSB0aGlzLnBhcnNlRm9ybWFsUGFyYW1ldGVycygpO1xyXG5cdCAgICAgICAgaWYgKGZvcm1hbFBhcmFtZXRlcnMucGFyYW1zLmxlbmd0aCA+IDApIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRvbGVyYXRlRXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5CYWRHZXR0ZXJBcml0eSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5wYXJzZVByb3BlcnR5TWV0aG9kKGZvcm1hbFBhcmFtZXRlcnMpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSBwcmV2aW91c0FsbG93WWllbGQ7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5GdW5jdGlvbkV4cHJlc3Npb24obnVsbCwgZm9ybWFsUGFyYW1ldGVycy5wYXJhbXMsIG1ldGhvZCwgaXNHZW5lcmF0b3IpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNldHRlck1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgaXNHZW5lcmF0b3IgPSBmYWxzZTtcclxuXHQgICAgICAgIHZhciBwcmV2aW91c0FsbG93WWllbGQgPSB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZDtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgZm9ybWFsUGFyYW1ldGVycyA9IHRoaXMucGFyc2VGb3JtYWxQYXJhbWV0ZXJzKCk7XHJcblx0ICAgICAgICBpZiAoZm9ybWFsUGFyYW1ldGVycy5wYXJhbXMubGVuZ3RoICE9PSAxKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuQmFkU2V0dGVyQXJpdHkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAoZm9ybWFsUGFyYW1ldGVycy5wYXJhbXNbMF0gaW5zdGFuY2VvZiBOb2RlLlJlc3RFbGVtZW50KSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50b2xlcmF0ZUVycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuQmFkU2V0dGVyUmVzdFBhcmFtZXRlcik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5wYXJzZVByb3BlcnR5TWV0aG9kKGZvcm1hbFBhcmFtZXRlcnMpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSBwcmV2aW91c0FsbG93WWllbGQ7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5GdW5jdGlvbkV4cHJlc3Npb24obnVsbCwgZm9ybWFsUGFyYW1ldGVycy5wYXJhbXMsIG1ldGhvZCwgaXNHZW5lcmF0b3IpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUdlbmVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgaXNHZW5lcmF0b3IgPSB0cnVlO1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dZaWVsZCA9IHRoaXMuY29udGV4dC5hbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSB0cnVlO1xyXG5cdCAgICAgICAgdmFyIHBhcmFtcyA9IHRoaXMucGFyc2VGb3JtYWxQYXJhbWV0ZXJzKCk7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuYWxsb3dZaWVsZCA9IGZhbHNlO1xyXG5cdCAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZChwYXJhbXMpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LmFsbG93WWllbGQgPSBwcmV2aW91c0FsbG93WWllbGQ7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5GdW5jdGlvbkV4cHJlc3Npb24obnVsbCwgcGFyYW1zLnBhcmFtcywgbWV0aG9kLCBpc0dlbmVyYXRvcikpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZW5lcmF0b3ItZnVuY3Rpb24tZGVmaW5pdGlvbnNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5pc1N0YXJ0T2ZFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0ID0gdHJ1ZTtcclxuXHQgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMubG9va2FoZWFkLnZhbHVlO1xyXG5cdCAgICAgICAgc3dpdGNoICh0aGlzLmxvb2thaGVhZC50eXBlKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSA3IC8qIFB1bmN0dWF0b3IgKi86XHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0ID0gKHZhbHVlID09PSAnWycpIHx8ICh2YWx1ZSA9PT0gJygnKSB8fCAodmFsdWUgPT09ICd7JykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PT0gJysnKSB8fCAodmFsdWUgPT09ICctJykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PT0gJyEnKSB8fCAodmFsdWUgPT09ICd+JykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PT0gJysrJykgfHwgKHZhbHVlID09PSAnLS0nKSB8fFxyXG5cdCAgICAgICAgICAgICAgICAgICAgKHZhbHVlID09PSAnLycpIHx8ICh2YWx1ZSA9PT0gJy89Jyk7IC8vIHJlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFsXHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGNhc2UgNCAvKiBLZXl3b3JkICovOlxyXG5cdCAgICAgICAgICAgICAgICBzdGFydCA9ICh2YWx1ZSA9PT0gJ2NsYXNzJykgfHwgKHZhbHVlID09PSAnZGVsZXRlJykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykgfHwgKHZhbHVlID09PSAnbGV0JykgfHwgKHZhbHVlID09PSAnbmV3JykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICh2YWx1ZSA9PT0gJ3N1cGVyJykgfHwgKHZhbHVlID09PSAndGhpcycpIHx8ICh2YWx1ZSA9PT0gJ3R5cGVvZicpIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAodmFsdWUgPT09ICd2b2lkJykgfHwgKHZhbHVlID09PSAneWllbGQnKTtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gc3RhcnQ7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VZaWVsZEV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCd5aWVsZCcpO1xyXG5cdCAgICAgICAgdmFyIGFyZ3VtZW50ID0gbnVsbDtcclxuXHQgICAgICAgIHZhciBkZWxlZ2F0ZSA9IGZhbHNlO1xyXG5cdCAgICAgICAgaWYgKCF0aGlzLmhhc0xpbmVUZXJtaW5hdG9yKSB7XHJcblx0ICAgICAgICAgICAgdmFyIHByZXZpb3VzQWxsb3dZaWVsZCA9IHRoaXMuY29udGV4dC5hbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgZGVsZWdhdGUgPSB0aGlzLm1hdGNoKCcqJyk7XHJcblx0ICAgICAgICAgICAgaWYgKGRlbGVnYXRlKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgIGFyZ3VtZW50ID0gdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNTdGFydE9mRXhwcmVzc2lvbigpKSB7XHJcblx0ICAgICAgICAgICAgICAgIGFyZ3VtZW50ID0gdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gcHJldmlvdXNBbGxvd1lpZWxkO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuWWllbGRFeHByZXNzaW9uKGFyZ3VtZW50LCBkZWxlZ2F0ZSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1jbGFzcy1kZWZpbml0aW9uc1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQ2xhc3NFbGVtZW50ID0gZnVuY3Rpb24gKGhhc0NvbnN0cnVjdG9yKSB7XHJcblx0ICAgICAgICB2YXIgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIga2luZCA9ICcnO1xyXG5cdCAgICAgICAgdmFyIGtleSA9IG51bGw7XHJcblx0ICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG5cdCAgICAgICAgdmFyIGNvbXB1dGVkID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgbWV0aG9kID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgaXNTdGF0aWMgPSBmYWxzZTtcclxuXHQgICAgICAgIHZhciBpc0FzeW5jID0gZmFsc2U7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaCgnKicpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIGNvbXB1dGVkID0gdGhpcy5tYXRjaCgnWycpO1xyXG5cdCAgICAgICAgICAgIGtleSA9IHRoaXMucGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpO1xyXG5cdCAgICAgICAgICAgIHZhciBpZCA9IGtleTtcclxuXHQgICAgICAgICAgICBpZiAoaWQubmFtZSA9PT0gJ3N0YXRpYycgJiYgKHRoaXMucXVhbGlmaWVkUHJvcGVydHlOYW1lKHRoaXMubG9va2FoZWFkKSB8fCB0aGlzLm1hdGNoKCcqJykpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5sb29rYWhlYWQ7XHJcblx0ICAgICAgICAgICAgICAgIGlzU3RhdGljID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgY29tcHV0ZWQgPSB0aGlzLm1hdGNoKCdbJyk7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcqJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoKHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykgJiYgIXRoaXMuaGFzTGluZVRlcm1pbmF0b3IgJiYgKHRva2VuLnZhbHVlID09PSAnYXN5bmMnKSkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgcHVuY3R1YXRvciA9IHRoaXMubG9va2FoZWFkLnZhbHVlO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAocHVuY3R1YXRvciAhPT0gJzonICYmIHB1bmN0dWF0b3IgIT09ICcoJyAmJiBwdW5jdHVhdG9yICE9PSAnKicpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlzQXN5bmMgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSB0aGlzLmxvb2thaGVhZDtcclxuXHQgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMucGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJ2dldCcgfHwgdG9rZW4udmFsdWUgPT09ICdzZXQnKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4odG9rZW4pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKHRva2VuLCBtZXNzYWdlc18xLk1lc3NhZ2VzLkNvbnN0cnVjdG9ySXNBc3luYyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGxvb2thaGVhZFByb3BlcnR5S2V5ID0gdGhpcy5xdWFsaWZpZWRQcm9wZXJ0eU5hbWUodGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDMgLyogSWRlbnRpZmllciAqLykge1xyXG5cdCAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJ2dldCcgJiYgbG9va2FoZWFkUHJvcGVydHlLZXkpIHtcclxuXHQgICAgICAgICAgICAgICAga2luZCA9ICdnZXQnO1xyXG5cdCAgICAgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5wYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5hbGxvd1lpZWxkID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZUdldHRlck1ldGhvZCgpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICh0b2tlbi52YWx1ZSA9PT0gJ3NldCcgJiYgbG9va2FoZWFkUHJvcGVydHlLZXkpIHtcclxuXHQgICAgICAgICAgICAgICAga2luZCA9ICdzZXQnO1xyXG5cdCAgICAgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5wYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XHJcblx0ICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZVNldHRlck1ldGhvZCgpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRva2VuLnR5cGUgPT09IDcgLyogUHVuY3R1YXRvciAqLyAmJiB0b2tlbi52YWx1ZSA9PT0gJyonICYmIGxvb2thaGVhZFByb3BlcnR5S2V5KSB7XHJcblx0ICAgICAgICAgICAga2luZCA9ICdpbml0JztcclxuXHQgICAgICAgICAgICBjb21wdXRlZCA9IHRoaXMubWF0Y2goJ1snKTtcclxuXHQgICAgICAgICAgICBrZXkgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTtcclxuXHQgICAgICAgICAgICB2YWx1ZSA9IHRoaXMucGFyc2VHZW5lcmF0b3JNZXRob2QoKTtcclxuXHQgICAgICAgICAgICBtZXRob2QgPSB0cnVlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKCFraW5kICYmIGtleSAmJiB0aGlzLm1hdGNoKCcoJykpIHtcclxuXHQgICAgICAgICAgICBraW5kID0gJ2luaXQnO1xyXG5cdCAgICAgICAgICAgIHZhbHVlID0gaXNBc3luYyA/IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZEFzeW5jRnVuY3Rpb24oKSA6IHRoaXMucGFyc2VQcm9wZXJ0eU1ldGhvZEZ1bmN0aW9uKCk7XHJcblx0ICAgICAgICAgICAgbWV0aG9kID0gdHJ1ZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICgha2luZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odGhpcy5sb29rYWhlYWQpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKGtpbmQgPT09ICdpbml0Jykge1xyXG5cdCAgICAgICAgICAgIGtpbmQgPSAnbWV0aG9kJztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICghY29tcHV0ZWQpIHtcclxuXHQgICAgICAgICAgICBpZiAoaXNTdGF0aWMgJiYgdGhpcy5pc1Byb3BlcnR5S2V5KGtleSwgJ3Byb3RvdHlwZScpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4odG9rZW4sIG1lc3NhZ2VzXzEuTWVzc2FnZXMuU3RhdGljUHJvdG90eXBlKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgaWYgKCFpc1N0YXRpYyAmJiB0aGlzLmlzUHJvcGVydHlLZXkoa2V5LCAnY29uc3RydWN0b3InKSkge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoa2luZCAhPT0gJ21ldGhvZCcgfHwgIW1ldGhvZCB8fCAodmFsdWUgJiYgdmFsdWUuZ2VuZXJhdG9yKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5Db25zdHJ1Y3RvclNwZWNpYWxNZXRob2QpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGlmIChoYXNDb25zdHJ1Y3Rvci52YWx1ZSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0b2tlbiwgbWVzc2FnZXNfMS5NZXNzYWdlcy5EdXBsaWNhdGVDb25zdHJ1Y3Rvcik7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBoYXNDb25zdHJ1Y3Rvci52YWx1ZSA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAga2luZCA9ICdjb25zdHJ1Y3Rvcic7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuTWV0aG9kRGVmaW5pdGlvbihrZXksIGNvbXB1dGVkLCB2YWx1ZSwga2luZCwgaXNTdGF0aWMpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNsYXNzRWxlbWVudExpc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgYm9keSA9IFtdO1xyXG5cdCAgICAgICAgdmFyIGhhc0NvbnN0cnVjdG9yID0geyB2YWx1ZTogZmFsc2UgfTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd7Jyk7XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCc7JykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnBhcnNlQ2xhc3NFbGVtZW50KGhhc0NvbnN0cnVjdG9yKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5leHBlY3QoJ30nKTtcclxuXHQgICAgICAgIHJldHVybiBib2R5O1xyXG5cdCAgICB9O1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQ2xhc3NCb2R5ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBlbGVtZW50TGlzdCA9IHRoaXMucGFyc2VDbGFzc0VsZW1lbnRMaXN0KCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5DbGFzc0JvZHkoZWxlbWVudExpc3QpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNsYXNzRGVjbGFyYXRpb24gPSBmdW5jdGlvbiAoaWRlbnRpZmllcklzT3B0aW9uYWwpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNTdHJpY3QgPSB0aGlzLmNvbnRleHQuc3RyaWN0O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHRydWU7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEtleXdvcmQoJ2NsYXNzJyk7XHJcblx0ICAgICAgICB2YXIgaWQgPSAoaWRlbnRpZmllcklzT3B0aW9uYWwgJiYgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDMgLyogSWRlbnRpZmllciAqLykpID8gbnVsbCA6IHRoaXMucGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcclxuXHQgICAgICAgIHZhciBzdXBlckNsYXNzID0gbnVsbDtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnZXh0ZW5kcycpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBzdXBlckNsYXNzID0gdGhpcy5pc29sYXRlQ292ZXJHcmFtbWFyKHRoaXMucGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uQWxsb3dDYWxsKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBjbGFzc0JvZHkgPSB0aGlzLnBhcnNlQ2xhc3NCb2R5KCk7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuc3RyaWN0ID0gcHJldmlvdXNTdHJpY3Q7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5DbGFzc0RlY2xhcmF0aW9uKGlkLCBzdXBlckNsYXNzLCBjbGFzc0JvZHkpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNsYXNzRXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgcHJldmlvdXNTdHJpY3QgPSB0aGlzLmNvbnRleHQuc3RyaWN0O1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHRydWU7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdEtleXdvcmQoJ2NsYXNzJyk7XHJcblx0ICAgICAgICB2YXIgaWQgPSAodGhpcy5sb29rYWhlYWQudHlwZSA9PT0gMyAvKiBJZGVudGlmaWVyICovKSA/IHRoaXMucGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKSA6IG51bGw7XHJcblx0ICAgICAgICB2YXIgc3VwZXJDbGFzcyA9IG51bGw7XHJcblx0ICAgICAgICBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ2V4dGVuZHMnKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgc3VwZXJDbGFzcyA9IHRoaXMuaXNvbGF0ZUNvdmVyR3JhbW1hcih0aGlzLnBhcnNlTGVmdEhhbmRTaWRlRXhwcmVzc2lvbkFsbG93Q2FsbCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgY2xhc3NCb2R5ID0gdGhpcy5wYXJzZUNsYXNzQm9keSgpO1xyXG5cdCAgICAgICAgdGhpcy5jb250ZXh0LnN0cmljdCA9IHByZXZpb3VzU3RyaWN0O1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuQ2xhc3NFeHByZXNzaW9uKGlkLCBzdXBlckNsYXNzLCBjbGFzc0JvZHkpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc2NyaXB0c1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1tb2R1bGVzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VNb2R1bGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB0aGlzLmNvbnRleHQuc3RyaWN0ID0gdHJ1ZTtcclxuXHQgICAgICAgIHRoaXMuY29udGV4dC5pc01vZHVsZSA9IHRydWU7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnBhcnNlRGlyZWN0aXZlUHJvbG9ndWVzKCk7XHJcblx0ICAgICAgICB3aGlsZSAodGhpcy5sb29rYWhlYWQudHlwZSAhPT0gMiAvKiBFT0YgKi8pIHtcclxuXHQgICAgICAgICAgICBib2R5LnB1c2godGhpcy5wYXJzZVN0YXRlbWVudExpc3RJdGVtKCkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuTW9kdWxlKGJvZHkpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVNjcmlwdCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgYm9keSA9IHRoaXMucGFyc2VEaXJlY3RpdmVQcm9sb2d1ZXMoKTtcclxuXHQgICAgICAgIHdoaWxlICh0aGlzLmxvb2thaGVhZC50eXBlICE9PSAyIC8qIEVPRiAqLykge1xyXG5cdCAgICAgICAgICAgIGJvZHkucHVzaCh0aGlzLnBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5TY3JpcHQoYm9keSkpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1pbXBvcnRzXHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VNb2R1bGVTcGVjaWZpZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgIT09IDggLyogU3RyaW5nTGl0ZXJhbCAqLykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLkludmFsaWRNb2R1bGVTcGVjaWZpZXIpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIHRva2VuID0gdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIHZhciByYXcgPSB0aGlzLmdldFRva2VuUmF3KHRva2VuKTtcclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkxpdGVyYWwodG9rZW4udmFsdWUsIHJhdykpO1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBpbXBvcnQgezxmb28gYXMgYmFyPn0gLi4uO1xyXG5cdCAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlSW1wb3J0U3BlY2lmaWVyID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHZhciBpbXBvcnRlZDtcclxuXHQgICAgICAgIHZhciBsb2NhbDtcclxuXHQgICAgICAgIGlmICh0aGlzLmxvb2thaGVhZC50eXBlID09PSAzIC8qIElkZW50aWZpZXIgKi8pIHtcclxuXHQgICAgICAgICAgICBpbXBvcnRlZCA9IHRoaXMucGFyc2VWYXJpYWJsZUlkZW50aWZpZXIoKTtcclxuXHQgICAgICAgICAgICBsb2NhbCA9IGltcG9ydGVkO1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2FzJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgbG9jYWwgPSB0aGlzLnBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgaW1wb3J0ZWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllck5hbWUoKTtcclxuXHQgICAgICAgICAgICBsb2NhbCA9IGltcG9ydGVkO1xyXG5cdCAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2FzJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgbG9jYWwgPSB0aGlzLnBhcnNlVmFyaWFibGVJZGVudGlmaWVyKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKHRoaXMubmV4dFRva2VuKCkpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkltcG9ydFNwZWNpZmllcihsb2NhbCwgaW1wb3J0ZWQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8ge2ZvbywgYmFyIGFzIGJhc31cclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZU5hbWVkSW1wb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd7Jyk7XHJcblx0ICAgICAgICB2YXIgc3BlY2lmaWVycyA9IFtdO1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLm1hdGNoKCd9JykpIHtcclxuXHQgICAgICAgICAgICBzcGVjaWZpZXJzLnB1c2godGhpcy5wYXJzZUltcG9ydFNwZWNpZmllcigpKTtcclxuXHQgICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmV4cGVjdCgnLCcpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuZXhwZWN0KCd9Jyk7XHJcblx0ICAgICAgICByZXR1cm4gc3BlY2lmaWVycztcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaW1wb3J0IDxmb28+IC4uLjtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUltcG9ydERlZmF1bHRTcGVjaWZpZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdmFyIGxvY2FsID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKCk7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5JbXBvcnREZWZhdWx0U3BlY2lmaWVyKGxvY2FsKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGltcG9ydCA8KiBhcyBmb28+IC4uLjtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUltcG9ydE5hbWVzcGFjZVNwZWNpZmllciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB0aGlzLmV4cGVjdCgnKicpO1xyXG5cdCAgICAgICAgaWYgKCF0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2FzJykpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5Ob0FzQWZ0ZXJJbXBvcnROYW1lc3BhY2UpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgIHZhciBsb2NhbCA9IHRoaXMucGFyc2VJZGVudGlmaWVyTmFtZSgpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyKGxvY2FsKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VJbXBvcnREZWNsYXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGlmICh0aGlzLmNvbnRleHQuaW5GdW5jdGlvbkJvZHkpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZXNfMS5NZXNzYWdlcy5JbGxlZ2FsSW1wb3J0RGVjbGFyYXRpb24pO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNyZWF0ZU5vZGUoKTtcclxuXHQgICAgICAgIHRoaXMuZXhwZWN0S2V5d29yZCgnaW1wb3J0Jyk7XHJcblx0ICAgICAgICB2YXIgc3JjO1xyXG5cdCAgICAgICAgdmFyIHNwZWNpZmllcnMgPSBbXTtcclxuXHQgICAgICAgIGlmICh0aGlzLmxvb2thaGVhZC50eXBlID09PSA4IC8qIFN0cmluZ0xpdGVyYWwgKi8pIHtcclxuXHQgICAgICAgICAgICAvLyBpbXBvcnQgJ2Zvbyc7XHJcblx0ICAgICAgICAgICAgc3JjID0gdGhpcy5wYXJzZU1vZHVsZVNwZWNpZmllcigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2goJ3snKSkge1xyXG5cdCAgICAgICAgICAgICAgICAvLyBpbXBvcnQge2Jhcn1cclxuXHQgICAgICAgICAgICAgICAgc3BlY2lmaWVycyA9IHNwZWNpZmllcnMuY29uY2F0KHRoaXMucGFyc2VOYW1lZEltcG9ydHMoKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2goJyonKSkge1xyXG5cdCAgICAgICAgICAgICAgICAvLyBpbXBvcnQgKiBhcyBmb29cclxuXHQgICAgICAgICAgICAgICAgc3BlY2lmaWVycy5wdXNoKHRoaXMucGFyc2VJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXIoKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNJZGVudGlmaWVyTmFtZSh0aGlzLmxvb2thaGVhZCkgJiYgIXRoaXMubWF0Y2hLZXl3b3JkKCdkZWZhdWx0JykpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gaW1wb3J0IGZvb1xyXG5cdCAgICAgICAgICAgICAgICBzcGVjaWZpZXJzLnB1c2godGhpcy5wYXJzZUltcG9ydERlZmF1bHRTcGVjaWZpZXIoKSk7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKCcsJykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCgnKicpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0IGZvbywgKiBhcyBmb29cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzcGVjaWZpZXJzLnB1c2godGhpcy5wYXJzZUltcG9ydE5hbWVzcGFjZVNwZWNpZmllcigpKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2goJ3snKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIC8vIGltcG9ydCBmb28sIHtiYXJ9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3BlY2lmaWVycyA9IHNwZWNpZmllcnMuY29uY2F0KHRoaXMucGFyc2VOYW1lZEltcG9ydHMoKSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKHRoaXMubG9va2FoZWFkKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLm5leHRUb2tlbigpKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2Zyb20nKSkge1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMubG9va2FoZWFkLnZhbHVlID8gbWVzc2FnZXNfMS5NZXNzYWdlcy5VbmV4cGVjdGVkVG9rZW4gOiBtZXNzYWdlc18xLk1lc3NhZ2VzLk1pc3NpbmdGcm9tQ2xhdXNlO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnRocm93RXJyb3IobWVzc2FnZSwgdGhpcy5sb29rYWhlYWQudmFsdWUpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIHNyYyA9IHRoaXMucGFyc2VNb2R1bGVTcGVjaWZpZXIoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuSW1wb3J0RGVjbGFyYXRpb24oc3BlY2lmaWVycywgc3JjKSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWV4cG9ydHNcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUV4cG9ydFNwZWNpZmllciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBub2RlID0gdGhpcy5jcmVhdGVOb2RlKCk7XHJcblx0ICAgICAgICB2YXIgbG9jYWwgPSB0aGlzLnBhcnNlSWRlbnRpZmllck5hbWUoKTtcclxuXHQgICAgICAgIHZhciBleHBvcnRlZCA9IGxvY2FsO1xyXG5cdCAgICAgICAgaWYgKHRoaXMubWF0Y2hDb250ZXh0dWFsS2V5d29yZCgnYXMnKSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMubmV4dFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgZXhwb3J0ZWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllck5hbWUoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkV4cG9ydFNwZWNpZmllcihsb2NhbCwgZXhwb3J0ZWQpKTtcclxuXHQgICAgfTtcclxuXHQgICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUV4cG9ydERlY2xhcmF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaWYgKHRoaXMuY29udGV4dC5pbkZ1bmN0aW9uQm9keSkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dFcnJvcihtZXNzYWdlc18xLk1lc3NhZ2VzLklsbGVnYWxFeHBvcnREZWNsYXJhdGlvbik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB2YXIgbm9kZSA9IHRoaXMuY3JlYXRlTm9kZSgpO1xyXG5cdCAgICAgICAgdGhpcy5leHBlY3RLZXl3b3JkKCdleHBvcnQnKTtcclxuXHQgICAgICAgIHZhciBleHBvcnREZWNsYXJhdGlvbjtcclxuXHQgICAgICAgIGlmICh0aGlzLm1hdGNoS2V5d29yZCgnZGVmYXVsdCcpKSB7XHJcblx0ICAgICAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgLi4uXHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaEtleXdvcmQoJ2Z1bmN0aW9uJykpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9vICgpIHt9XHJcblx0ICAgICAgICAgICAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICgpIHt9XHJcblx0ICAgICAgICAgICAgICAgIHZhciBkZWNsYXJhdGlvbiA9IHRoaXMucGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uKHRydWUpO1xyXG5cdCAgICAgICAgICAgICAgICBleHBvcnREZWNsYXJhdGlvbiA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubWF0Y2hLZXl3b3JkKCdjbGFzcycpKSB7XHJcblx0ICAgICAgICAgICAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIGZvbyB7fVxyXG5cdCAgICAgICAgICAgICAgICB2YXIgZGVjbGFyYXRpb24gPSB0aGlzLnBhcnNlQ2xhc3NEZWNsYXJhdGlvbih0cnVlKTtcclxuXHQgICAgICAgICAgICAgICAgZXhwb3J0RGVjbGFyYXRpb24gPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihkZWNsYXJhdGlvbikpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmICh0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2FzeW5jJykpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gZiAoKSB7fVxyXG5cdCAgICAgICAgICAgICAgICAvLyBleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAoKSB7fVxyXG5cdCAgICAgICAgICAgICAgICAvLyBleHBvcnQgZGVmYXVsdCBhc3luYyB4ID0+IHhcclxuXHQgICAgICAgICAgICAgICAgdmFyIGRlY2xhcmF0aW9uID0gdGhpcy5tYXRjaEFzeW5jRnVuY3Rpb24oKSA/IHRoaXMucGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uKHRydWUpIDogdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgIGV4cG9ydERlY2xhcmF0aW9uID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5FeHBvcnREZWZhdWx0RGVjbGFyYXRpb24oZGVjbGFyYXRpb24pKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoQ29udGV4dHVhbEtleXdvcmQoJ2Zyb20nKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuLCB0aGlzLmxvb2thaGVhZC52YWx1ZSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgLy8gZXhwb3J0IGRlZmF1bHQge307XHJcblx0ICAgICAgICAgICAgICAgIC8vIGV4cG9ydCBkZWZhdWx0IFtdO1xyXG5cdCAgICAgICAgICAgICAgICAvLyBleHBvcnQgZGVmYXVsdCAoMSArIDIpO1xyXG5cdCAgICAgICAgICAgICAgICB2YXIgZGVjbGFyYXRpb24gPSB0aGlzLm1hdGNoKCd7JykgPyB0aGlzLnBhcnNlT2JqZWN0SW5pdGlhbGl6ZXIoKSA6XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoKCdbJykgPyB0aGlzLnBhcnNlQXJyYXlJbml0aWFsaXplcigpIDogdGhpcy5wYXJzZUFzc2lnbm1lbnRFeHByZXNzaW9uKCk7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgICAgICAgICBleHBvcnREZWNsYXJhdGlvbiA9IHRoaXMuZmluYWxpemUobm9kZSwgbmV3IE5vZGUuRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaCgnKicpKSB7XHJcblx0ICAgICAgICAgICAgLy8gZXhwb3J0ICogZnJvbSAnZm9vJztcclxuXHQgICAgICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaENvbnRleHR1YWxLZXl3b3JkKCdmcm9tJykpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLmxvb2thaGVhZC52YWx1ZSA/IG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuIDogbWVzc2FnZXNfMS5NZXNzYWdlcy5NaXNzaW5nRnJvbUNsYXVzZTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2UsIHRoaXMubG9va2FoZWFkLnZhbHVlKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICB2YXIgc3JjID0gdGhpcy5wYXJzZU1vZHVsZVNwZWNpZmllcigpO1xyXG5cdCAgICAgICAgICAgIHRoaXMuY29uc3VtZVNlbWljb2xvbigpO1xyXG5cdCAgICAgICAgICAgIGV4cG9ydERlY2xhcmF0aW9uID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5FeHBvcnRBbGxEZWNsYXJhdGlvbihzcmMpKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRoaXMubG9va2FoZWFkLnR5cGUgPT09IDQgLyogS2V5d29yZCAqLykge1xyXG5cdCAgICAgICAgICAgIC8vIGV4cG9ydCB2YXIgZiA9IDE7XHJcblx0ICAgICAgICAgICAgdmFyIGRlY2xhcmF0aW9uID0gdm9pZCAwO1xyXG5cdCAgICAgICAgICAgIHN3aXRjaCAodGhpcy5sb29rYWhlYWQudmFsdWUpIHtcclxuXHQgICAgICAgICAgICAgICAgY2FzZSAnbGV0JzpcclxuXHQgICAgICAgICAgICAgICAgY2FzZSAnY29uc3QnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb24gPSB0aGlzLnBhcnNlTGV4aWNhbERlY2xhcmF0aW9uKHsgaW5Gb3I6IGZhbHNlIH0pO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ3Zhcic6XHJcblx0ICAgICAgICAgICAgICAgIGNhc2UgJ2NsYXNzJzpcclxuXHQgICAgICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb24gPSB0aGlzLnBhcnNlU3RhdGVtZW50TGlzdEl0ZW0oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbih0aGlzLmxvb2thaGVhZCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGV4cG9ydERlY2xhcmF0aW9uID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5FeHBvcnROYW1lZERlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLCBbXSwgbnVsbCkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRjaEFzeW5jRnVuY3Rpb24oKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBkZWNsYXJhdGlvbiA9IHRoaXMucGFyc2VGdW5jdGlvbkRlY2xhcmF0aW9uKCk7XHJcblx0ICAgICAgICAgICAgZXhwb3J0RGVjbGFyYXRpb24gPSB0aGlzLmZpbmFsaXplKG5vZGUsIG5ldyBOb2RlLkV4cG9ydE5hbWVkRGVjbGFyYXRpb24oZGVjbGFyYXRpb24sIFtdLCBudWxsKSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB2YXIgc3BlY2lmaWVycyA9IFtdO1xyXG5cdCAgICAgICAgICAgIHZhciBzb3VyY2UgPSBudWxsO1xyXG5cdCAgICAgICAgICAgIHZhciBpc0V4cG9ydEZyb21JZGVudGlmaWVyID0gZmFsc2U7XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJ3snKTtcclxuXHQgICAgICAgICAgICB3aGlsZSAoIXRoaXMubWF0Y2goJ30nKSkge1xyXG5cdCAgICAgICAgICAgICAgICBpc0V4cG9ydEZyb21JZGVudGlmaWVyID0gaXNFeHBvcnRGcm9tSWRlbnRpZmllciB8fCB0aGlzLm1hdGNoS2V5d29yZCgnZGVmYXVsdCcpO1xyXG5cdCAgICAgICAgICAgICAgICBzcGVjaWZpZXJzLnB1c2godGhpcy5wYXJzZUV4cG9ydFNwZWNpZmllcigpKTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoKCd9JykpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwZWN0KCcsJyk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdGhpcy5leHBlY3QoJ30nKTtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5tYXRjaENvbnRleHR1YWxLZXl3b3JkKCdmcm9tJykpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gZXhwb3J0IHtkZWZhdWx0fSBmcm9tICdmb28nO1xyXG5cdCAgICAgICAgICAgICAgICAvLyBleHBvcnQge2Zvb30gZnJvbSAnZm9vJztcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgc291cmNlID0gdGhpcy5wYXJzZU1vZHVsZVNwZWNpZmllcigpO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmNvbnN1bWVTZW1pY29sb24oKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoaXNFeHBvcnRGcm9tSWRlbnRpZmllcikge1xyXG5cdCAgICAgICAgICAgICAgICAvLyBleHBvcnQge2RlZmF1bHR9OyAvLyBtaXNzaW5nIGZyb21DbGF1c2VcclxuXHQgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLmxvb2thaGVhZC52YWx1ZSA/IG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuIDogbWVzc2FnZXNfMS5NZXNzYWdlcy5NaXNzaW5nRnJvbUNsYXVzZTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd0Vycm9yKG1lc3NhZ2UsIHRoaXMubG9va2FoZWFkLnZhbHVlKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIC8vIGV4cG9ydCB7Zm9vfTtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jb25zdW1lU2VtaWNvbG9uKCk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGV4cG9ydERlY2xhcmF0aW9uID0gdGhpcy5maW5hbGl6ZShub2RlLCBuZXcgTm9kZS5FeHBvcnROYW1lZERlY2xhcmF0aW9uKG51bGwsIHNwZWNpZmllcnMsIHNvdXJjZSkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGV4cG9ydERlY2xhcmF0aW9uO1xyXG5cdCAgICB9O1xyXG5cdCAgICByZXR1cm4gUGFyc2VyO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XHJcblxuXG4vKioqLyB9LFxuLyogOSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0Ly8gRW5zdXJlIHRoZSBjb25kaXRpb24gaXMgdHJ1ZSwgb3RoZXJ3aXNlIHRocm93IGFuIGVycm9yLlxyXG5cdC8vIFRoaXMgaXMgb25seSB0byBoYXZlIGEgYmV0dGVyIGNvbnRyYWN0IHNlbWFudGljLCBpLmUuIGFub3RoZXIgc2FmZXR5IG5ldFxyXG5cdC8vIHRvIGNhdGNoIGEgbG9naWMgZXJyb3IuIFRoZSBjb25kaXRpb24gc2hhbGwgYmUgZnVsZmlsbGVkIGluIG5vcm1hbCBjYXNlLlxyXG5cdC8vIERvIE5PVCB1c2UgdGhpcyB0byBlbmZvcmNlIGEgY2VydGFpbiBjb25kaXRpb24gb24gYW55IHVzZXIgaW5wdXQuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5cdGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcclxuXHQgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcblx0ICAgIGlmICghY29uZGl0aW9uKSB7XHJcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FTU0VSVDogJyArIG1lc3NhZ2UpO1xyXG5cdCAgICB9XHJcblx0fVxyXG5cdGV4cG9ydHMuYXNzZXJ0ID0gYXNzZXJ0O1xyXG5cblxuLyoqKi8gfSxcbi8qIDEwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHQvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtY2xhc3Nlcy1wZXItZmlsZSAqL1xyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHR2YXIgRXJyb3JIYW5kbGVyID0gKGZ1bmN0aW9uICgpIHtcclxuXHQgICAgZnVuY3Rpb24gRXJyb3JIYW5kbGVyKCkge1xyXG5cdCAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuXHQgICAgICAgIHRoaXMudG9sZXJhbnQgPSBmYWxzZTtcclxuXHQgICAgfVxyXG5cdCAgICBFcnJvckhhbmRsZXIucHJvdG90eXBlLnJlY29yZEVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XHJcblx0ICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuXHQgICAgfTtcclxuXHQgICAgRXJyb3JIYW5kbGVyLnByb3RvdHlwZS50b2xlcmF0ZSA9IGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdCAgICAgICAgaWYgKHRoaXMudG9sZXJhbnQpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnJlY29yZEVycm9yKGVycm9yKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICBFcnJvckhhbmRsZXIucHJvdG90eXBlLmNvbnN0cnVjdEVycm9yID0gZnVuY3Rpb24gKG1zZywgY29sdW1uKSB7XHJcblx0ICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobXNnKTtcclxuXHQgICAgICAgIHRyeSB7XHJcblx0ICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBjYXRjaCAoYmFzZSkge1xyXG5cdCAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcblx0ICAgICAgICAgICAgaWYgKE9iamVjdC5jcmVhdGUgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7XHJcblx0ICAgICAgICAgICAgICAgIGVycm9yID0gT2JqZWN0LmNyZWF0ZShiYXNlKTtcclxuXHQgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVycm9yLCAnY29sdW1uJywgeyB2YWx1ZTogY29sdW1uIH0pO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcblx0ICAgICAgICByZXR1cm4gZXJyb3I7XHJcblx0ICAgIH07XHJcblx0ICAgIEVycm9ySGFuZGxlci5wcm90b3R5cGUuY3JlYXRlRXJyb3IgPSBmdW5jdGlvbiAoaW5kZXgsIGxpbmUsIGNvbCwgZGVzY3JpcHRpb24pIHtcclxuXHQgICAgICAgIHZhciBtc2cgPSAnTGluZSAnICsgbGluZSArICc6ICcgKyBkZXNjcmlwdGlvbjtcclxuXHQgICAgICAgIHZhciBlcnJvciA9IHRoaXMuY29uc3RydWN0RXJyb3IobXNnLCBjb2wpO1xyXG5cdCAgICAgICAgZXJyb3IuaW5kZXggPSBpbmRleDtcclxuXHQgICAgICAgIGVycm9yLmxpbmVOdW1iZXIgPSBsaW5lO1xyXG5cdCAgICAgICAgZXJyb3IuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuXHQgICAgICAgIHJldHVybiBlcnJvcjtcclxuXHQgICAgfTtcclxuXHQgICAgRXJyb3JIYW5kbGVyLnByb3RvdHlwZS50aHJvd0Vycm9yID0gZnVuY3Rpb24gKGluZGV4LCBsaW5lLCBjb2wsIGRlc2NyaXB0aW9uKSB7XHJcblx0ICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKGluZGV4LCBsaW5lLCBjb2wsIGRlc2NyaXB0aW9uKTtcclxuXHQgICAgfTtcclxuXHQgICAgRXJyb3JIYW5kbGVyLnByb3RvdHlwZS50b2xlcmF0ZUVycm9yID0gZnVuY3Rpb24gKGluZGV4LCBsaW5lLCBjb2wsIGRlc2NyaXB0aW9uKSB7XHJcblx0ICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmNyZWF0ZUVycm9yKGluZGV4LCBsaW5lLCBjb2wsIGRlc2NyaXB0aW9uKTtcclxuXHQgICAgICAgIGlmICh0aGlzLnRvbGVyYW50KSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5yZWNvcmRFcnJvcihlcnJvcik7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgcmV0dXJuIEVycm9ySGFuZGxlcjtcclxuXHR9KCkpO1xyXG5cdGV4cG9ydHMuRXJyb3JIYW5kbGVyID0gRXJyb3JIYW5kbGVyO1xyXG5cblxuLyoqKi8gfSxcbi8qIDExICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMpIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcblx0Ly8gRXJyb3IgbWVzc2FnZXMgc2hvdWxkIGJlIGlkZW50aWNhbCB0byBWOC5cclxuXHRleHBvcnRzLk1lc3NhZ2VzID0ge1xyXG5cdCAgICBCYWRHZXR0ZXJBcml0eTogJ0dldHRlciBtdXN0IG5vdCBoYXZlIGFueSBmb3JtYWwgcGFyYW1ldGVycycsXHJcblx0ICAgIEJhZFNldHRlckFyaXR5OiAnU2V0dGVyIG11c3QgaGF2ZSBleGFjdGx5IG9uZSBmb3JtYWwgcGFyYW1ldGVyJyxcclxuXHQgICAgQmFkU2V0dGVyUmVzdFBhcmFtZXRlcjogJ1NldHRlciBmdW5jdGlvbiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIHJlc3QgcGFyYW1ldGVyJyxcclxuXHQgICAgQ29uc3RydWN0b3JJc0FzeW5jOiAnQ2xhc3MgY29uc3RydWN0b3IgbWF5IG5vdCBiZSBhbiBhc3luYyBtZXRob2QnLFxyXG5cdCAgICBDb25zdHJ1Y3RvclNwZWNpYWxNZXRob2Q6ICdDbGFzcyBjb25zdHJ1Y3RvciBtYXkgbm90IGJlIGFuIGFjY2Vzc29yJyxcclxuXHQgICAgRGVjbGFyYXRpb25NaXNzaW5nSW5pdGlhbGl6ZXI6ICdNaXNzaW5nIGluaXRpYWxpemVyIGluICUwIGRlY2xhcmF0aW9uJyxcclxuXHQgICAgRGVmYXVsdFJlc3RQYXJhbWV0ZXI6ICdVbmV4cGVjdGVkIHRva2VuID0nLFxyXG5cdCAgICBEdXBsaWNhdGVCaW5kaW5nOiAnRHVwbGljYXRlIGJpbmRpbmcgJTAnLFxyXG5cdCAgICBEdXBsaWNhdGVDb25zdHJ1Y3RvcjogJ0EgY2xhc3MgbWF5IG9ubHkgaGF2ZSBvbmUgY29uc3RydWN0b3InLFxyXG5cdCAgICBEdXBsaWNhdGVQcm90b1Byb3BlcnR5OiAnRHVwbGljYXRlIF9fcHJvdG9fXyBmaWVsZHMgYXJlIG5vdCBhbGxvd2VkIGluIG9iamVjdCBsaXRlcmFscycsXHJcblx0ICAgIEZvckluT2ZMb29wSW5pdGlhbGl6ZXI6ICclMCBsb29wIHZhcmlhYmxlIGRlY2xhcmF0aW9uIG1heSBub3QgaGF2ZSBhbiBpbml0aWFsaXplcicsXHJcblx0ICAgIEdlbmVyYXRvckluTGVnYWN5Q29udGV4dDogJ0dlbmVyYXRvciBkZWNsYXJhdGlvbnMgYXJlIG5vdCBhbGxvd2VkIGluIGxlZ2FjeSBjb250ZXh0cycsXHJcblx0ICAgIElsbGVnYWxCcmVhazogJ0lsbGVnYWwgYnJlYWsgc3RhdGVtZW50JyxcclxuXHQgICAgSWxsZWdhbENvbnRpbnVlOiAnSWxsZWdhbCBjb250aW51ZSBzdGF0ZW1lbnQnLFxyXG5cdCAgICBJbGxlZ2FsRXhwb3J0RGVjbGFyYXRpb246ICdVbmV4cGVjdGVkIHRva2VuJyxcclxuXHQgICAgSWxsZWdhbEltcG9ydERlY2xhcmF0aW9uOiAnVW5leHBlY3RlZCB0b2tlbicsXHJcblx0ICAgIElsbGVnYWxMYW5ndWFnZU1vZGVEaXJlY3RpdmU6ICdJbGxlZ2FsIFxcJ3VzZSBzdHJpY3RcXCcgZGlyZWN0aXZlIGluIGZ1bmN0aW9uIHdpdGggbm9uLXNpbXBsZSBwYXJhbWV0ZXIgbGlzdCcsXHJcblx0ICAgIElsbGVnYWxSZXR1cm46ICdJbGxlZ2FsIHJldHVybiBzdGF0ZW1lbnQnLFxyXG5cdCAgICBJbnZhbGlkRXNjYXBlZFJlc2VydmVkV29yZDogJ0tleXdvcmQgbXVzdCBub3QgY29udGFpbiBlc2NhcGVkIGNoYXJhY3RlcnMnLFxyXG5cdCAgICBJbnZhbGlkSGV4RXNjYXBlU2VxdWVuY2U6ICdJbnZhbGlkIGhleGFkZWNpbWFsIGVzY2FwZSBzZXF1ZW5jZScsXHJcblx0ICAgIEludmFsaWRMSFNJbkFzc2lnbm1lbnQ6ICdJbnZhbGlkIGxlZnQtaGFuZCBzaWRlIGluIGFzc2lnbm1lbnQnLFxyXG5cdCAgICBJbnZhbGlkTEhTSW5Gb3JJbjogJ0ludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gZm9yLWluJyxcclxuXHQgICAgSW52YWxpZExIU0luRm9yTG9vcDogJ0ludmFsaWQgbGVmdC1oYW5kIHNpZGUgaW4gZm9yLWxvb3AnLFxyXG5cdCAgICBJbnZhbGlkTW9kdWxlU3BlY2lmaWVyOiAnVW5leHBlY3RlZCB0b2tlbicsXHJcblx0ICAgIEludmFsaWRSZWdFeHA6ICdJbnZhbGlkIHJlZ3VsYXIgZXhwcmVzc2lvbicsXHJcblx0ICAgIExldEluTGV4aWNhbEJpbmRpbmc6ICdsZXQgaXMgZGlzYWxsb3dlZCBhcyBhIGxleGljYWxseSBib3VuZCBuYW1lJyxcclxuXHQgICAgTWlzc2luZ0Zyb21DbGF1c2U6ICdVbmV4cGVjdGVkIHRva2VuJyxcclxuXHQgICAgTXVsdGlwbGVEZWZhdWx0c0luU3dpdGNoOiAnTW9yZSB0aGFuIG9uZSBkZWZhdWx0IGNsYXVzZSBpbiBzd2l0Y2ggc3RhdGVtZW50JyxcclxuXHQgICAgTmV3bGluZUFmdGVyVGhyb3c6ICdJbGxlZ2FsIG5ld2xpbmUgYWZ0ZXIgdGhyb3cnLFxyXG5cdCAgICBOb0FzQWZ0ZXJJbXBvcnROYW1lc3BhY2U6ICdVbmV4cGVjdGVkIHRva2VuJyxcclxuXHQgICAgTm9DYXRjaE9yRmluYWxseTogJ01pc3NpbmcgY2F0Y2ggb3IgZmluYWxseSBhZnRlciB0cnknLFxyXG5cdCAgICBQYXJhbWV0ZXJBZnRlclJlc3RQYXJhbWV0ZXI6ICdSZXN0IHBhcmFtZXRlciBtdXN0IGJlIGxhc3QgZm9ybWFsIHBhcmFtZXRlcicsXHJcblx0ICAgIFJlZGVjbGFyYXRpb246ICclMCBcXCclMVxcJyBoYXMgYWxyZWFkeSBiZWVuIGRlY2xhcmVkJyxcclxuXHQgICAgU3RhdGljUHJvdG90eXBlOiAnQ2xhc3NlcyBtYXkgbm90IGhhdmUgc3RhdGljIHByb3BlcnR5IG5hbWVkIHByb3RvdHlwZScsXHJcblx0ICAgIFN0cmljdENhdGNoVmFyaWFibGU6ICdDYXRjaCB2YXJpYWJsZSBtYXkgbm90IGJlIGV2YWwgb3IgYXJndW1lbnRzIGluIHN0cmljdCBtb2RlJyxcclxuXHQgICAgU3RyaWN0RGVsZXRlOiAnRGVsZXRlIG9mIGFuIHVucXVhbGlmaWVkIGlkZW50aWZpZXIgaW4gc3RyaWN0IG1vZGUuJyxcclxuXHQgICAgU3RyaWN0RnVuY3Rpb246ICdJbiBzdHJpY3QgbW9kZSBjb2RlLCBmdW5jdGlvbnMgY2FuIG9ubHkgYmUgZGVjbGFyZWQgYXQgdG9wIGxldmVsIG9yIGluc2lkZSBhIGJsb2NrJyxcclxuXHQgICAgU3RyaWN0RnVuY3Rpb25OYW1lOiAnRnVuY3Rpb24gbmFtZSBtYXkgbm90IGJlIGV2YWwgb3IgYXJndW1lbnRzIGluIHN0cmljdCBtb2RlJyxcclxuXHQgICAgU3RyaWN0TEhTQXNzaWdubWVudDogJ0Fzc2lnbm1lbnQgdG8gZXZhbCBvciBhcmd1bWVudHMgaXMgbm90IGFsbG93ZWQgaW4gc3RyaWN0IG1vZGUnLFxyXG5cdCAgICBTdHJpY3RMSFNQb3N0Zml4OiAnUG9zdGZpeCBpbmNyZW1lbnQvZGVjcmVtZW50IG1heSBub3QgaGF2ZSBldmFsIG9yIGFyZ3VtZW50cyBvcGVyYW5kIGluIHN0cmljdCBtb2RlJyxcclxuXHQgICAgU3RyaWN0TEhTUHJlZml4OiAnUHJlZml4IGluY3JlbWVudC9kZWNyZW1lbnQgbWF5IG5vdCBoYXZlIGV2YWwgb3IgYXJndW1lbnRzIG9wZXJhbmQgaW4gc3RyaWN0IG1vZGUnLFxyXG5cdCAgICBTdHJpY3RNb2RlV2l0aDogJ1N0cmljdCBtb2RlIGNvZGUgbWF5IG5vdCBpbmNsdWRlIGEgd2l0aCBzdGF0ZW1lbnQnLFxyXG5cdCAgICBTdHJpY3RPY3RhbExpdGVyYWw6ICdPY3RhbCBsaXRlcmFscyBhcmUgbm90IGFsbG93ZWQgaW4gc3RyaWN0IG1vZGUuJyxcclxuXHQgICAgU3RyaWN0UGFyYW1EdXBlOiAnU3RyaWN0IG1vZGUgZnVuY3Rpb24gbWF5IG5vdCBoYXZlIGR1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXMnLFxyXG5cdCAgICBTdHJpY3RQYXJhbU5hbWU6ICdQYXJhbWV0ZXIgbmFtZSBldmFsIG9yIGFyZ3VtZW50cyBpcyBub3QgYWxsb3dlZCBpbiBzdHJpY3QgbW9kZScsXHJcblx0ICAgIFN0cmljdFJlc2VydmVkV29yZDogJ1VzZSBvZiBmdXR1cmUgcmVzZXJ2ZWQgd29yZCBpbiBzdHJpY3QgbW9kZScsXHJcblx0ICAgIFN0cmljdFZhck5hbWU6ICdWYXJpYWJsZSBuYW1lIG1heSBub3QgYmUgZXZhbCBvciBhcmd1bWVudHMgaW4gc3RyaWN0IG1vZGUnLFxyXG5cdCAgICBUZW1wbGF0ZU9jdGFsTGl0ZXJhbDogJ09jdGFsIGxpdGVyYWxzIGFyZSBub3QgYWxsb3dlZCBpbiB0ZW1wbGF0ZSBzdHJpbmdzLicsXHJcblx0ICAgIFVuZXhwZWN0ZWRFT1M6ICdVbmV4cGVjdGVkIGVuZCBvZiBpbnB1dCcsXHJcblx0ICAgIFVuZXhwZWN0ZWRJZGVudGlmaWVyOiAnVW5leHBlY3RlZCBpZGVudGlmaWVyJyxcclxuXHQgICAgVW5leHBlY3RlZE51bWJlcjogJ1VuZXhwZWN0ZWQgbnVtYmVyJyxcclxuXHQgICAgVW5leHBlY3RlZFJlc2VydmVkOiAnVW5leHBlY3RlZCByZXNlcnZlZCB3b3JkJyxcclxuXHQgICAgVW5leHBlY3RlZFN0cmluZzogJ1VuZXhwZWN0ZWQgc3RyaW5nJyxcclxuXHQgICAgVW5leHBlY3RlZFRlbXBsYXRlOiAnVW5leHBlY3RlZCBxdWFzaSAlMCcsXHJcblx0ICAgIFVuZXhwZWN0ZWRUb2tlbjogJ1VuZXhwZWN0ZWQgdG9rZW4gJTAnLFxyXG5cdCAgICBVbmV4cGVjdGVkVG9rZW5JbGxlZ2FsOiAnVW5leHBlY3RlZCB0b2tlbiBJTExFR0FMJyxcclxuXHQgICAgVW5rbm93bkxhYmVsOiAnVW5kZWZpbmVkIGxhYmVsIFxcJyUwXFwnJyxcclxuXHQgICAgVW50ZXJtaW5hdGVkUmVnRXhwOiAnSW52YWxpZCByZWd1bGFyIGV4cHJlc3Npb246IG1pc3NpbmcgLydcclxuXHR9O1xyXG5cblxuLyoqKi8gfSxcbi8qIDEyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcblx0dmFyIGFzc2VydF8xID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KTtcclxuXHR2YXIgY2hhcmFjdGVyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDQpO1xyXG5cdHZhciBtZXNzYWdlc18xID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMSk7XHJcblx0ZnVuY3Rpb24gaGV4VmFsdWUoY2gpIHtcclxuXHQgICAgcmV0dXJuICcwMTIzNDU2Nzg5YWJjZGVmJy5pbmRleE9mKGNoLnRvTG93ZXJDYXNlKCkpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBvY3RhbFZhbHVlKGNoKSB7XHJcblx0ICAgIHJldHVybiAnMDEyMzQ1NjcnLmluZGV4T2YoY2gpO1xyXG5cdH1cclxuXHR2YXIgU2Nhbm5lciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFNjYW5uZXIoY29kZSwgaGFuZGxlcikge1xyXG5cdCAgICAgICAgdGhpcy5zb3VyY2UgPSBjb2RlO1xyXG5cdCAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIgPSBoYW5kbGVyO1xyXG5cdCAgICAgICAgdGhpcy50cmFja0NvbW1lbnQgPSBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMubGVuZ3RoID0gY29kZS5sZW5ndGg7XHJcblx0ICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuXHQgICAgICAgIHRoaXMubGluZU51bWJlciA9IChjb2RlLmxlbmd0aCA+IDApID8gMSA6IDA7XHJcblx0ICAgICAgICB0aGlzLmxpbmVTdGFydCA9IDA7XHJcblx0ICAgICAgICB0aGlzLmN1cmx5U3RhY2sgPSBbXTtcclxuXHQgICAgfVxyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zYXZlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxyXG5cdCAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICBsaW5lU3RhcnQ6IHRoaXMubGluZVN0YXJ0XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5yZXN0b3JlU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuXHQgICAgICAgIHRoaXMuaW5kZXggPSBzdGF0ZS5pbmRleDtcclxuXHQgICAgICAgIHRoaXMubGluZU51bWJlciA9IHN0YXRlLmxpbmVOdW1iZXI7XHJcblx0ICAgICAgICB0aGlzLmxpbmVTdGFydCA9IHN0YXRlLmxpbmVTdGFydDtcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuZW9mID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gdGhpcy5sZW5ndGg7XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnRocm93VW5leHBlY3RlZFRva2VuID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuXHQgICAgICAgIGlmIChtZXNzYWdlID09PSB2b2lkIDApIHsgbWVzc2FnZSA9IG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW5leHBlY3RlZFRva2VuSWxsZWdhbDsgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVyLnRocm93RXJyb3IodGhpcy5pbmRleCwgdGhpcy5saW5lTnVtYmVyLCB0aGlzLmluZGV4IC0gdGhpcy5saW5lU3RhcnQgKyAxLCBtZXNzYWdlKTtcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4gPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG5cdCAgICAgICAgaWYgKG1lc3NhZ2UgPT09IHZvaWQgMCkgeyBtZXNzYWdlID0gbWVzc2FnZXNfMS5NZXNzYWdlcy5VbmV4cGVjdGVkVG9rZW5JbGxlZ2FsOyB9XHJcblx0ICAgICAgICB0aGlzLmVycm9ySGFuZGxlci50b2xlcmF0ZUVycm9yKHRoaXMuaW5kZXgsIHRoaXMubGluZU51bWJlciwgdGhpcy5pbmRleCAtIHRoaXMubGluZVN0YXJ0ICsgMSwgbWVzc2FnZSk7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNvbW1lbnRzXHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNraXBTaW5nbGVMaW5lQ29tbWVudCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcclxuXHQgICAgICAgIHZhciBjb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0LCBsb2M7XHJcblx0ICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICBjb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5pbmRleCAtIG9mZnNldDtcclxuXHQgICAgICAgICAgICBsb2MgPSB7XHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuaW5kZXggLSB0aGlzLmxpbmVTdGFydCAtIG9mZnNldFxyXG5cdCAgICAgICAgICAgICAgICB9LFxyXG5cdCAgICAgICAgICAgICAgICBlbmQ6IHt9XHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCk7XHJcblx0ICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNMaW5lVGVybWluYXRvcihjaCkpIHtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMudHJhY2tDb21tZW50KSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsb2MuZW5kID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IHRoaXMubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuaW5kZXggLSB0aGlzLmxpbmVTdGFydCAtIDFcclxuXHQgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlMaW5lOiBmYWxzZSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzbGljZTogW3N0YXJ0ICsgb2Zmc2V0LCB0aGlzLmluZGV4IC0gMV0sXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IFtzdGFydCwgdGhpcy5pbmRleCAtIDFdLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogbG9jXHJcblx0ICAgICAgICAgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY29tbWVudHMucHVzaChlbnRyeSk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoID09PSAxMyAmJiB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpID09PSAxMCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLmxpbmVTdGFydCA9IHRoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBjb21tZW50cztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICBsb2MuZW5kID0ge1xyXG5cdCAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5pbmRleCAtIHRoaXMubGluZVN0YXJ0XHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICB2YXIgZW50cnkgPSB7XHJcblx0ICAgICAgICAgICAgICAgIG11bHRpTGluZTogZmFsc2UsXHJcblx0ICAgICAgICAgICAgICAgIHNsaWNlOiBbc3RhcnQgKyBvZmZzZXQsIHRoaXMuaW5kZXhdLFxyXG5cdCAgICAgICAgICAgICAgICByYW5nZTogW3N0YXJ0LCB0aGlzLmluZGV4XSxcclxuXHQgICAgICAgICAgICAgICAgbG9jOiBsb2NcclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgIGNvbW1lbnRzLnB1c2goZW50cnkpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIGNvbW1lbnRzO1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5za2lwTXVsdGlMaW5lQ29tbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBjb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0LCBsb2M7XHJcblx0ICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICBjb21tZW50cyA9IFtdO1xyXG5cdCAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5pbmRleCAtIDI7XHJcblx0ICAgICAgICAgICAgbG9jID0ge1xyXG5cdCAgICAgICAgICAgICAgICBzdGFydDoge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB0aGlzLmluZGV4IC0gdGhpcy5saW5lU3RhcnQgLSAyXHJcblx0ICAgICAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgICAgIGVuZDoge31cclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KTtcclxuXHQgICAgICAgICAgICBpZiAoY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzTGluZVRlcm1pbmF0b3IoY2gpKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gMHgwRCAmJiB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXggKyAxKSA9PT0gMHgwQSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMubGluZVN0YXJ0ID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IDB4MkEpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gQmxvY2sgY29tbWVudCBlbmRzIHdpdGggJyovJy5cclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCArIDEpID09PSAweDJGKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ICs9IDI7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsb2MuZW5kID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5pbmRleCAtIHRoaXMubGluZVN0YXJ0XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpTGluZTogdHJ1ZSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpY2U6IFtzdGFydCArIDIsIHRoaXMuaW5kZXggLSAyXSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IFtzdGFydCwgdGhpcy5pbmRleF0sXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYzogbG9jXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cy5wdXNoKGVudHJ5KTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21tZW50cztcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgLy8gUmFuIG9mZiB0aGUgZW5kIG9mIHRoZSBmaWxlIC0gdGhlIHdob2xlIHRoaW5nIGlzIGEgY29tbWVudFxyXG5cdCAgICAgICAgaWYgKHRoaXMudHJhY2tDb21tZW50KSB7XHJcblx0ICAgICAgICAgICAgbG9jLmVuZCA9IHtcclxuXHQgICAgICAgICAgICAgICAgbGluZTogdGhpcy5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuaW5kZXggLSB0aGlzLmxpbmVTdGFydFxyXG5cdCAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgdmFyIGVudHJ5ID0ge1xyXG5cdCAgICAgICAgICAgICAgICBtdWx0aUxpbmU6IHRydWUsXHJcblx0ICAgICAgICAgICAgICAgIHNsaWNlOiBbc3RhcnQgKyAyLCB0aGlzLmluZGV4XSxcclxuXHQgICAgICAgICAgICAgICAgcmFuZ2U6IFtzdGFydCwgdGhpcy5pbmRleF0sXHJcblx0ICAgICAgICAgICAgICAgIGxvYzogbG9jXHJcblx0ICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICBjb21tZW50cy5wdXNoKGVudHJ5KTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIHJldHVybiBjb21tZW50cztcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuc2NhbkNvbW1lbnRzID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGNvbW1lbnRzO1xyXG5cdCAgICAgICAgaWYgKHRoaXMudHJhY2tDb21tZW50KSB7XHJcblx0ICAgICAgICAgICAgY29tbWVudHMgPSBbXTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHZhciBzdGFydCA9ICh0aGlzLmluZGV4ID09PSAwKTtcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCk7XHJcblx0ICAgICAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc1doaXRlU3BhY2UoY2gpKSB7XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzTGluZVRlcm1pbmF0b3IoY2gpKSB7XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoID09PSAweDBEICYmIHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCkgPT09IDB4MEEpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMubGluZU51bWJlcjtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICBzdGFydCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAweDJGKSB7XHJcblx0ICAgICAgICAgICAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4ICsgMSk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gMHgyRikge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCArPSAyO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1lbnQgPSB0aGlzLnNraXBTaW5nbGVMaW5lQ29tbWVudCgyKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYWNrQ29tbWVudCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMuY29uY2F0KGNvbW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAweDJBKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ICs9IDI7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWVudCA9IHRoaXMuc2tpcE11bHRpTGluZUNvbW1lbnQoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYWNrQ29tbWVudCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMuY29uY2F0KGNvbW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQgJiYgY2ggPT09IDB4MkQpIHtcclxuXHQgICAgICAgICAgICAgICAgLy8gVSswMDNFIGlzICc+J1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoKHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCArIDEpID09PSAweDJEKSAmJiAodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4ICsgMikgPT09IDB4M0UpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAvLyAnLS0+JyBpcyBhIHNpbmdsZS1saW5lIGNvbW1lbnRcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggKz0gMztcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjb21tZW50ID0gdGhpcy5za2lwU2luZ2xlTGluZUNvbW1lbnQoMyk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cyA9IGNvbW1lbnRzLmNvbmNhdChjb21tZW50KTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAweDNDKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZS5zbGljZSh0aGlzLmluZGV4ICsgMSwgdGhpcy5pbmRleCArIDQpID09PSAnIS0tJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCArPSA0OyAvLyBgPCEtLWBcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjb21tZW50ID0gdGhpcy5za2lwU2luZ2xlTGluZUNvbW1lbnQoNCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50cyA9IGNvbW1lbnRzLmNvbmNhdChjb21tZW50KTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gY29tbWVudHM7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWZ1dHVyZS1yZXNlcnZlZC13b3Jkc1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5pc0Z1dHVyZVJlc2VydmVkV29yZCA9IGZ1bmN0aW9uIChpZCkge1xyXG5cdCAgICAgICAgc3dpdGNoIChpZCkge1xyXG5cdCAgICAgICAgICAgIGNhc2UgJ2VudW0nOlxyXG5cdCAgICAgICAgICAgIGNhc2UgJ2V4cG9ydCc6XHJcblx0ICAgICAgICAgICAgY2FzZSAnaW1wb3J0JzpcclxuXHQgICAgICAgICAgICBjYXNlICdzdXBlcic6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuaXNTdHJpY3RNb2RlUmVzZXJ2ZWRXb3JkID0gZnVuY3Rpb24gKGlkKSB7XHJcblx0ICAgICAgICBzd2l0Y2ggKGlkKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSAnaW1wbGVtZW50cyc6XHJcblx0ICAgICAgICAgICAgY2FzZSAnaW50ZXJmYWNlJzpcclxuXHQgICAgICAgICAgICBjYXNlICdwYWNrYWdlJzpcclxuXHQgICAgICAgICAgICBjYXNlICdwcml2YXRlJzpcclxuXHQgICAgICAgICAgICBjYXNlICdwcm90ZWN0ZWQnOlxyXG5cdCAgICAgICAgICAgIGNhc2UgJ3B1YmxpYyc6XHJcblx0ICAgICAgICAgICAgY2FzZSAnc3RhdGljJzpcclxuXHQgICAgICAgICAgICBjYXNlICd5aWVsZCc6XHJcblx0ICAgICAgICAgICAgY2FzZSAnbGV0JzpcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblx0ICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5pc1Jlc3RyaWN0ZWRXb3JkID0gZnVuY3Rpb24gKGlkKSB7XHJcblx0ICAgICAgICByZXR1cm4gaWQgPT09ICdldmFsJyB8fCBpZCA9PT0gJ2FyZ3VtZW50cyc7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWtleXdvcmRzXHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLmlzS2V5d29yZCA9IGZ1bmN0aW9uIChpZCkge1xyXG5cdCAgICAgICAgc3dpdGNoIChpZC5sZW5ndGgpIHtcclxuXHQgICAgICAgICAgICBjYXNlIDI6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdpZicpIHx8IChpZCA9PT0gJ2luJykgfHwgKGlkID09PSAnZG8nKTtcclxuXHQgICAgICAgICAgICBjYXNlIDM6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICd2YXInKSB8fCAoaWQgPT09ICdmb3InKSB8fCAoaWQgPT09ICduZXcnKSB8fFxyXG5cdCAgICAgICAgICAgICAgICAgICAgKGlkID09PSAndHJ5JykgfHwgKGlkID09PSAnbGV0Jyk7XHJcblx0ICAgICAgICAgICAgY2FzZSA0OlxyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gKGlkID09PSAndGhpcycpIHx8IChpZCA9PT0gJ2Vsc2UnKSB8fCAoaWQgPT09ICdjYXNlJykgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgIChpZCA9PT0gJ3ZvaWQnKSB8fCAoaWQgPT09ICd3aXRoJykgfHwgKGlkID09PSAnZW51bScpO1xyXG5cdCAgICAgICAgICAgIGNhc2UgNTpcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ3doaWxlJykgfHwgKGlkID09PSAnYnJlYWsnKSB8fCAoaWQgPT09ICdjYXRjaCcpIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAoaWQgPT09ICd0aHJvdycpIHx8IChpZCA9PT0gJ2NvbnN0JykgfHwgKGlkID09PSAneWllbGQnKSB8fFxyXG5cdCAgICAgICAgICAgICAgICAgICAgKGlkID09PSAnY2xhc3MnKSB8fCAoaWQgPT09ICdzdXBlcicpO1xyXG5cdCAgICAgICAgICAgIGNhc2UgNjpcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIChpZCA9PT0gJ3JldHVybicpIHx8IChpZCA9PT0gJ3R5cGVvZicpIHx8IChpZCA9PT0gJ2RlbGV0ZScpIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAoaWQgPT09ICdzd2l0Y2gnKSB8fCAoaWQgPT09ICdleHBvcnQnKSB8fCAoaWQgPT09ICdpbXBvcnQnKTtcclxuXHQgICAgICAgICAgICBjYXNlIDc6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdkZWZhdWx0JykgfHwgKGlkID09PSAnZmluYWxseScpIHx8IChpZCA9PT0gJ2V4dGVuZHMnKTtcclxuXHQgICAgICAgICAgICBjYXNlIDg6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiAoaWQgPT09ICdmdW5jdGlvbicpIHx8IChpZCA9PT0gJ2NvbnRpbnVlJykgfHwgKGlkID09PSAnZGVidWdnZXInKTtcclxuXHQgICAgICAgICAgICBjYXNlIDEwOlxyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gKGlkID09PSAnaW5zdGFuY2VvZicpO1xyXG5cdCAgICAgICAgICAgIGRlZmF1bHQ6XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuY29kZVBvaW50QXQgPSBmdW5jdGlvbiAoaSkge1xyXG5cdCAgICAgICAgdmFyIGNwID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdChpKTtcclxuXHQgICAgICAgIGlmIChjcCA+PSAweEQ4MDAgJiYgY3AgPD0gMHhEQkZGKSB7XHJcblx0ICAgICAgICAgICAgdmFyIHNlY29uZCA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQoaSArIDEpO1xyXG5cdCAgICAgICAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGZpcnN0ID0gY3A7XHJcblx0ICAgICAgICAgICAgICAgIGNwID0gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gY3A7XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNjYW5IZXhFc2NhcGUgPSBmdW5jdGlvbiAocHJlZml4KSB7XHJcblx0ICAgICAgICB2YXIgbGVuID0gKHByZWZpeCA9PT0gJ3UnKSA/IDQgOiAyO1xyXG5cdCAgICAgICAgdmFyIGNvZGUgPSAwO1xyXG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5lb2YoKSAmJiBjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNIZXhEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICBjb2RlID0gY29kZSAqIDE2ICsgaGV4VmFsdWUodGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXSk7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuc2NhblVuaWNvZGVDb2RlUG9pbnRFc2NhcGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgIHZhciBjb2RlID0gMDtcclxuXHQgICAgICAgIC8vIEF0IGxlYXN0LCBvbmUgaGV4IGRpZ2l0IGlzIHJlcXVpcmVkLlxyXG5cdCAgICAgICAgaWYgKGNoID09PSAnfScpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICBjaCA9IHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICAgICAgaWYgKCFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNIZXhEaWdpdChjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgY29kZSA9IGNvZGUgKiAxNiArIGhleFZhbHVlKGNoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjb2RlID4gMHgxMEZGRkYgfHwgY2ggIT09ICd9Jykge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuZnJvbUNvZGVQb2ludChjb2RlKTtcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuZ2V0SWRlbnRpZmllciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydCA9IHRoaXMuaW5kZXgrKztcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCk7XHJcblx0ICAgICAgICAgICAgaWYgKGNoID09PSAweDVDKSB7XHJcblx0ICAgICAgICAgICAgICAgIC8vIEJsYWNrc2xhc2ggKFUrMDA1QykgbWFya3MgVW5pY29kZSBlc2NhcGUgc2VxdWVuY2UuXHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBzdGFydDtcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tcGxleElkZW50aWZpZXIoKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSBpZiAoY2ggPj0gMHhEODAwICYmIGNoIDwgMHhERkZGKSB7XHJcblx0ICAgICAgICAgICAgICAgIC8vIE5lZWQgdG8gaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycy5cclxuXHQgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHN0YXJ0O1xyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21wbGV4SWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzSWRlbnRpZmllclBhcnQoY2gpKSB7XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydCwgdGhpcy5pbmRleCk7XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLmdldENvbXBsZXhJZGVudGlmaWVyID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGNwID0gdGhpcy5jb2RlUG9pbnRBdCh0aGlzLmluZGV4KTtcclxuXHQgICAgICAgIHZhciBpZCA9IGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5mcm9tQ29kZVBvaW50KGNwKTtcclxuXHQgICAgICAgIHRoaXMuaW5kZXggKz0gaWQubGVuZ3RoO1xyXG5cdCAgICAgICAgLy8gJ1xcdScgKFUrMDA1QywgVSswMDc1KSBkZW5vdGVzIGFuIGVzY2FwZWQgY2hhcmFjdGVyLlxyXG5cdCAgICAgICAgdmFyIGNoO1xyXG5cdCAgICAgICAgaWYgKGNwID09PSAweDVDKSB7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCkgIT09IDB4NzUpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlW3RoaXMuaW5kZXhdID09PSAneycpIHtcclxuXHQgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICBjaCA9IHRoaXMuc2NhblVuaWNvZGVDb2RlUG9pbnRFc2NhcGUoKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIGNoID0gdGhpcy5zY2FuSGV4RXNjYXBlKCd1Jyk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gbnVsbCB8fCBjaCA9PT0gJ1xcXFwnIHx8ICFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyU3RhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZCA9IGNoO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgY3AgPSB0aGlzLmNvZGVQb2ludEF0KHRoaXMuaW5kZXgpO1xyXG5cdCAgICAgICAgICAgIGlmICghY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzSWRlbnRpZmllclBhcnQoY3ApKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBjaCA9IGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5mcm9tQ29kZVBvaW50KGNwKTtcclxuXHQgICAgICAgICAgICBpZCArPSBjaDtcclxuXHQgICAgICAgICAgICB0aGlzLmluZGV4ICs9IGNoLmxlbmd0aDtcclxuXHQgICAgICAgICAgICAvLyAnXFx1JyAoVSswMDVDLCBVKzAwNzUpIGRlbm90ZXMgYW4gZXNjYXBlZCBjaGFyYWN0ZXIuXHJcblx0ICAgICAgICAgICAgaWYgKGNwID09PSAweDVDKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlkID0gaWQuc3Vic3RyKDAsIGlkLmxlbmd0aCAtIDEpO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSAhPT0gMHg3NSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlW3RoaXMuaW5kZXhdID09PSAneycpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5zY2FuVW5pY29kZUNvZGVQb2ludEVzY2FwZSgpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLnNjYW5IZXhFc2NhcGUoJ3UnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gbnVsbCB8fCBjaCA9PT0gJ1xcXFwnIHx8ICFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyUGFydChjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBpZCArPSBjaDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4gaWQ7XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLm9jdGFsVG9EZWNpbWFsID0gZnVuY3Rpb24gKGNoKSB7XHJcblx0ICAgICAgICAvLyBcXDAgaXMgbm90IG9jdGFsIGVzY2FwZSBzZXF1ZW5jZVxyXG5cdCAgICAgICAgdmFyIG9jdGFsID0gKGNoICE9PSAnMCcpO1xyXG5cdCAgICAgICAgdmFyIGNvZGUgPSBvY3RhbFZhbHVlKGNoKTtcclxuXHQgICAgICAgIGlmICghdGhpcy5lb2YoKSAmJiBjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNPY3RhbERpZ2l0KHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCkpKSB7XHJcblx0ICAgICAgICAgICAgb2N0YWwgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIGNvZGUgPSBjb2RlICogOCArIG9jdGFsVmFsdWUodGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXSk7XHJcblx0ICAgICAgICAgICAgLy8gMyBkaWdpdHMgYXJlIG9ubHkgYWxsb3dlZCB3aGVuIHN0cmluZyBzdGFydHNcclxuXHQgICAgICAgICAgICAvLyB3aXRoIDAsIDEsIDIsIDNcclxuXHQgICAgICAgICAgICBpZiAoJzAxMjMnLmluZGV4T2YoY2gpID49IDAgJiYgIXRoaXMuZW9mKCkgJiYgY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzT2N0YWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICBjb2RlID0gY29kZSAqIDggKyBvY3RhbFZhbHVlKHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK10pO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgY29kZTogY29kZSxcclxuXHQgICAgICAgICAgICBvY3RhbDogb2N0YWxcclxuXHQgICAgICAgIH07XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW5hbWVzLWFuZC1rZXl3b3Jkc1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuSWRlbnRpZmllciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciB0eXBlO1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgIC8vIEJhY2tzbGFzaCAoVSswMDVDKSBzdGFydHMgYW4gZXNjYXBlZCBjaGFyYWN0ZXIuXHJcblx0ICAgICAgICB2YXIgaWQgPSAodGhpcy5zb3VyY2UuY2hhckNvZGVBdChzdGFydCkgPT09IDB4NUMpID8gdGhpcy5nZXRDb21wbGV4SWRlbnRpZmllcigpIDogdGhpcy5nZXRJZGVudGlmaWVyKCk7XHJcblx0ICAgICAgICAvLyBUaGVyZSBpcyBubyBrZXl3b3JkIG9yIGxpdGVyYWwgd2l0aCBvbmx5IG9uZSBjaGFyYWN0ZXIuXHJcblx0ICAgICAgICAvLyBUaHVzLCBpdCBtdXN0IGJlIGFuIGlkZW50aWZpZXIuXHJcblx0ICAgICAgICBpZiAoaWQubGVuZ3RoID09PSAxKSB7XHJcblx0ICAgICAgICAgICAgdHlwZSA9IDMgLyogSWRlbnRpZmllciAqLztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNLZXl3b3JkKGlkKSkge1xyXG5cdCAgICAgICAgICAgIHR5cGUgPSA0IC8qIEtleXdvcmQgKi87XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmIChpZCA9PT0gJ251bGwnKSB7XHJcblx0ICAgICAgICAgICAgdHlwZSA9IDUgLyogTnVsbExpdGVyYWwgKi87XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIGlmIChpZCA9PT0gJ3RydWUnIHx8IGlkID09PSAnZmFsc2UnKSB7XHJcblx0ICAgICAgICAgICAgdHlwZSA9IDEgLyogQm9vbGVhbkxpdGVyYWwgKi87XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0eXBlID0gMyAvKiBJZGVudGlmaWVyICovO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKHR5cGUgIT09IDMgLyogSWRlbnRpZmllciAqLyAmJiAoc3RhcnQgKyBpZC5sZW5ndGggIT09IHRoaXMuaW5kZXgpKSB7XHJcblx0ICAgICAgICAgICAgdmFyIHJlc3RvcmUgPSB0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgIHRoaXMuaW5kZXggPSBzdGFydDtcclxuXHQgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZEVzY2FwZWRSZXNlcnZlZFdvcmQpO1xyXG5cdCAgICAgICAgICAgIHRoaXMuaW5kZXggPSByZXN0b3JlO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiBpZCxcclxuXHQgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgbGluZVN0YXJ0OiB0aGlzLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgZW5kOiB0aGlzLmluZGV4XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1wdW5jdHVhdG9yc1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuUHVuY3R1YXRvciA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydCA9IHRoaXMuaW5kZXg7XHJcblx0ICAgICAgICAvLyBDaGVjayBmb3IgbW9zdCBjb21tb24gc2luZ2xlLWNoYXJhY3RlciBwdW5jdHVhdG9ycy5cclxuXHQgICAgICAgIHZhciBzdHIgPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgIHN3aXRjaCAoc3RyKSB7XHJcblx0ICAgICAgICAgICAgY2FzZSAnKCc6XHJcblx0ICAgICAgICAgICAgY2FzZSAneyc6XHJcblx0ICAgICAgICAgICAgICAgIGlmIChzdHIgPT09ICd7Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJseVN0YWNrLnB1c2goJ3snKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIGNhc2UgJy4nOlxyXG5cdCAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZVt0aGlzLmluZGV4XSA9PT0gJy4nICYmIHRoaXMuc291cmNlW3RoaXMuaW5kZXggKyAxXSA9PT0gJy4nKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAvLyBTcHJlYWQgb3BlcmF0b3I6IC4uLlxyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCArPSAyO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3RyID0gJy4uLic7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgY2FzZSAnfSc6XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5jdXJseVN0YWNrLnBvcCgpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlICcpJzpcclxuXHQgICAgICAgICAgICBjYXNlICc7JzpcclxuXHQgICAgICAgICAgICBjYXNlICcsJzpcclxuXHQgICAgICAgICAgICBjYXNlICdbJzpcclxuXHQgICAgICAgICAgICBjYXNlICddJzpcclxuXHQgICAgICAgICAgICBjYXNlICc6JzpcclxuXHQgICAgICAgICAgICBjYXNlICc/JzpcclxuXHQgICAgICAgICAgICBjYXNlICd+JzpcclxuXHQgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICAvLyA0LWNoYXJhY3RlciBwdW5jdHVhdG9yLlxyXG5cdCAgICAgICAgICAgICAgICBzdHIgPSB0aGlzLnNvdXJjZS5zdWJzdHIodGhpcy5pbmRleCwgNCk7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChzdHIgPT09ICc+Pj49Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCArPSA0O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgLy8gMy1jaGFyYWN0ZXIgcHVuY3R1YXRvcnMuXHJcblx0ICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIDMpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHN0ciA9PT0gJz09PScgfHwgc3RyID09PSAnIT09JyB8fCBzdHIgPT09ICc+Pj4nIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyID09PSAnPDw9JyB8fCBzdHIgPT09ICc+Pj0nIHx8IHN0ciA9PT0gJyoqPScpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ICs9IDM7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAvLyAyLWNoYXJhY3RlciBwdW5jdHVhdG9ycy5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIDIpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdHIgPT09ICcmJicgfHwgc3RyID09PSAnfHwnIHx8IHN0ciA9PT0gJz09JyB8fCBzdHIgPT09ICchPScgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyID09PSAnKz0nIHx8IHN0ciA9PT0gJy09JyB8fCBzdHIgPT09ICcqPScgfHwgc3RyID09PSAnLz0nIHx8XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9PT0gJysrJyB8fCBzdHIgPT09ICctLScgfHwgc3RyID09PSAnPDwnIHx8IHN0ciA9PT0gJz4+JyB8fFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgPT09ICcmPScgfHwgc3RyID09PSAnfD0nIHx8IHN0ciA9PT0gJ149JyB8fCBzdHIgPT09ICclPScgfHxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyID09PSAnPD0nIHx8IHN0ciA9PT0gJz49JyB8fCBzdHIgPT09ICc9PicgfHwgc3RyID09PSAnKionKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggKz0gMjtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDEtY2hhcmFjdGVyIHB1bmN0dWF0b3JzLlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCc8Pj0hKy0qJSZ8Xi8nLmluZGV4T2Yoc3RyKSA+PSAwKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICh0aGlzLmluZGV4ID09PSBzdGFydCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgdHlwZTogNyAvKiBQdW5jdHVhdG9yICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiBzdHIsXHJcblx0ICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG5cdCAgICAgICAgICAgIGVuZDogdGhpcy5pbmRleFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtbGl0ZXJhbHMtbnVtZXJpYy1saXRlcmFsc1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuSGV4TGl0ZXJhbCA9IGZ1bmN0aW9uIChzdGFydCkge1xyXG5cdCAgICAgICAgdmFyIG51bSA9ICcnO1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgaWYgKCFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNIZXhEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgbnVtICs9IHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAobnVtLmxlbmd0aCA9PT0gMCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyU3RhcnQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSkpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgIHR5cGU6IDYgLyogTnVtZXJpY0xpdGVyYWwgKi8sXHJcblx0ICAgICAgICAgICAgdmFsdWU6IHBhcnNlSW50KCcweCcgKyBudW0sIDE2KSxcclxuXHQgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgbGluZVN0YXJ0OiB0aGlzLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgZW5kOiB0aGlzLmluZGV4XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuQmluYXJ5TGl0ZXJhbCA9IGZ1bmN0aW9uIChzdGFydCkge1xyXG5cdCAgICAgICAgdmFyIG51bSA9ICcnO1xyXG5cdCAgICAgICAgdmFyIGNoO1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgICAgICBpZiAoY2ggIT09ICcwJyAmJiBjaCAhPT0gJzEnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBudW0gKz0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChudW0ubGVuZ3RoID09PSAwKSB7XHJcblx0ICAgICAgICAgICAgLy8gb25seSAwYiBvciAwQlxyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KTtcclxuXHQgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG5cdCAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyU3RhcnQoY2gpIHx8IGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdChjaCkpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgdHlwZTogNiAvKiBOdW1lcmljTGl0ZXJhbCAqLyxcclxuXHQgICAgICAgICAgICB2YWx1ZTogcGFyc2VJbnQobnVtLCAyKSxcclxuXHQgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgbGluZVN0YXJ0OiB0aGlzLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgZW5kOiB0aGlzLmluZGV4XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuT2N0YWxMaXRlcmFsID0gZnVuY3Rpb24gKHByZWZpeCwgc3RhcnQpIHtcclxuXHQgICAgICAgIHZhciBudW0gPSAnJztcclxuXHQgICAgICAgIHZhciBvY3RhbCA9IGZhbHNlO1xyXG5cdCAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc09jdGFsRGlnaXQocHJlZml4LmNoYXJDb2RlQXQoMCkpKSB7XHJcblx0ICAgICAgICAgICAgb2N0YWwgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgIG51bSA9ICcwJyArIHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICBpZiAoIWNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc09jdGFsRGlnaXQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSkpIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIG51bSArPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4KytdO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKCFvY3RhbCAmJiBudW0ubGVuZ3RoID09PSAwKSB7XHJcblx0ICAgICAgICAgICAgLy8gb25seSAwbyBvciAwT1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyU3RhcnQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSkgfHwgY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzRGVjaW1hbERpZ2l0KHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCkpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICB0eXBlOiA2IC8qIE51bWVyaWNMaXRlcmFsICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiBwYXJzZUludChudW0sIDgpLFxyXG5cdCAgICAgICAgICAgIG9jdGFsOiBvY3RhbCxcclxuXHQgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgbGluZVN0YXJ0OiB0aGlzLmxpbmVTdGFydCxcclxuXHQgICAgICAgICAgICBzdGFydDogc3RhcnQsXHJcblx0ICAgICAgICAgICAgZW5kOiB0aGlzLmluZGV4XHJcblx0ICAgICAgICB9O1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5pc0ltcGxpY2l0T2N0YWxMaXRlcmFsID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgLy8gSW1wbGljaXQgb2N0YWwsIHVubGVzcyB0aGVyZSBpcyBhIG5vbi1vY3RhbCBkaWdpdC5cclxuXHQgICAgICAgIC8vIChBbm5leCBCLjEuMSBvbiBOdW1lcmljIExpdGVyYWxzKVxyXG5cdCAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuaW5kZXggKyAxOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc291cmNlW2ldO1xyXG5cdCAgICAgICAgICAgIGlmIChjaCA9PT0gJzgnIHx8IGNoID09PSAnOScpIHtcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBpZiAoIWNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc09jdGFsRGlnaXQoY2guY2hhckNvZGVBdCgwKSkpIHtcclxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHRydWU7XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNjYW5OdW1lcmljTGl0ZXJhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydCA9IHRoaXMuaW5kZXg7XHJcblx0ICAgICAgICB2YXIgY2ggPSB0aGlzLnNvdXJjZVtzdGFydF07XHJcblx0ICAgICAgICBhc3NlcnRfMS5hc3NlcnQoY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzRGVjaW1hbERpZ2l0KGNoLmNoYXJDb2RlQXQoMCkpIHx8IChjaCA9PT0gJy4nKSwgJ051bWVyaWMgbGl0ZXJhbCBtdXN0IHN0YXJ0IHdpdGggYSBkZWNpbWFsIGRpZ2l0IG9yIGEgZGVjaW1hbCBwb2ludCcpO1xyXG5cdCAgICAgICAgdmFyIG51bSA9ICcnO1xyXG5cdCAgICAgICAgaWYgKGNoICE9PSAnLicpIHtcclxuXHQgICAgICAgICAgICBudW0gPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4KytdO1xyXG5cdCAgICAgICAgICAgIGNoID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleF07XHJcblx0ICAgICAgICAgICAgLy8gSGV4IG51bWJlciBzdGFydHMgd2l0aCAnMHgnLlxyXG5cdCAgICAgICAgICAgIC8vIE9jdGFsIG51bWJlciBzdGFydHMgd2l0aCAnMCcuXHJcblx0ICAgICAgICAgICAgLy8gT2N0YWwgbnVtYmVyIGluIEVTNiBzdGFydHMgd2l0aCAnMG8nLlxyXG5cdCAgICAgICAgICAgIC8vIEJpbmFyeSBudW1iZXIgaW4gRVM2IHN0YXJ0cyB3aXRoICcwYicuXHJcblx0ICAgICAgICAgICAgaWYgKG51bSA9PT0gJzAnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ3gnIHx8IGNoID09PSAnWCcpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjYW5IZXhMaXRlcmFsKHN0YXJ0KTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdiJyB8fCBjaCA9PT0gJ0InKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICArK3RoaXMuaW5kZXg7XHJcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuQmluYXJ5TGl0ZXJhbChzdGFydCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoID09PSAnbycgfHwgY2ggPT09ICdPJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Nhbk9jdGFsTGl0ZXJhbChjaCwgc3RhcnQpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjaCAmJiBjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNPY3RhbERpZ2l0KGNoLmNoYXJDb2RlQXQoMCkpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ltcGxpY2l0T2N0YWxMaXRlcmFsKCkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuT2N0YWxMaXRlcmFsKGNoLCBzdGFydCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgd2hpbGUgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICBudW0gKz0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjaCA9PT0gJy4nKSB7XHJcblx0ICAgICAgICAgICAgbnVtICs9IHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICAgICAgd2hpbGUgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICBudW0gKz0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4XTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmIChjaCA9PT0gJ2UnIHx8IGNoID09PSAnRScpIHtcclxuXHQgICAgICAgICAgICBudW0gKz0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICBjaCA9IHRoaXMuc291cmNlW3RoaXMuaW5kZXhdO1xyXG5cdCAgICAgICAgICAgIGlmIChjaCA9PT0gJysnIHx8IGNoID09PSAnLScpIHtcclxuXHQgICAgICAgICAgICAgICAgbnVtICs9IHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNEZWNpbWFsRGlnaXQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSkpIHtcclxuXHQgICAgICAgICAgICAgICAgd2hpbGUgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbnVtICs9IHRoaXMuc291cmNlW3RoaXMuaW5kZXgrK107XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAoY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzSWRlbnRpZmllclN0YXJ0KHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCkpKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICB0eXBlOiA2IC8qIE51bWVyaWNMaXRlcmFsICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiBwYXJzZUZsb2F0KG51bSksXHJcblx0ICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG5cdCAgICAgICAgICAgIGVuZDogdGhpcy5pbmRleFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgfTtcclxuXHQgICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtbGl0ZXJhbHMtc3RyaW5nLWxpdGVyYWxzXHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNjYW5TdHJpbmdMaXRlcmFsID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgIHZhciBxdW90ZSA9IHRoaXMuc291cmNlW3N0YXJ0XTtcclxuXHQgICAgICAgIGFzc2VydF8xLmFzc2VydCgocXVvdGUgPT09ICdcXCcnIHx8IHF1b3RlID09PSAnXCInKSwgJ1N0cmluZyBsaXRlcmFsIG11c3Qgc3RhcnRzIHdpdGggYSBxdW90ZScpO1xyXG5cdCAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgdmFyIG9jdGFsID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgc3RyID0gJyc7XHJcblx0ICAgICAgICB3aGlsZSAoIXRoaXMuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICB2YXIgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4KytdO1xyXG5cdCAgICAgICAgICAgIGlmIChjaCA9PT0gcXVvdGUpIHtcclxuXHQgICAgICAgICAgICAgICAgcXVvdGUgPSAnJztcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxcXCcpIHtcclxuXHQgICAgICAgICAgICAgICAgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4KytdO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoIWNoIHx8ICFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2VbdGhpcy5pbmRleF0gPT09ICd7Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IHRoaXMuc2NhblVuaWNvZGVDb2RlUG9pbnRFc2NhcGUoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmVzY2FwZWRfMSA9IHRoaXMuc2NhbkhleEVzY2FwZShjaCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5lc2NhcGVkXzEgPT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdW5lc2NhcGVkXzE7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmVzY2FwZWQgPSB0aGlzLnNjYW5IZXhFc2NhcGUoY2gpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5lc2NhcGVkID09PSBudWxsKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZEhleEVzY2FwZVNlcXVlbmNlKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdW5lc2NhcGVkO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICduJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXG4nO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHInO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHQnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGInO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXGYnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXHgwQic7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzgnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzknOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9sZXJhdGVVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoICYmIGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc09jdGFsRGlnaXQoY2guY2hhckNvZGVBdCgwKSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvY3RUb0RlYyA9IHRoaXMub2N0YWxUb0RlY2ltYWwoY2gpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2N0YWwgPSBvY3RUb0RlYy5vY3RhbCB8fCBvY3RhbDtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG9jdFRvRGVjLmNvZGUpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGNoO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmxpbmVOdW1iZXI7XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInICYmIHRoaXMuc291cmNlW3RoaXMuaW5kZXhdID09PSAnXFxuJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMubGluZVN0YXJ0ID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgIHN0ciArPSBjaDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBpZiAocXVvdGUgIT09ICcnKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy5pbmRleCA9IHN0YXJ0O1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgdHlwZTogOCAvKiBTdHJpbmdMaXRlcmFsICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiBzdHIsXHJcblx0ICAgICAgICAgICAgb2N0YWw6IG9jdGFsLFxyXG5cdCAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICBsaW5lU3RhcnQ6IHRoaXMubGluZVN0YXJ0LFxyXG5cdCAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcclxuXHQgICAgICAgICAgICBlbmQ6IHRoaXMuaW5kZXhcclxuXHQgICAgICAgIH07XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRlbXBsYXRlLWxpdGVyYWwtbGV4aWNhbC1jb21wb25lbnRzXHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNjYW5UZW1wbGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBjb29rZWQgPSAnJztcclxuXHQgICAgICAgIHZhciB0ZXJtaW5hdGVkID0gZmFsc2U7XHJcblx0ICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgdmFyIGhlYWQgPSAodGhpcy5zb3VyY2Vbc3RhcnRdID09PSAnYCcpO1xyXG5cdCAgICAgICAgdmFyIHRhaWwgPSBmYWxzZTtcclxuXHQgICAgICAgIHZhciByYXdPZmZzZXQgPSAyO1xyXG5cdCAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgd2hpbGUgKCF0aGlzLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICBpZiAoY2ggPT09ICdgJykge1xyXG5cdCAgICAgICAgICAgICAgICByYXdPZmZzZXQgPSAxO1xyXG5cdCAgICAgICAgICAgICAgICB0YWlsID0gdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgdGVybWluYXRlZCA9IHRydWU7XHJcblx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJyQnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnNvdXJjZVt0aGlzLmluZGV4XSA9PT0gJ3snKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cmx5U3RhY2sucHVzaCgnJHsnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRlcm1pbmF0ZWQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgY29va2VkICs9IGNoO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcXFwnKSB7XHJcblx0ICAgICAgICAgICAgICAgIGNoID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICAgICAgaWYgKCFjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaCkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gJ1xcbic7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3InOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gJ1xccic7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gJ1xcdCc7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zb3VyY2VbdGhpcy5pbmRleF0gPT09ICd7Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9IHRoaXMuc2NhblVuaWNvZGVDb2RlUG9pbnRFc2NhcGUoKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN0b3JlID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmVzY2FwZWRfMiA9IHRoaXMuc2NhbkhleEVzY2FwZShjaCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5lc2NhcGVkXzIgIT09IG51bGwpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gdW5lc2NhcGVkXzI7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gcmVzdG9yZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gY2g7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneCc6XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bmVzY2FwZWQgPSB0aGlzLnNjYW5IZXhFc2NhcGUoY2gpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5lc2NhcGVkID09PSBudWxsKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZEhleEVzY2FwZVNlcXVlbmNlKTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gdW5lc2NhcGVkO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdiJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXGInO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdmJzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXGYnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd2JzpcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXHYnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICcwJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElsbGVnYWw6IFxcMDEgXFwwMiBhbmQgc28gb25cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuVGVtcGxhdGVPY3RhbExpdGVyYWwpO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXDAnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc09jdGFsRGlnaXQoY2guY2hhckNvZGVBdCgwKSkpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElsbGVnYWw6IFxcMSBcXDJcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4obWVzc2FnZXNfMS5NZXNzYWdlcy5UZW1wbGF0ZU9jdGFsTGl0ZXJhbCk7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29rZWQgKz0gY2g7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICArK3RoaXMubGluZU51bWJlcjtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgdGhpcy5zb3VyY2VbdGhpcy5pbmRleF0gPT09ICdcXG4nKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XHJcblx0ICAgICAgICAgICAgICAgICsrdGhpcy5saW5lTnVtYmVyO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInICYmIHRoaXMuc291cmNlW3RoaXMuaW5kZXhdID09PSAnXFxuJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMubGluZVN0YXJ0ID0gdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICAgICAgY29va2VkICs9ICdcXG4nO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgY29va2VkICs9IGNoO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICghdGVybWluYXRlZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4oKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIGlmICghaGVhZCkge1xyXG5cdCAgICAgICAgICAgIHRoaXMuY3VybHlTdGFjay5wb3AoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB7XHJcblx0ICAgICAgICAgICAgdHlwZTogMTAgLyogVGVtcGxhdGUgKi8sXHJcblx0ICAgICAgICAgICAgdmFsdWU6IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0ICsgMSwgdGhpcy5pbmRleCAtIHJhd09mZnNldCksXHJcblx0ICAgICAgICAgICAgY29va2VkOiBjb29rZWQsXHJcblx0ICAgICAgICAgICAgaGVhZDogaGVhZCxcclxuXHQgICAgICAgICAgICB0YWlsOiB0YWlsLFxyXG5cdCAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICBsaW5lU3RhcnQ6IHRoaXMubGluZVN0YXJ0LFxyXG5cdCAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcclxuXHQgICAgICAgICAgICBlbmQ6IHRoaXMuaW5kZXhcclxuXHQgICAgICAgIH07XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWxpdGVyYWxzLXJlZ3VsYXItZXhwcmVzc2lvbi1saXRlcmFsc1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS50ZXN0UmVnRXhwID0gZnVuY3Rpb24gKHBhdHRlcm4sIGZsYWdzKSB7XHJcblx0ICAgICAgICAvLyBUaGUgQk1QIGNoYXJhY3RlciB0byB1c2UgYXMgYSByZXBsYWNlbWVudCBmb3IgYXN0cmFsIHN5bWJvbHMgd2hlblxyXG5cdCAgICAgICAgLy8gdHJhbnNsYXRpbmcgYW4gRVM2IFwidVwiLWZsYWdnZWQgcGF0dGVybiB0byBhbiBFUzUtY29tcGF0aWJsZVxyXG5cdCAgICAgICAgLy8gYXBwcm94aW1hdGlvbi5cclxuXHQgICAgICAgIC8vIE5vdGU6IHJlcGxhY2luZyB3aXRoICdcXHVGRkZGJyBlbmFibGVzIGZhbHNlIHBvc2l0aXZlcyBpbiB1bmxpa2VseVxyXG5cdCAgICAgICAgLy8gc2NlbmFyaW9zLiBGb3IgZXhhbXBsZSwgYFtcXHV7MTA0NGZ9LVxcdXsxMDQ0MH1dYCBpcyBhbiBpbnZhbGlkXHJcblx0ICAgICAgICAvLyBwYXR0ZXJuIHRoYXQgd291bGQgbm90IGJlIGRldGVjdGVkIGJ5IHRoaXMgc3Vic3RpdHV0aW9uLlxyXG5cdCAgICAgICAgdmFyIGFzdHJhbFN1YnN0aXR1dGUgPSAnXFx1RkZGRic7XHJcblx0ICAgICAgICB2YXIgdG1wID0gcGF0dGVybjtcclxuXHQgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHQgICAgICAgIGlmIChmbGFncy5pbmRleE9mKCd1JykgPj0gMCkge1xyXG5cdCAgICAgICAgICAgIHRtcCA9IHRtcFxyXG5cdCAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXHVcXHsoWzAtOWEtZkEtRl0rKVxcfXxcXFxcdShbYS1mQS1GMC05XXs0fSkvZywgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGNvZGVQb2ludCA9IHBhcnNlSW50KCQxIHx8ICQyLCAxNik7XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjb2RlUG9pbnQgPiAweDEwRkZGRikge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgc2VsZi50aHJvd1VuZXhwZWN0ZWRUb2tlbihtZXNzYWdlc18xLk1lc3NhZ2VzLkludmFsaWRSZWdFeHApO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiBhc3RyYWxTdWJzdGl0dXRlO1xyXG5cdCAgICAgICAgICAgIH0pXHJcblx0ICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdL2csIGFzdHJhbFN1YnN0aXR1dGUpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgLy8gRmlyc3QsIGRldGVjdCBpbnZhbGlkIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXHJcblx0ICAgICAgICB0cnkge1xyXG5cdCAgICAgICAgICAgIFJlZ0V4cCh0bXApO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHQgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuSW52YWxpZFJlZ0V4cCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICAvLyBSZXR1cm4gYSByZWd1bGFyIGV4cHJlc3Npb24gb2JqZWN0IGZvciB0aGlzIHBhdHRlcm4tZmxhZyBwYWlyLCBvclxyXG5cdCAgICAgICAgLy8gYG51bGxgIGluIGNhc2UgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgZG9lc24ndCBzdXBwb3J0IHRoZSBmbGFncyBpdFxyXG5cdCAgICAgICAgLy8gdXNlcy5cclxuXHQgICAgICAgIHRyeSB7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybiwgZmxhZ3MpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG5cdCAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcblx0ICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH07XHJcblx0ICAgIFNjYW5uZXIucHJvdG90eXBlLnNjYW5SZWdFeHBCb2R5ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIGNoID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleF07XHJcblx0ICAgICAgICBhc3NlcnRfMS5hc3NlcnQoY2ggPT09ICcvJywgJ1JlZ3VsYXIgZXhwcmVzc2lvbiBsaXRlcmFsIG11c3Qgc3RhcnQgd2l0aCBhIHNsYXNoJyk7XHJcblx0ICAgICAgICB2YXIgc3RyID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgIHZhciBjbGFzc01hcmtlciA9IGZhbHNlO1xyXG5cdCAgICAgICAgdmFyIHRlcm1pbmF0ZWQgPSBmYWxzZTtcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIGNoID0gdGhpcy5zb3VyY2VbdGhpcy5pbmRleCsrXTtcclxuXHQgICAgICAgICAgICBzdHIgKz0gY2g7XHJcblx0ICAgICAgICAgICAgaWYgKGNoID09PSAnXFxcXCcpIHtcclxuXHQgICAgICAgICAgICAgICAgY2ggPSB0aGlzLnNvdXJjZVt0aGlzLmluZGV4KytdO1xyXG5cdCAgICAgICAgICAgICAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1saXRlcmFscy1yZWd1bGFyLWV4cHJlc3Npb24tbGl0ZXJhbHNcclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnRocm93VW5leHBlY3RlZFRva2VuKG1lc3NhZ2VzXzEuTWVzc2FnZXMuVW50ZXJtaW5hdGVkUmVnRXhwKTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMudGhyb3dVbmV4cGVjdGVkVG9rZW4obWVzc2FnZXNfMS5NZXNzYWdlcy5VbnRlcm1pbmF0ZWRSZWdFeHApO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIGlmIChjbGFzc01hcmtlcikge1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICddJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgaWYgKGNoID09PSAnLycpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHRlcm1pbmF0ZWQgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdbJykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSB0cnVlO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKCF0ZXJtaW5hdGVkKSB7XHJcblx0ICAgICAgICAgICAgdGhpcy50aHJvd1VuZXhwZWN0ZWRUb2tlbihtZXNzYWdlc18xLk1lc3NhZ2VzLlVudGVybWluYXRlZFJlZ0V4cCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICAvLyBFeGNsdWRlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoLlxyXG5cdCAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoMSwgc3RyLmxlbmd0aCAtIDIpO1xyXG5cdCAgICB9O1xyXG5cdCAgICBTY2FubmVyLnByb3RvdHlwZS5zY2FuUmVnRXhwRmxhZ3MgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICB2YXIgc3RyID0gJyc7XHJcblx0ICAgICAgICB2YXIgZmxhZ3MgPSAnJztcclxuXHQgICAgICAgIHdoaWxlICghdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuc291cmNlW3RoaXMuaW5kZXhdO1xyXG5cdCAgICAgICAgICAgIGlmICghY2hhcmFjdGVyXzEuQ2hhcmFjdGVyLmlzSWRlbnRpZmllclBhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcclxuXHQgICAgICAgICAgICAgICAgYnJlYWs7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICsrdGhpcy5pbmRleDtcclxuXHQgICAgICAgICAgICBpZiAoY2ggPT09ICdcXFxcJyAmJiAhdGhpcy5lb2YoKSkge1xyXG5cdCAgICAgICAgICAgICAgICBjaCA9IHRoaXMuc291cmNlW3RoaXMuaW5kZXhdO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICd1Jykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgKyt0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3RvcmUgPSB0aGlzLmluZGV4O1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXIgPSB0aGlzLnNjYW5IZXhFc2NhcGUoJ3UnKTtcclxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChjaGFyICE9PSBudWxsKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ3MgKz0gY2hhcjtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHN0ciArPSAnXFxcXHUnOyByZXN0b3JlIDwgdGhpcy5pbmRleDsgKytyZXN0b3JlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSB0aGlzLnNvdXJjZVtyZXN0b3JlXTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gcmVzdG9yZTtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBmbGFncyArPSAndSc7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcdSc7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLnRvbGVyYXRlVW5leHBlY3RlZFRva2VuKCk7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgZWxzZSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFwnO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b2xlcmF0ZVVuZXhwZWN0ZWRUb2tlbigpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2Uge1xyXG5cdCAgICAgICAgICAgICAgICBmbGFncyArPSBjaDtcclxuXHQgICAgICAgICAgICAgICAgc3RyICs9IGNoO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiBmbGFncztcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUuc2NhblJlZ0V4cCA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIHZhciBzdGFydCA9IHRoaXMuaW5kZXg7XHJcblx0ICAgICAgICB2YXIgcGF0dGVybiA9IHRoaXMuc2NhblJlZ0V4cEJvZHkoKTtcclxuXHQgICAgICAgIHZhciBmbGFncyA9IHRoaXMuc2NhblJlZ0V4cEZsYWdzKCk7XHJcblx0ICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnRlc3RSZWdFeHAocGF0dGVybiwgZmxhZ3MpO1xyXG5cdCAgICAgICAgcmV0dXJuIHtcclxuXHQgICAgICAgICAgICB0eXBlOiA5IC8qIFJlZ3VsYXJFeHByZXNzaW9uICovLFxyXG5cdCAgICAgICAgICAgIHZhbHVlOiAnJyxcclxuXHQgICAgICAgICAgICBwYXR0ZXJuOiBwYXR0ZXJuLFxyXG5cdCAgICAgICAgICAgIGZsYWdzOiBmbGFncyxcclxuXHQgICAgICAgICAgICByZWdleDogdmFsdWUsXHJcblx0ICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5saW5lTnVtYmVyLFxyXG5cdCAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxyXG5cdCAgICAgICAgICAgIGVuZDogdGhpcy5pbmRleFxyXG5cdCAgICAgICAgfTtcclxuXHQgICAgfTtcclxuXHQgICAgU2Nhbm5lci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgaWYgKHRoaXMuZW9mKCkpIHtcclxuXHQgICAgICAgICAgICByZXR1cm4ge1xyXG5cdCAgICAgICAgICAgICAgICB0eXBlOiAyIC8qIEVPRiAqLyxcclxuXHQgICAgICAgICAgICAgICAgdmFsdWU6ICcnLFxyXG5cdCAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgIGxpbmVTdGFydDogdGhpcy5saW5lU3RhcnQsXHJcblx0ICAgICAgICAgICAgICAgIHN0YXJ0OiB0aGlzLmluZGV4LFxyXG5cdCAgICAgICAgICAgICAgICBlbmQ6IHRoaXMuaW5kZXhcclxuXHQgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgdmFyIGNwID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KTtcclxuXHQgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNJZGVudGlmaWVyU3RhcnQoY3ApKSB7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NhbklkZW50aWZpZXIoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8vIFZlcnkgY29tbW9uOiAoIGFuZCApIGFuZCA7XHJcblx0ICAgICAgICBpZiAoY3AgPT09IDB4MjggfHwgY3AgPT09IDB4MjkgfHwgY3AgPT09IDB4M0IpIHtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuUHVuY3R1YXRvcigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgLy8gU3RyaW5nIGxpdGVyYWwgc3RhcnRzIHdpdGggc2luZ2xlIHF1b3RlIChVKzAwMjcpIG9yIGRvdWJsZSBxdW90ZSAoVSswMDIyKS5cclxuXHQgICAgICAgIGlmIChjcCA9PT0gMHgyNyB8fCBjcCA9PT0gMHgyMikge1xyXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLnNjYW5TdHJpbmdMaXRlcmFsKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICAvLyBEb3QgKC4pIFUrMDAyRSBjYW4gYWxzbyBzdGFydCBhIGZsb2F0aW5nLXBvaW50IG51bWJlciwgaGVuY2UgdGhlIG5lZWRcclxuXHQgICAgICAgIC8vIHRvIGNoZWNrIHRoZSBuZXh0IGNoYXJhY3Rlci5cclxuXHQgICAgICAgIGlmIChjcCA9PT0gMHgyRSkge1xyXG5cdCAgICAgICAgICAgIGlmIChjaGFyYWN0ZXJfMS5DaGFyYWN0ZXIuaXNEZWNpbWFsRGlnaXQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4ICsgMSkpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNjYW5OdW1lcmljTGl0ZXJhbCgpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuUHVuY3R1YXRvcigpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0RlY2ltYWxEaWdpdChjcCkpIHtcclxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuTnVtZXJpY0xpdGVyYWwoKTtcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIC8vIFRlbXBsYXRlIGxpdGVyYWxzIHN0YXJ0IHdpdGggYCAoVSswMDYwKSBmb3IgdGVtcGxhdGUgaGVhZFxyXG5cdCAgICAgICAgLy8gb3IgfSAoVSswMDdEKSBmb3IgdGVtcGxhdGUgbWlkZGxlIG9yIHRlbXBsYXRlIHRhaWwuXHJcblx0ICAgICAgICBpZiAoY3AgPT09IDB4NjAgfHwgKGNwID09PSAweDdEICYmIHRoaXMuY3VybHlTdGFja1t0aGlzLmN1cmx5U3RhY2subGVuZ3RoIC0gMV0gPT09ICckeycpKSB7XHJcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2NhblRlbXBsYXRlKCk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICAvLyBQb3NzaWJsZSBpZGVudGlmaWVyIHN0YXJ0IGluIGEgc3Vycm9nYXRlIHBhaXIuXHJcblx0ICAgICAgICBpZiAoY3AgPj0gMHhEODAwICYmIGNwIDwgMHhERkZGKSB7XHJcblx0ICAgICAgICAgICAgaWYgKGNoYXJhY3Rlcl8xLkNoYXJhY3Rlci5pc0lkZW50aWZpZXJTdGFydCh0aGlzLmNvZGVQb2ludEF0KHRoaXMuaW5kZXgpKSkge1xyXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuSWRlbnRpZmllcigpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLnNjYW5QdW5jdHVhdG9yKCk7XHJcblx0ICAgIH07XHJcblx0ICAgIHJldHVybiBTY2FubmVyO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5TY2FubmVyID0gU2Nhbm5lcjtcclxuXG5cbi8qKiovIH0sXG4vKiAxMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5cdGV4cG9ydHMuVG9rZW5OYW1lID0ge307XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbMSAvKiBCb29sZWFuTGl0ZXJhbCAqL10gPSAnQm9vbGVhbic7XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbMiAvKiBFT0YgKi9dID0gJzxlbmQ+JztcclxuXHRleHBvcnRzLlRva2VuTmFtZVszIC8qIElkZW50aWZpZXIgKi9dID0gJ0lkZW50aWZpZXInO1xyXG5cdGV4cG9ydHMuVG9rZW5OYW1lWzQgLyogS2V5d29yZCAqL10gPSAnS2V5d29yZCc7XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbNSAvKiBOdWxsTGl0ZXJhbCAqL10gPSAnTnVsbCc7XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbNiAvKiBOdW1lcmljTGl0ZXJhbCAqL10gPSAnTnVtZXJpYyc7XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbNyAvKiBQdW5jdHVhdG9yICovXSA9ICdQdW5jdHVhdG9yJztcclxuXHRleHBvcnRzLlRva2VuTmFtZVs4IC8qIFN0cmluZ0xpdGVyYWwgKi9dID0gJ1N0cmluZyc7XHJcblx0ZXhwb3J0cy5Ub2tlbk5hbWVbOSAvKiBSZWd1bGFyRXhwcmVzc2lvbiAqL10gPSAnUmVndWxhckV4cHJlc3Npb24nO1xyXG5cdGV4cG9ydHMuVG9rZW5OYW1lWzEwIC8qIFRlbXBsYXRlICovXSA9ICdUZW1wbGF0ZSc7XHJcblxuXG4vKioqLyB9LFxuLyogMTQgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdFwidXNlIHN0cmljdFwiO1xyXG5cdC8vIEdlbmVyYXRlZCBieSBnZW5lcmF0ZS14aHRtbC1lbnRpdGllcy5qcy4gRE8gTk9UIE1PRElGWSFcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcblx0ZXhwb3J0cy5YSFRNTEVudGl0aWVzID0ge1xyXG5cdCAgICBxdW90OiAnXFx1MDAyMicsXHJcblx0ICAgIGFtcDogJ1xcdTAwMjYnLFxyXG5cdCAgICBhcG9zOiAnXFx1MDAyNycsXHJcblx0ICAgIGd0OiAnXFx1MDAzRScsXHJcblx0ICAgIG5ic3A6ICdcXHUwMEEwJyxcclxuXHQgICAgaWV4Y2w6ICdcXHUwMEExJyxcclxuXHQgICAgY2VudDogJ1xcdTAwQTInLFxyXG5cdCAgICBwb3VuZDogJ1xcdTAwQTMnLFxyXG5cdCAgICBjdXJyZW46ICdcXHUwMEE0JyxcclxuXHQgICAgeWVuOiAnXFx1MDBBNScsXHJcblx0ICAgIGJydmJhcjogJ1xcdTAwQTYnLFxyXG5cdCAgICBzZWN0OiAnXFx1MDBBNycsXHJcblx0ICAgIHVtbDogJ1xcdTAwQTgnLFxyXG5cdCAgICBjb3B5OiAnXFx1MDBBOScsXHJcblx0ICAgIG9yZGY6ICdcXHUwMEFBJyxcclxuXHQgICAgbGFxdW86ICdcXHUwMEFCJyxcclxuXHQgICAgbm90OiAnXFx1MDBBQycsXHJcblx0ICAgIHNoeTogJ1xcdTAwQUQnLFxyXG5cdCAgICByZWc6ICdcXHUwMEFFJyxcclxuXHQgICAgbWFjcjogJ1xcdTAwQUYnLFxyXG5cdCAgICBkZWc6ICdcXHUwMEIwJyxcclxuXHQgICAgcGx1c21uOiAnXFx1MDBCMScsXHJcblx0ICAgIHN1cDI6ICdcXHUwMEIyJyxcclxuXHQgICAgc3VwMzogJ1xcdTAwQjMnLFxyXG5cdCAgICBhY3V0ZTogJ1xcdTAwQjQnLFxyXG5cdCAgICBtaWNybzogJ1xcdTAwQjUnLFxyXG5cdCAgICBwYXJhOiAnXFx1MDBCNicsXHJcblx0ICAgIG1pZGRvdDogJ1xcdTAwQjcnLFxyXG5cdCAgICBjZWRpbDogJ1xcdTAwQjgnLFxyXG5cdCAgICBzdXAxOiAnXFx1MDBCOScsXHJcblx0ICAgIG9yZG06ICdcXHUwMEJBJyxcclxuXHQgICAgcmFxdW86ICdcXHUwMEJCJyxcclxuXHQgICAgZnJhYzE0OiAnXFx1MDBCQycsXHJcblx0ICAgIGZyYWMxMjogJ1xcdTAwQkQnLFxyXG5cdCAgICBmcmFjMzQ6ICdcXHUwMEJFJyxcclxuXHQgICAgaXF1ZXN0OiAnXFx1MDBCRicsXHJcblx0ICAgIEFncmF2ZTogJ1xcdTAwQzAnLFxyXG5cdCAgICBBYWN1dGU6ICdcXHUwMEMxJyxcclxuXHQgICAgQWNpcmM6ICdcXHUwMEMyJyxcclxuXHQgICAgQXRpbGRlOiAnXFx1MDBDMycsXHJcblx0ICAgIEF1bWw6ICdcXHUwMEM0JyxcclxuXHQgICAgQXJpbmc6ICdcXHUwMEM1JyxcclxuXHQgICAgQUVsaWc6ICdcXHUwMEM2JyxcclxuXHQgICAgQ2NlZGlsOiAnXFx1MDBDNycsXHJcblx0ICAgIEVncmF2ZTogJ1xcdTAwQzgnLFxyXG5cdCAgICBFYWN1dGU6ICdcXHUwMEM5JyxcclxuXHQgICAgRWNpcmM6ICdcXHUwMENBJyxcclxuXHQgICAgRXVtbDogJ1xcdTAwQ0InLFxyXG5cdCAgICBJZ3JhdmU6ICdcXHUwMENDJyxcclxuXHQgICAgSWFjdXRlOiAnXFx1MDBDRCcsXHJcblx0ICAgIEljaXJjOiAnXFx1MDBDRScsXHJcblx0ICAgIEl1bWw6ICdcXHUwMENGJyxcclxuXHQgICAgRVRIOiAnXFx1MDBEMCcsXHJcblx0ICAgIE50aWxkZTogJ1xcdTAwRDEnLFxyXG5cdCAgICBPZ3JhdmU6ICdcXHUwMEQyJyxcclxuXHQgICAgT2FjdXRlOiAnXFx1MDBEMycsXHJcblx0ICAgIE9jaXJjOiAnXFx1MDBENCcsXHJcblx0ICAgIE90aWxkZTogJ1xcdTAwRDUnLFxyXG5cdCAgICBPdW1sOiAnXFx1MDBENicsXHJcblx0ICAgIHRpbWVzOiAnXFx1MDBENycsXHJcblx0ICAgIE9zbGFzaDogJ1xcdTAwRDgnLFxyXG5cdCAgICBVZ3JhdmU6ICdcXHUwMEQ5JyxcclxuXHQgICAgVWFjdXRlOiAnXFx1MDBEQScsXHJcblx0ICAgIFVjaXJjOiAnXFx1MDBEQicsXHJcblx0ICAgIFV1bWw6ICdcXHUwMERDJyxcclxuXHQgICAgWWFjdXRlOiAnXFx1MDBERCcsXHJcblx0ICAgIFRIT1JOOiAnXFx1MDBERScsXHJcblx0ICAgIHN6bGlnOiAnXFx1MDBERicsXHJcblx0ICAgIGFncmF2ZTogJ1xcdTAwRTAnLFxyXG5cdCAgICBhYWN1dGU6ICdcXHUwMEUxJyxcclxuXHQgICAgYWNpcmM6ICdcXHUwMEUyJyxcclxuXHQgICAgYXRpbGRlOiAnXFx1MDBFMycsXHJcblx0ICAgIGF1bWw6ICdcXHUwMEU0JyxcclxuXHQgICAgYXJpbmc6ICdcXHUwMEU1JyxcclxuXHQgICAgYWVsaWc6ICdcXHUwMEU2JyxcclxuXHQgICAgY2NlZGlsOiAnXFx1MDBFNycsXHJcblx0ICAgIGVncmF2ZTogJ1xcdTAwRTgnLFxyXG5cdCAgICBlYWN1dGU6ICdcXHUwMEU5JyxcclxuXHQgICAgZWNpcmM6ICdcXHUwMEVBJyxcclxuXHQgICAgZXVtbDogJ1xcdTAwRUInLFxyXG5cdCAgICBpZ3JhdmU6ICdcXHUwMEVDJyxcclxuXHQgICAgaWFjdXRlOiAnXFx1MDBFRCcsXHJcblx0ICAgIGljaXJjOiAnXFx1MDBFRScsXHJcblx0ICAgIGl1bWw6ICdcXHUwMEVGJyxcclxuXHQgICAgZXRoOiAnXFx1MDBGMCcsXHJcblx0ICAgIG50aWxkZTogJ1xcdTAwRjEnLFxyXG5cdCAgICBvZ3JhdmU6ICdcXHUwMEYyJyxcclxuXHQgICAgb2FjdXRlOiAnXFx1MDBGMycsXHJcblx0ICAgIG9jaXJjOiAnXFx1MDBGNCcsXHJcblx0ICAgIG90aWxkZTogJ1xcdTAwRjUnLFxyXG5cdCAgICBvdW1sOiAnXFx1MDBGNicsXHJcblx0ICAgIGRpdmlkZTogJ1xcdTAwRjcnLFxyXG5cdCAgICBvc2xhc2g6ICdcXHUwMEY4JyxcclxuXHQgICAgdWdyYXZlOiAnXFx1MDBGOScsXHJcblx0ICAgIHVhY3V0ZTogJ1xcdTAwRkEnLFxyXG5cdCAgICB1Y2lyYzogJ1xcdTAwRkInLFxyXG5cdCAgICB1dW1sOiAnXFx1MDBGQycsXHJcblx0ICAgIHlhY3V0ZTogJ1xcdTAwRkQnLFxyXG5cdCAgICB0aG9ybjogJ1xcdTAwRkUnLFxyXG5cdCAgICB5dW1sOiAnXFx1MDBGRicsXHJcblx0ICAgIE9FbGlnOiAnXFx1MDE1MicsXHJcblx0ICAgIG9lbGlnOiAnXFx1MDE1MycsXHJcblx0ICAgIFNjYXJvbjogJ1xcdTAxNjAnLFxyXG5cdCAgICBzY2Fyb246ICdcXHUwMTYxJyxcclxuXHQgICAgWXVtbDogJ1xcdTAxNzgnLFxyXG5cdCAgICBmbm9mOiAnXFx1MDE5MicsXHJcblx0ICAgIGNpcmM6ICdcXHUwMkM2JyxcclxuXHQgICAgdGlsZGU6ICdcXHUwMkRDJyxcclxuXHQgICAgQWxwaGE6ICdcXHUwMzkxJyxcclxuXHQgICAgQmV0YTogJ1xcdTAzOTInLFxyXG5cdCAgICBHYW1tYTogJ1xcdTAzOTMnLFxyXG5cdCAgICBEZWx0YTogJ1xcdTAzOTQnLFxyXG5cdCAgICBFcHNpbG9uOiAnXFx1MDM5NScsXHJcblx0ICAgIFpldGE6ICdcXHUwMzk2JyxcclxuXHQgICAgRXRhOiAnXFx1MDM5NycsXHJcblx0ICAgIFRoZXRhOiAnXFx1MDM5OCcsXHJcblx0ICAgIElvdGE6ICdcXHUwMzk5JyxcclxuXHQgICAgS2FwcGE6ICdcXHUwMzlBJyxcclxuXHQgICAgTGFtYmRhOiAnXFx1MDM5QicsXHJcblx0ICAgIE11OiAnXFx1MDM5QycsXHJcblx0ICAgIE51OiAnXFx1MDM5RCcsXHJcblx0ICAgIFhpOiAnXFx1MDM5RScsXHJcblx0ICAgIE9taWNyb246ICdcXHUwMzlGJyxcclxuXHQgICAgUGk6ICdcXHUwM0EwJyxcclxuXHQgICAgUmhvOiAnXFx1MDNBMScsXHJcblx0ICAgIFNpZ21hOiAnXFx1MDNBMycsXHJcblx0ICAgIFRhdTogJ1xcdTAzQTQnLFxyXG5cdCAgICBVcHNpbG9uOiAnXFx1MDNBNScsXHJcblx0ICAgIFBoaTogJ1xcdTAzQTYnLFxyXG5cdCAgICBDaGk6ICdcXHUwM0E3JyxcclxuXHQgICAgUHNpOiAnXFx1MDNBOCcsXHJcblx0ICAgIE9tZWdhOiAnXFx1MDNBOScsXHJcblx0ICAgIGFscGhhOiAnXFx1MDNCMScsXHJcblx0ICAgIGJldGE6ICdcXHUwM0IyJyxcclxuXHQgICAgZ2FtbWE6ICdcXHUwM0IzJyxcclxuXHQgICAgZGVsdGE6ICdcXHUwM0I0JyxcclxuXHQgICAgZXBzaWxvbjogJ1xcdTAzQjUnLFxyXG5cdCAgICB6ZXRhOiAnXFx1MDNCNicsXHJcblx0ICAgIGV0YTogJ1xcdTAzQjcnLFxyXG5cdCAgICB0aGV0YTogJ1xcdTAzQjgnLFxyXG5cdCAgICBpb3RhOiAnXFx1MDNCOScsXHJcblx0ICAgIGthcHBhOiAnXFx1MDNCQScsXHJcblx0ICAgIGxhbWJkYTogJ1xcdTAzQkInLFxyXG5cdCAgICBtdTogJ1xcdTAzQkMnLFxyXG5cdCAgICBudTogJ1xcdTAzQkQnLFxyXG5cdCAgICB4aTogJ1xcdTAzQkUnLFxyXG5cdCAgICBvbWljcm9uOiAnXFx1MDNCRicsXHJcblx0ICAgIHBpOiAnXFx1MDNDMCcsXHJcblx0ICAgIHJobzogJ1xcdTAzQzEnLFxyXG5cdCAgICBzaWdtYWY6ICdcXHUwM0MyJyxcclxuXHQgICAgc2lnbWE6ICdcXHUwM0MzJyxcclxuXHQgICAgdGF1OiAnXFx1MDNDNCcsXHJcblx0ICAgIHVwc2lsb246ICdcXHUwM0M1JyxcclxuXHQgICAgcGhpOiAnXFx1MDNDNicsXHJcblx0ICAgIGNoaTogJ1xcdTAzQzcnLFxyXG5cdCAgICBwc2k6ICdcXHUwM0M4JyxcclxuXHQgICAgb21lZ2E6ICdcXHUwM0M5JyxcclxuXHQgICAgdGhldGFzeW06ICdcXHUwM0QxJyxcclxuXHQgICAgdXBzaWg6ICdcXHUwM0QyJyxcclxuXHQgICAgcGl2OiAnXFx1MDNENicsXHJcblx0ICAgIGVuc3A6ICdcXHUyMDAyJyxcclxuXHQgICAgZW1zcDogJ1xcdTIwMDMnLFxyXG5cdCAgICB0aGluc3A6ICdcXHUyMDA5JyxcclxuXHQgICAgenduajogJ1xcdTIwMEMnLFxyXG5cdCAgICB6d2o6ICdcXHUyMDBEJyxcclxuXHQgICAgbHJtOiAnXFx1MjAwRScsXHJcblx0ICAgIHJsbTogJ1xcdTIwMEYnLFxyXG5cdCAgICBuZGFzaDogJ1xcdTIwMTMnLFxyXG5cdCAgICBtZGFzaDogJ1xcdTIwMTQnLFxyXG5cdCAgICBsc3F1bzogJ1xcdTIwMTgnLFxyXG5cdCAgICByc3F1bzogJ1xcdTIwMTknLFxyXG5cdCAgICBzYnF1bzogJ1xcdTIwMUEnLFxyXG5cdCAgICBsZHF1bzogJ1xcdTIwMUMnLFxyXG5cdCAgICByZHF1bzogJ1xcdTIwMUQnLFxyXG5cdCAgICBiZHF1bzogJ1xcdTIwMUUnLFxyXG5cdCAgICBkYWdnZXI6ICdcXHUyMDIwJyxcclxuXHQgICAgRGFnZ2VyOiAnXFx1MjAyMScsXHJcblx0ICAgIGJ1bGw6ICdcXHUyMDIyJyxcclxuXHQgICAgaGVsbGlwOiAnXFx1MjAyNicsXHJcblx0ICAgIHBlcm1pbDogJ1xcdTIwMzAnLFxyXG5cdCAgICBwcmltZTogJ1xcdTIwMzInLFxyXG5cdCAgICBQcmltZTogJ1xcdTIwMzMnLFxyXG5cdCAgICBsc2FxdW86ICdcXHUyMDM5JyxcclxuXHQgICAgcnNhcXVvOiAnXFx1MjAzQScsXHJcblx0ICAgIG9saW5lOiAnXFx1MjAzRScsXHJcblx0ICAgIGZyYXNsOiAnXFx1MjA0NCcsXHJcblx0ICAgIGV1cm86ICdcXHUyMEFDJyxcclxuXHQgICAgaW1hZ2U6ICdcXHUyMTExJyxcclxuXHQgICAgd2VpZXJwOiAnXFx1MjExOCcsXHJcblx0ICAgIHJlYWw6ICdcXHUyMTFDJyxcclxuXHQgICAgdHJhZGU6ICdcXHUyMTIyJyxcclxuXHQgICAgYWxlZnN5bTogJ1xcdTIxMzUnLFxyXG5cdCAgICBsYXJyOiAnXFx1MjE5MCcsXHJcblx0ICAgIHVhcnI6ICdcXHUyMTkxJyxcclxuXHQgICAgcmFycjogJ1xcdTIxOTInLFxyXG5cdCAgICBkYXJyOiAnXFx1MjE5MycsXHJcblx0ICAgIGhhcnI6ICdcXHUyMTk0JyxcclxuXHQgICAgY3JhcnI6ICdcXHUyMUI1JyxcclxuXHQgICAgbEFycjogJ1xcdTIxRDAnLFxyXG5cdCAgICB1QXJyOiAnXFx1MjFEMScsXHJcblx0ICAgIHJBcnI6ICdcXHUyMUQyJyxcclxuXHQgICAgZEFycjogJ1xcdTIxRDMnLFxyXG5cdCAgICBoQXJyOiAnXFx1MjFENCcsXHJcblx0ICAgIGZvcmFsbDogJ1xcdTIyMDAnLFxyXG5cdCAgICBwYXJ0OiAnXFx1MjIwMicsXHJcblx0ICAgIGV4aXN0OiAnXFx1MjIwMycsXHJcblx0ICAgIGVtcHR5OiAnXFx1MjIwNScsXHJcblx0ICAgIG5hYmxhOiAnXFx1MjIwNycsXHJcblx0ICAgIGlzaW46ICdcXHUyMjA4JyxcclxuXHQgICAgbm90aW46ICdcXHUyMjA5JyxcclxuXHQgICAgbmk6ICdcXHUyMjBCJyxcclxuXHQgICAgcHJvZDogJ1xcdTIyMEYnLFxyXG5cdCAgICBzdW06ICdcXHUyMjExJyxcclxuXHQgICAgbWludXM6ICdcXHUyMjEyJyxcclxuXHQgICAgbG93YXN0OiAnXFx1MjIxNycsXHJcblx0ICAgIHJhZGljOiAnXFx1MjIxQScsXHJcblx0ICAgIHByb3A6ICdcXHUyMjFEJyxcclxuXHQgICAgaW5maW46ICdcXHUyMjFFJyxcclxuXHQgICAgYW5nOiAnXFx1MjIyMCcsXHJcblx0ICAgIGFuZDogJ1xcdTIyMjcnLFxyXG5cdCAgICBvcjogJ1xcdTIyMjgnLFxyXG5cdCAgICBjYXA6ICdcXHUyMjI5JyxcclxuXHQgICAgY3VwOiAnXFx1MjIyQScsXHJcblx0ICAgIGludDogJ1xcdTIyMkInLFxyXG5cdCAgICB0aGVyZTQ6ICdcXHUyMjM0JyxcclxuXHQgICAgc2ltOiAnXFx1MjIzQycsXHJcblx0ICAgIGNvbmc6ICdcXHUyMjQ1JyxcclxuXHQgICAgYXN5bXA6ICdcXHUyMjQ4JyxcclxuXHQgICAgbmU6ICdcXHUyMjYwJyxcclxuXHQgICAgZXF1aXY6ICdcXHUyMjYxJyxcclxuXHQgICAgbGU6ICdcXHUyMjY0JyxcclxuXHQgICAgZ2U6ICdcXHUyMjY1JyxcclxuXHQgICAgc3ViOiAnXFx1MjI4MicsXHJcblx0ICAgIHN1cDogJ1xcdTIyODMnLFxyXG5cdCAgICBuc3ViOiAnXFx1MjI4NCcsXHJcblx0ICAgIHN1YmU6ICdcXHUyMjg2JyxcclxuXHQgICAgc3VwZTogJ1xcdTIyODcnLFxyXG5cdCAgICBvcGx1czogJ1xcdTIyOTUnLFxyXG5cdCAgICBvdGltZXM6ICdcXHUyMjk3JyxcclxuXHQgICAgcGVycDogJ1xcdTIyQTUnLFxyXG5cdCAgICBzZG90OiAnXFx1MjJDNScsXHJcblx0ICAgIGxjZWlsOiAnXFx1MjMwOCcsXHJcblx0ICAgIHJjZWlsOiAnXFx1MjMwOScsXHJcblx0ICAgIGxmbG9vcjogJ1xcdTIzMEEnLFxyXG5cdCAgICByZmxvb3I6ICdcXHUyMzBCJyxcclxuXHQgICAgbG96OiAnXFx1MjVDQScsXHJcblx0ICAgIHNwYWRlczogJ1xcdTI2NjAnLFxyXG5cdCAgICBjbHViczogJ1xcdTI2NjMnLFxyXG5cdCAgICBoZWFydHM6ICdcXHUyNjY1JyxcclxuXHQgICAgZGlhbXM6ICdcXHUyNjY2JyxcclxuXHQgICAgbGFuZzogJ1xcdTI3RTgnLFxyXG5cdCAgICByYW5nOiAnXFx1MjdFOSdcclxuXHR9O1xyXG5cblxuLyoqKi8gfSxcbi8qIDE1ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcblx0dmFyIGVycm9yX2hhbmRsZXJfMSA9IF9fd2VicGFja19yZXF1aXJlX18oMTApO1xyXG5cdHZhciBzY2FubmVyXzEgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEyKTtcclxuXHR2YXIgdG9rZW5fMSA9IF9fd2VicGFja19yZXF1aXJlX18oMTMpO1xyXG5cdHZhciBSZWFkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cdCAgICBmdW5jdGlvbiBSZWFkZXIoKSB7XHJcblx0ICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xyXG5cdCAgICAgICAgdGhpcy5jdXJseSA9IHRoaXMucGFyZW4gPSAtMTtcclxuXHQgICAgfVxyXG5cdCAgICAvLyBBIGZ1bmN0aW9uIGZvbGxvd2luZyBvbmUgb2YgdGhvc2UgdG9rZW5zIGlzIGFuIGV4cHJlc3Npb24uXHJcblx0ICAgIFJlYWRlci5wcm90b3R5cGUuYmVmb3JlRnVuY3Rpb25FeHByZXNzaW9uID0gZnVuY3Rpb24gKHQpIHtcclxuXHQgICAgICAgIHJldHVybiBbJygnLCAneycsICdbJywgJ2luJywgJ3R5cGVvZicsICdpbnN0YW5jZW9mJywgJ25ldycsXHJcblx0ICAgICAgICAgICAgJ3JldHVybicsICdjYXNlJywgJ2RlbGV0ZScsICd0aHJvdycsICd2b2lkJyxcclxuXHQgICAgICAgICAgICAvLyBhc3NpZ25tZW50IG9wZXJhdG9yc1xyXG5cdCAgICAgICAgICAgICc9JywgJys9JywgJy09JywgJyo9JywgJyoqPScsICcvPScsICclPScsICc8PD0nLCAnPj49JywgJz4+Pj0nLFxyXG5cdCAgICAgICAgICAgICcmPScsICd8PScsICdePScsICcsJyxcclxuXHQgICAgICAgICAgICAvLyBiaW5hcnkvdW5hcnkgb3BlcmF0b3JzXHJcblx0ICAgICAgICAgICAgJysnLCAnLScsICcqJywgJyoqJywgJy8nLCAnJScsICcrKycsICctLScsICc8PCcsICc+PicsICc+Pj4nLCAnJicsXHJcblx0ICAgICAgICAgICAgJ3wnLCAnXicsICchJywgJ34nLCAnJiYnLCAnfHwnLCAnPycsICc6JywgJz09PScsICc9PScsICc+PScsXHJcblx0ICAgICAgICAgICAgJzw9JywgJzwnLCAnPicsICchPScsICchPT0nXS5pbmRleE9mKHQpID49IDA7XHJcblx0ICAgIH07XHJcblx0ICAgIC8vIERldGVybWluZSBpZiBmb3J3YXJkIHNsYXNoICgvKSBpcyBhbiBvcGVyYXRvciBvciBwYXJ0IG9mIGEgcmVndWxhciBleHByZXNzaW9uXHJcblx0ICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3N3ZWV0LmpzL3dpa2kvZGVzaWduXHJcblx0ICAgIFJlYWRlci5wcm90b3R5cGUuaXNSZWdleFN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG5cdCAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy52YWx1ZXNbdGhpcy52YWx1ZXMubGVuZ3RoIC0gMV07XHJcblx0ICAgICAgICB2YXIgcmVnZXggPSAocHJldmlvdXMgIT09IG51bGwpO1xyXG5cdCAgICAgICAgc3dpdGNoIChwcmV2aW91cykge1xyXG5cdCAgICAgICAgICAgIGNhc2UgJ3RoaXMnOlxyXG5cdCAgICAgICAgICAgIGNhc2UgJ10nOlxyXG5cdCAgICAgICAgICAgICAgICByZWdleCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlICcpJzpcclxuXHQgICAgICAgICAgICAgICAgdmFyIGtleXdvcmQgPSB0aGlzLnZhbHVlc1t0aGlzLnBhcmVuIC0gMV07XHJcblx0ICAgICAgICAgICAgICAgIHJlZ2V4ID0gKGtleXdvcmQgPT09ICdpZicgfHwga2V5d29yZCA9PT0gJ3doaWxlJyB8fCBrZXl3b3JkID09PSAnZm9yJyB8fCBrZXl3b3JkID09PSAnd2l0aCcpO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBjYXNlICd9JzpcclxuXHQgICAgICAgICAgICAgICAgLy8gRGl2aWRpbmcgYSBmdW5jdGlvbiBieSBhbnl0aGluZyBtYWtlcyBsaXR0bGUgc2Vuc2UsXHJcblx0ICAgICAgICAgICAgICAgIC8vIGJ1dCB3ZSBoYXZlIHRvIGNoZWNrIGZvciB0aGF0LlxyXG5cdCAgICAgICAgICAgICAgICByZWdleCA9IGZhbHNlO1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZXNbdGhpcy5jdXJseSAtIDNdID09PSAnZnVuY3Rpb24nKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAvLyBBbm9ueW1vdXMgZnVuY3Rpb24sIGUuZy4gZnVuY3Rpb24oKXt9IC80MlxyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrID0gdGhpcy52YWx1ZXNbdGhpcy5jdXJseSAtIDRdO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgcmVnZXggPSBjaGVjayA/ICF0aGlzLmJlZm9yZUZ1bmN0aW9uRXhwcmVzc2lvbihjaGVjaykgOiBmYWxzZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnZhbHVlc1t0aGlzLmN1cmx5IC0gNF0gPT09ICdmdW5jdGlvbicpIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIC8vIE5hbWVkIGZ1bmN0aW9uLCBlLmcuIGZ1bmN0aW9uIGYoKXt9IC80Mi9cclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBjaGVjayA9IHRoaXMudmFsdWVzW3RoaXMuY3VybHkgLSA1XTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHJlZ2V4ID0gY2hlY2sgPyAhdGhpcy5iZWZvcmVGdW5jdGlvbkV4cHJlc3Npb24oY2hlY2spIDogdHJ1ZTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICBkZWZhdWx0OlxyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiByZWdleDtcclxuXHQgICAgfTtcclxuXHQgICAgUmVhZGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcblx0ICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gNyAvKiBQdW5jdHVhdG9yICovIHx8IHRva2VuLnR5cGUgPT09IDQgLyogS2V5d29yZCAqLykge1xyXG5cdCAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PT0gJ3snKSB7XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuY3VybHkgPSB0aGlzLnZhbHVlcy5sZW5ndGg7XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGVsc2UgaWYgKHRva2VuLnZhbHVlID09PSAnKCcpIHtcclxuXHQgICAgICAgICAgICAgICAgdGhpcy5wYXJlbiA9IHRoaXMudmFsdWVzLmxlbmd0aDtcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh0b2tlbi52YWx1ZSk7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBlbHNlIHtcclxuXHQgICAgICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKG51bGwpO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICB9O1xyXG5cdCAgICByZXR1cm4gUmVhZGVyO1xyXG5cdH0oKSk7XHJcblx0dmFyIFRva2VuaXplciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ICAgIGZ1bmN0aW9uIFRva2VuaXplcihjb2RlLCBjb25maWcpIHtcclxuXHQgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyID0gbmV3IGVycm9yX2hhbmRsZXJfMS5FcnJvckhhbmRsZXIoKTtcclxuXHQgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLnRvbGVyYW50ID0gY29uZmlnID8gKHR5cGVvZiBjb25maWcudG9sZXJhbnQgPT09ICdib29sZWFuJyAmJiBjb25maWcudG9sZXJhbnQpIDogZmFsc2U7XHJcblx0ICAgICAgICB0aGlzLnNjYW5uZXIgPSBuZXcgc2Nhbm5lcl8xLlNjYW5uZXIoY29kZSwgdGhpcy5lcnJvckhhbmRsZXIpO1xyXG5cdCAgICAgICAgdGhpcy5zY2FubmVyLnRyYWNrQ29tbWVudCA9IGNvbmZpZyA/ICh0eXBlb2YgY29uZmlnLmNvbW1lbnQgPT09ICdib29sZWFuJyAmJiBjb25maWcuY29tbWVudCkgOiBmYWxzZTtcclxuXHQgICAgICAgIHRoaXMudHJhY2tSYW5nZSA9IGNvbmZpZyA/ICh0eXBlb2YgY29uZmlnLnJhbmdlID09PSAnYm9vbGVhbicgJiYgY29uZmlnLnJhbmdlKSA6IGZhbHNlO1xyXG5cdCAgICAgICAgdGhpcy50cmFja0xvYyA9IGNvbmZpZyA/ICh0eXBlb2YgY29uZmlnLmxvYyA9PT0gJ2Jvb2xlYW4nICYmIGNvbmZpZy5sb2MpIDogZmFsc2U7XHJcblx0ICAgICAgICB0aGlzLmJ1ZmZlciA9IFtdO1xyXG5cdCAgICAgICAgdGhpcy5yZWFkZXIgPSBuZXcgUmVhZGVyKCk7XHJcblx0ICAgIH1cclxuXHQgICAgVG9rZW5pemVyLnByb3RvdHlwZS5lcnJvcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0ICAgICAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXIuZXJyb3JzO1xyXG5cdCAgICB9O1xyXG5cdCAgICBUb2tlbml6ZXIucHJvdG90eXBlLmdldE5leHRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcclxuXHQgICAgICAgIGlmICh0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDApIHtcclxuXHQgICAgICAgICAgICB2YXIgY29tbWVudHMgPSB0aGlzLnNjYW5uZXIuc2NhbkNvbW1lbnRzKCk7XHJcblx0ICAgICAgICAgICAgaWYgKHRoaXMuc2Nhbm5lci50cmFja0NvbW1lbnQpIHtcclxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZW50cy5sZW5ndGg7ICsraSkge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBjb21tZW50c1tpXTtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuc2Nhbm5lci5zb3VyY2Uuc2xpY2UoZS5zbGljZVswXSwgZS5zbGljZVsxXSk7XHJcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgY29tbWVudCA9IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBlLm11bHRpTGluZSA/ICdCbG9ja0NvbW1lbnQnIDogJ0xpbmVDb21tZW50JyxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuXHQgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja1JhbmdlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudC5yYW5nZSA9IGUucmFuZ2U7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja0xvYykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQubG9jID0gZS5sb2M7XHJcblx0ICAgICAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKGNvbW1lbnQpO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgIGlmICghdGhpcy5zY2FubmVyLmVvZigpKSB7XHJcblx0ICAgICAgICAgICAgICAgIHZhciBsb2MgPSB2b2lkIDA7XHJcblx0ICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYWNrTG9jKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBsb2MgPSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogdGhpcy5zY2FubmVyLmxpbmVOdW1iZXIsXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdGhpcy5zY2FubmVyLmluZGV4IC0gdGhpcy5zY2FubmVyLmxpbmVTdGFydFxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiB7fVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICB2YXIgc3RhcnRSZWdleCA9ICh0aGlzLnNjYW5uZXIuc291cmNlW3RoaXMuc2Nhbm5lci5pbmRleF0gPT09ICcvJykgJiYgdGhpcy5yZWFkZXIuaXNSZWdleFN0YXJ0KCk7XHJcblx0ICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IHN0YXJ0UmVnZXggPyB0aGlzLnNjYW5uZXIuc2NhblJlZ0V4cCgpIDogdGhpcy5zY2FubmVyLmxleCgpO1xyXG5cdCAgICAgICAgICAgICAgICB0aGlzLnJlYWRlci5wdXNoKHRva2VuKTtcclxuXHQgICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgdHlwZTogdG9rZW5fMS5Ub2tlbk5hbWVbdG9rZW4udHlwZV0sXHJcblx0ICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5zY2FubmVyLnNvdXJjZS5zbGljZSh0b2tlbi5zdGFydCwgdG9rZW4uZW5kKVxyXG5cdCAgICAgICAgICAgICAgICB9O1xyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja1JhbmdlKSB7XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbnRyeS5yYW5nZSA9IFt0b2tlbi5zdGFydCwgdG9rZW4uZW5kXTtcclxuXHQgICAgICAgICAgICAgICAgfVxyXG5cdCAgICAgICAgICAgICAgICBpZiAodGhpcy50cmFja0xvYykge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgbG9jLmVuZCA9IHtcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLnNjYW5uZXIubGluZU51bWJlcixcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHRoaXMuc2Nhbm5lci5pbmRleCAtIHRoaXMuc2Nhbm5lci5saW5lU3RhcnRcclxuXHQgICAgICAgICAgICAgICAgICAgIH07XHJcblx0ICAgICAgICAgICAgICAgICAgICBlbnRyeS5sb2MgPSBsb2M7XHJcblx0ICAgICAgICAgICAgICAgIH1cclxuXHQgICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDkgLyogUmVndWxhckV4cHJlc3Npb24gKi8pIHtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBwYXR0ZXJuID0gdG9rZW4ucGF0dGVybjtcclxuXHQgICAgICAgICAgICAgICAgICAgIHZhciBmbGFncyA9IHRva2VuLmZsYWdzO1xyXG5cdCAgICAgICAgICAgICAgICAgICAgZW50cnkucmVnZXggPSB7IHBhdHRlcm46IHBhdHRlcm4sIGZsYWdzOiBmbGFncyB9O1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyLnB1c2goZW50cnkpO1xyXG5cdCAgICAgICAgICAgIH1cclxuXHQgICAgICAgIH1cclxuXHQgICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zaGlmdCgpO1xyXG5cdCAgICB9O1xyXG5cdCAgICByZXR1cm4gVG9rZW5pemVyO1xyXG5cdH0oKSk7XHJcblx0ZXhwb3J0cy5Ub2tlbml6ZXIgPSBUb2tlbml6ZXI7XHJcblxuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gIHZhciB1cCA9IDA7XG4gIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG4gICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgIH0gZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXArKztcbiAgICB9IGVsc2UgaWYgKHVwKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICB1cC0tO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPVxuICAgIC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xudmFyIHNwbGl0UGF0aCA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn07XG5cbi8vIHBhdGgucmVzb2x2ZShbZnJvbSAuLi5dLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzb2x2ZWRQYXRoID0gJycsXG4gICAgICByZXNvbHZlZEFic29sdXRlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IC0xICYmICFyZXNvbHZlZEFic29sdXRlOyBpLS0pIHtcbiAgICB2YXIgcGF0aCA9IChpID49IDApID8gYXJndW1lbnRzW2ldIDogcHJvY2Vzcy5jd2QoKTtcblxuICAgIC8vIFNraXAgZW1wdHkgYW5kIGludmFsaWQgZW50cmllc1xuICAgIGlmICh0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLnJlc29sdmUgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgfSBlbHNlIGlmICghcGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICByZXNvbHZlZEFic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzIHRvIGJlIHNhZmUgKG1pZ2h0IGhhcHBlbiB3aGVuIHByb2Nlc3MuY3dkKCkgZmFpbHMpXG5cbiAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihyZXNvbHZlZFBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhcmVzb2x2ZWRBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIHJldHVybiAoKHJlc29sdmVkQWJzb2x1dGUgPyAnLycgOiAnJykgKyByZXNvbHZlZFBhdGgpIHx8ICcuJztcbn07XG5cbi8vIHBhdGgubm9ybWFsaXplKHBhdGgpXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCksXG4gICAgICB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICBwYXRoID0gbm9ybWFsaXplQXJyYXkoZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhIXA7XG4gIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgIHBhdGggPSAnLic7XG4gIH1cbiAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgIHBhdGggKz0gJy8nO1xuICB9XG5cbiAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMuaXNBYnNvbHV0ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguY2hhckF0KDApID09PSAnLyc7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKGZpbHRlcihwYXRocywgZnVuY3Rpb24ocCwgaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbiAgfSkuam9pbignLycpKTtcbn07XG5cblxuLy8gcGF0aC5yZWxhdGl2ZShmcm9tLCB0bylcbi8vIHBvc2l4IHZlcnNpb25cbmV4cG9ydHMucmVsYXRpdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICBmcm9tID0gZXhwb3J0cy5yZXNvbHZlKGZyb20pLnN1YnN0cigxKTtcbiAgdG8gPSBleHBvcnRzLnJlc29sdmUodG8pLnN1YnN0cigxKTtcblxuICBmdW5jdGlvbiB0cmltKGFycikge1xuICAgIHZhciBzdGFydCA9IDA7XG4gICAgZm9yICg7IHN0YXJ0IDwgYXJyLmxlbmd0aDsgc3RhcnQrKykge1xuICAgICAgaWYgKGFycltzdGFydF0gIT09ICcnKSBicmVhaztcbiAgICB9XG5cbiAgICB2YXIgZW5kID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgZm9yICg7IGVuZCA+PSAwOyBlbmQtLSkge1xuICAgICAgaWYgKGFycltlbmRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0ID4gZW5kKSByZXR1cm4gW107XG4gICAgcmV0dXJuIGFyci5zbGljZShzdGFydCwgZW5kIC0gc3RhcnQgKyAxKTtcbiAgfVxuXG4gIHZhciBmcm9tUGFydHMgPSB0cmltKGZyb20uc3BsaXQoJy8nKSk7XG4gIHZhciB0b1BhcnRzID0gdHJpbSh0by5zcGxpdCgnLycpKTtcblxuICB2YXIgbGVuZ3RoID0gTWF0aC5taW4oZnJvbVBhcnRzLmxlbmd0aCwgdG9QYXJ0cy5sZW5ndGgpO1xuICB2YXIgc2FtZVBhcnRzTGVuZ3RoID0gbGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGZyb21QYXJ0c1tpXSAhPT0gdG9QYXJ0c1tpXSkge1xuICAgICAgc2FtZVBhcnRzTGVuZ3RoID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRwdXRQYXJ0cyA9IFtdO1xuICBmb3IgKHZhciBpID0gc2FtZVBhcnRzTGVuZ3RoOyBpIDwgZnJvbVBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0cHV0UGFydHMucHVzaCgnLi4nKTtcbiAgfVxuXG4gIG91dHB1dFBhcnRzID0gb3V0cHV0UGFydHMuY29uY2F0KHRvUGFydHMuc2xpY2Uoc2FtZVBhcnRzTGVuZ3RoKSk7XG5cbiAgcmV0dXJuIG91dHB1dFBhcnRzLmpvaW4oJy8nKTtcbn07XG5cbmV4cG9ydHMuc2VwID0gJy8nO1xuZXhwb3J0cy5kZWxpbWl0ZXIgPSAnOic7XG5cbmV4cG9ydHMuZGlybmFtZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFyIHJlc3VsdCA9IHNwbGl0UGF0aChwYXRoKSxcbiAgICAgIHJvb3QgPSByZXN1bHRbMF0sXG4gICAgICBkaXIgPSByZXN1bHRbMV07XG5cbiAgaWYgKCFyb290ICYmICFkaXIpIHtcbiAgICAvLyBObyBkaXJuYW1lIHdoYXRzb2V2ZXJcbiAgICByZXR1cm4gJy4nO1xuICB9XG5cbiAgaWYgKGRpcikge1xuICAgIC8vIEl0IGhhcyBhIGRpcm5hbWUsIHN0cmlwIHRyYWlsaW5nIHNsYXNoXG4gICAgZGlyID0gZGlyLnN1YnN0cigwLCBkaXIubGVuZ3RoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gcm9vdCArIGRpcjtcbn07XG5cblxuZXhwb3J0cy5iYXNlbmFtZSA9IGZ1bmN0aW9uKHBhdGgsIGV4dCkge1xuICB2YXIgZiA9IHNwbGl0UGF0aChwYXRoKVsyXTtcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGNvbXBhcmlzb24gY2FzZS1pbnNlbnNpdGl2ZSBvbiB3aW5kb3dzP1xuICBpZiAoZXh0ICYmIGYuc3Vic3RyKC0xICogZXh0Lmxlbmd0aCkgPT09IGV4dCkge1xuICAgIGYgPSBmLnN1YnN0cigwLCBmLmxlbmd0aCAtIGV4dC5sZW5ndGgpO1xuICB9XG4gIHJldHVybiBmO1xufTtcblxuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXIgKHhzLCBmKSB7XG4gICAgaWYgKHhzLmZpbHRlcikgcmV0dXJuIHhzLmZpbHRlcihmKTtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZih4c1tpXSwgaSwgeHMpKSByZXMucHVzaCh4c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikgeyByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKSB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG47XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBzaGF2ZW47XG5cbnZhciBfcGFyc2VTdWdhclN0cmluZyA9IHJlcXVpcmUoJy4vcGFyc2VTdWdhclN0cmluZycpO1xuXG52YXIgX3BhcnNlU3VnYXJTdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFyc2VTdWdhclN0cmluZyk7XG5cbnZhciBfZGVmYXVsdHMgPSByZXF1aXJlKCcuL2RlZmF1bHRzJyk7XG5cbnZhciBfZGVmYXVsdHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmYXVsdHMpO1xuXG52YXIgX25hbWVzcGFjZVRvVVJMID0gcmVxdWlyZSgnLi9uYW1lc3BhY2VUb1VSTCcpO1xuXG52YXIgX25hbWVzcGFjZVRvVVJMMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX25hbWVzcGFjZVRvVVJMKTtcblxudmFyIF9tYXBBdHRyaWJ1dGVWYWx1ZSA9IHJlcXVpcmUoJy4vbWFwQXR0cmlidXRlVmFsdWUnKTtcblxudmFyIF9tYXBBdHRyaWJ1dGVWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBBdHRyaWJ1dGVWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBzaGF2ZW4oYXJyYXlPck9iamVjdCkge1xuXG4gIGlmICghYXJyYXlPck9iamVjdCB8fCAodHlwZW9mIGFycmF5T3JPYmplY3QgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGFycmF5T3JPYmplY3QpKSAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgZWl0aGVyIGFuIGFycmF5IG9yIGFuIG9iamVjdCAnICsgJ2FuZCBub3QgJyArIGFycmF5T3JPYmplY3QpO1xuICB9XG5cbiAgdmFyIGNvbmZpZyA9IHt9O1xuICB2YXIgZWxlbWVudEFycmF5ID0gdm9pZCAwO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KGFycmF5T3JPYmplY3QpKSB7XG4gICAgZWxlbWVudEFycmF5ID0gYXJyYXlPck9iamVjdDtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50QXJyYXkgPSBhcnJheU9yT2JqZWN0LmVsZW1lbnRBcnJheTtcbiAgICBkZWxldGUgYXJyYXlPck9iamVjdC5lbGVtZW50QXJyYXk7XG4gICAgT2JqZWN0LmFzc2lnbihjb25maWcsIGFycmF5T3JPYmplY3QpO1xuICB9XG5cbiAgY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgX2RlZmF1bHRzMi5kZWZhdWx0LCBjb25maWcsIHtcbiAgICByZXR1cm5PYmplY3Q6IHsgLy8gU2hhdmVuIG9iamVjdCB0byByZXR1cm4gYXQgbGFzdFxuICAgICAgaWRzOiB7fSxcbiAgICAgIHJlZmVyZW5jZXM6IHt9XG4gICAgfVxuICB9KTtcblxuICBjb25maWcubnNTdGFjayA9IFtjb25maWcubmFtZXNwYWNlXTsgLy8gU3RhY2sgd2l0aCBjdXJyZW50IG5hbWVzcGFjZXNcblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHN1Z2FyU3RyaW5nKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSAoMCwgX3BhcnNlU3VnYXJTdHJpbmcyLmRlZmF1bHQpKHN1Z2FyU3RyaW5nKTtcbiAgICB2YXIgY3VycmVudE5zID0gY29uZmlnLm5zU3RhY2tbY29uZmlnLm5zU3RhY2subGVuZ3RoIC0gMV07XG5cbiAgICBpZiAocHJvcGVydGllcy50YWcgPT09ICdzdmcnKSB7XG4gICAgICBjb25maWcubnNTdGFjay5wdXNoKCdzdmcnKTtcbiAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXMudGFnID09PSAnbWF0aCcpIHtcbiAgICAgIGNvbmZpZy5uc1N0YWNrLnB1c2goJ21hdGhtbCcpO1xuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcy50YWcgPT09ICdodG1sJykge1xuICAgICAgY29uZmlnLm5zU3RhY2sucHVzaCgneGh0bWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gS2VlcCBjdXJyZW50IG5hbWVzcGFjZVxuICAgICAgY29uZmlnLm5zU3RhY2sucHVzaChjdXJyZW50TnMpO1xuICAgIH1cblxuICAgIHZhciBuYW1lc3BhY2UgPSBjb25maWcubnNTdGFja1tjb25maWcubnNTdGFjay5sZW5ndGggLSAxXTtcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhfbmFtZXNwYWNlVG9VUkwyLmRlZmF1bHRbbmFtZXNwYWNlXSA/IF9uYW1lc3BhY2VUb1VSTDIuZGVmYXVsdFtuYW1lc3BhY2VdIDogbmFtZXNwYWNlLCBwcm9wZXJ0aWVzLnRhZyk7XG5cbiAgICBpZiAocHJvcGVydGllcy5pZCkge1xuICAgICAgZWxlbWVudC5pZCA9IHByb3BlcnRpZXMuaWQ7XG4gICAgICBjb25zb2xlLmFzc2VydCghY29uZmlnLnJldHVybk9iamVjdC5pZHMuaGFzT3duUHJvcGVydHkocHJvcGVydGllcy5pZCksICdJZHMgbXVzdCBiZSB1bmlxdWUgYW5kIFwiJyArIHByb3BlcnRpZXMuaWQgKyAnXCIgaXMgYWxyZWFkeSBhc3NpZ25lZCcpO1xuICAgICAgY29uZmlnLnJldHVybk9iamVjdC5pZHNbcHJvcGVydGllcy5pZF0gPSBlbGVtZW50O1xuICAgIH1cbiAgICBpZiAocHJvcGVydGllcy5jbGFzcykge1xuICAgICAgdmFyIF9lbGVtZW50JGNsYXNzTGlzdDtcblxuICAgICAgKF9lbGVtZW50JGNsYXNzTGlzdCA9IGVsZW1lbnQuY2xhc3NMaXN0KS5hZGQuYXBwbHkoX2VsZW1lbnQkY2xhc3NMaXN0LCBfdG9Db25zdW1hYmxlQXJyYXkocHJvcGVydGllcy5jbGFzcy5zcGxpdCgnICcpKSk7XG4gICAgfVxuICAgIGlmIChwcm9wZXJ0aWVzLnJlZmVyZW5jZSkge1xuICAgICAgY29uc29sZS5hc3NlcnQoIWNvbmZpZy5yZXR1cm5PYmplY3QuaWRzLmhhc093blByb3BlcnR5KHByb3BlcnRpZXMucmVmZXJlbmNlKSwgJ1JlZmVyZW5jZXMgbXVzdCBiZSB1bmlxdWUgYW5kIFwiJyArIHByb3BlcnRpZXMuaWQgKyAnXCIgaXMgYWxyZWFkeSBhc3NpZ25lZCcpO1xuICAgICAgY29uZmlnLnJldHVybk9iamVjdC5yZWZlcmVuY2VzW3Byb3BlcnRpZXMucmVmZXJlbmNlXSA9IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMuZXNjYXBlSFRNTCAhPSBudWxsKSB7XG4gICAgICBjb25maWcuZXNjYXBlSFRNTCA9IHByb3BlcnRpZXMuZXNjYXBlSFRNTDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkRG9tKGFycmF5KSB7XG5cbiAgICB2YXIgaW5kZXggPSAxO1xuICAgIHZhciBjcmVhdGVkQ2FsbGJhY2sgPSB2b2lkIDA7XG5cbiAgICBpZiAodHlwZW9mIGFycmF5WzBdID09PSAnc3RyaW5nJykge1xuICAgICAgYXJyYXlbMF0gPSBjcmVhdGVFbGVtZW50KGFycmF5WzBdKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJyYXlbMF0pKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfSBlbHNlIGlmICghKGFycmF5WzBdIGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgZWxlbWVudCBvZiBhcnJheSBtdXN0IGJlIGVpdGhlciBhIHN0cmluZywgJyArICdhbiBhcnJheSBvciBhIERPTSBlbGVtZW50IGFuZCBub3QgJyArIEpTT04uc3RyaW5naWZ5KGFycmF5WzBdKSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIGVhY2ggaW4gdGhlIGVsZW1lbnQgYXJyYXkgKGV4Y2VwdCB0aGUgZmlyc3QpXG4gICAgZm9yICg7IGluZGV4IDwgYXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XG5cbiAgICAgIC8vIERvbid0IHJlbmRlciBlbGVtZW50IGlmIHZhbHVlIGlzIGZhbHNlIG9yIG51bGxcbiAgICAgIGlmIChhcnJheVtpbmRleF0gPT09IGZhbHNlIHx8IGFycmF5W2luZGV4XSA9PT0gbnVsbCkge1xuICAgICAgICBhcnJheVswXSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gQ29udGludWUgd2l0aCBuZXh0IGFycmF5IHZhbHVlIGlmIGN1cnJlbnQgaXMgdW5kZWZpbmVkIG9yIHRydWVcbiAgICAgIGVsc2UgaWYgKGFycmF5W2luZGV4XSA9PT0gdW5kZWZpbmVkIHx8IGFycmF5W2luZGV4XSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgaXMgc3RyaW5nIGhhcyB0byBiZSBjb250ZW50IHNvIHNldCBpdFxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJyYXlbaW5kZXhdID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgYXJyYXlbaW5kZXhdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5lc2NhcGVIVE1MKSB7XG4gICAgICAgICAgICAgIGFycmF5WzBdLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFycmF5W2luZGV4XSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYXJyYXlbMF0uaW5uZXJIVE1MID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIGlzIGFycmF5IGhhcyB0byBiZSBjaGlsZCBlbGVtZW50XG4gICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcnJheVtpbmRleF0pKSB7XG4gICAgICAgICAgICAgIC8vIElmIGlzIGFjdHVhbGx5IGEgc3ViLWFycmF5LCBmbGF0dGVuIGl0XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycmF5W2luZGV4XVswXSkpIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpbmRleF0ucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24gKHN1YkFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKGluZGV4ICsgMSwgMCwgc3ViQXJyYXkpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gQnVpbGQgZG9tIHJlY3Vyc2l2ZWx5IGZvciBhbGwgY2hpbGQgZWxlbWVudHNcbiAgICAgICAgICAgICAgYnVpbGREb20oYXJyYXlbaW5kZXhdKTtcblxuICAgICAgICAgICAgICAvLyBBcHBlbmQgdGhlIGVsZW1lbnQgdG8gaXRzIHBhcmVudCBlbGVtZW50XG4gICAgICAgICAgICAgIGlmIChhcnJheVtpbmRleF1bMF0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVswXS5hcHBlbmRDaGlsZChhcnJheVtpbmRleF1bMF0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcnJheVtpbmRleF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgY3JlYXRlZENhbGxiYWNrID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBpdCBpcyBhbiBlbGVtZW50IGFwcGVuZCBpdFxuICAgICAgICAgICAgZWxzZSBpZiAoYXJyYXlbaW5kZXhdIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGFycmF5WzBdLmFwcGVuZENoaWxkKGFycmF5W2luZGV4XSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAvLyBFbHNlIG11c3QgYmUgYW4gb2JqZWN0IHdpdGggYXR0cmlidXRlc1xuICAgICAgICAgICAgICBlbHNlIGlmIChfdHlwZW9mKGFycmF5W2luZGV4XSkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAvLyBGb3IgZWFjaCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGF0dHJpYnV0ZUtleSBpbiBhcnJheVtpbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhcnJheVtpbmRleF0uaGFzT3duUHJvcGVydHkoYXR0cmlidXRlS2V5KSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gYXJyYXlbaW5kZXhdW2F0dHJpYnV0ZUtleV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W2luZGV4XS5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGVLZXkpICYmIGF0dHJpYnV0ZVZhbHVlICE9PSBudWxsICYmIGF0dHJpYnV0ZVZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGFycmF5WzBdLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksICgwLCBfbWFwQXR0cmlidXRlVmFsdWUyLmRlZmF1bHQpKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUsIGNvbmZpZykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiJyArIGFycmF5W2luZGV4XSArICdcIiBpcyBub3QgYWxsb3dlZCBhcyBhIHZhbHVlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbmZpZy5uc1N0YWNrLnBvcCgpO1xuXG4gICAgLy8gUmV0dXJuIHJvb3QgZWxlbWVudCBvbiBpbmRleCAwXG4gICAgY29uZmlnLnJldHVybk9iamVjdFswXSA9IGFycmF5WzBdO1xuICAgIGNvbmZpZy5yZXR1cm5PYmplY3Qucm9vdEVsZW1lbnQgPSBhcnJheVswXTtcblxuICAgIGNvbmZpZy5yZXR1cm5PYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYXJyYXlbMF0ub3V0ZXJIVE1MO1xuICAgIH07XG5cbiAgICBpZiAoY3JlYXRlZENhbGxiYWNrKSBjcmVhdGVkQ2FsbGJhY2soYXJyYXlbMF0pO1xuICB9XG5cbiAgYnVpbGREb20oZWxlbWVudEFycmF5KTtcblxuICByZXR1cm4gY29uZmlnLnJldHVybk9iamVjdDtcbn1cblxuc2hhdmVuLnNldERlZmF1bHRzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICBPYmplY3QuYXNzaWduKF9kZWZhdWx0czIuZGVmYXVsdCwgb2JqZWN0KTtcbiAgcmV0dXJuIHNoYXZlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuLy8gQ3JlYXRlIHRyYW5zZm9ybSBzdHJpbmcgZnJvbSBsaXN0IHRyYW5zZm9ybSBvYmplY3RzXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm1PYmplY3RzKSB7XG5cbiAgcmV0dXJuIHRyYW5zZm9ybU9iamVjdHMubWFwKGZ1bmN0aW9uICh0cmFuc2Zvcm1hdGlvbikge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgIGlmICh0cmFuc2Zvcm1hdGlvbi50eXBlID09PSAncm90YXRlJyAmJiB0cmFuc2Zvcm1hdGlvbi5kZWdyZWVzKSB7XG4gICAgICB2YWx1ZXMucHVzaCh0cmFuc2Zvcm1hdGlvbi5kZWdyZWVzKTtcbiAgICB9XG4gICAgaWYgKHRyYW5zZm9ybWF0aW9uLngpIHZhbHVlcy5wdXNoKHRyYW5zZm9ybWF0aW9uLngpO1xuICAgIGlmICh0cmFuc2Zvcm1hdGlvbi55KSB2YWx1ZXMucHVzaCh0cmFuc2Zvcm1hdGlvbi55KTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm1hdGlvbi50eXBlICsgJygnICsgdmFsdWVzICsgJyknO1xuICB9KS5qb2luKCcgJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgbmFtZXNwYWNlOiAneGh0bWwnLFxuICBhdXRvTmFtZXNwYWNpbmc6IHRydWUsXG4gIGVzY2FwZUhUTUw6IHRydWUsXG4gIHF1b3RhdGlvbk1hcms6ICdcIicsXG4gIHF1b3RlQXR0cmlidXRlczogdHJ1ZSxcbiAgY29udmVydFRyYW5zZm9ybUFycmF5OiB0cnVlXG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciBfYnVpbGRUcmFuc2Zvcm1TdHJpbmcgPSByZXF1aXJlKCcuL2J1aWxkVHJhbnNmb3JtU3RyaW5nJyk7XG5cbnZhciBfYnVpbGRUcmFuc2Zvcm1TdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYnVpbGRUcmFuc2Zvcm1TdHJpbmcpO1xuXG52YXIgX3N0cmluZ2lmeVN0eWxlT2JqZWN0ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnlTdHlsZU9iamVjdCcpO1xuXG52YXIgX3N0cmluZ2lmeVN0eWxlT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ2lmeVN0eWxlT2JqZWN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBpZiAoa2V5ID09PSAnc3R5bGUnICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHZhbHVlKSkgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuICgwLCBfc3RyaW5naWZ5U3R5bGVPYmplY3QyLmRlZmF1bHQpKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXkgPT09ICd0cmFuc2Zvcm0nICYmIEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuICgwLCBfYnVpbGRUcmFuc2Zvcm1TdHJpbmcyLmRlZmF1bHQpKHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0ge1xuICBtYXRobWw6ICdodHRwOi8vd3d3LnczLm9yZy8xOTk4L01hdGgvTWF0aE1MJyxcbiAgc3ZnOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLFxuICB4aHRtbDogJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnXG59OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHN1Z2FyU3RyaW5nKSB7XG4gIHZhciB0YWdzID0gc3VnYXJTdHJpbmcubWF0Y2goL15bXFx3LV0rLyk7XG4gIHZhciBwcm9wZXJ0aWVzID0ge1xuICAgIHRhZzogdGFncyA/IHRhZ3NbMF0gOiAnZGl2J1xuICB9O1xuICB2YXIgaWRzID0gc3VnYXJTdHJpbmcubWF0Y2goLyMoW1xcdy1dKykvKTtcbiAgdmFyIGNsYXNzZXMgPSBzdWdhclN0cmluZy5tYXRjaCgvXFwuW1xcdy1dKy9nKTtcbiAgdmFyIHJlZmVyZW5jZXMgPSBzdWdhclN0cmluZy5tYXRjaCgvXFwkKFtcXHctXSspLyk7XG5cbiAgaWYgKGlkcykgcHJvcGVydGllcy5pZCA9IGlkc1sxXTtcblxuICBpZiAoY2xhc3Nlcykge1xuICAgIHByb3BlcnRpZXMuY2xhc3MgPSBjbGFzc2VzLmpvaW4oJyAnKS5yZXBsYWNlKC9cXC4vZywgJycpO1xuICB9XG5cbiAgaWYgKHJlZmVyZW5jZXMpIHByb3BlcnRpZXMucmVmZXJlbmNlID0gcmVmZXJlbmNlc1sxXTtcblxuICBpZiAoc3VnYXJTdHJpbmcuZW5kc1dpdGgoJyYnKSB8fCBzdWdhclN0cmluZy5lbmRzV2l0aCgnIScpKSB7XG4gICAgcHJvcGVydGllcy5lc2NhcGVIVE1MID0gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcHJvcGVydGllcztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gc2FuaXRpemVQcm9wZXJ0aWVzKGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBmYWxzZSB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8ICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHZhbHVlKSkgPT09ICdvYmplY3QnKSByZXR1cm4gdmFsdWU7XG5cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzdHlsZU9iamVjdCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3R5bGVPYmplY3QsIHNhbml0aXplUHJvcGVydGllcykuc2xpY2UoMiwgLTIpLnJlcGxhY2UoL1wiLFwiL2csICc7JykucmVwbGFjZSgvXCI6XCIvZywgJzonKS5yZXBsYWNlKC9cXFxcXCIvZywgJ1xcJycpO1xufTsiLCJjb25zdCBzaGF2ZW4gPSByZXF1aXJlKCdzaGF2ZW4nKS5kZWZhdWx0XG5jb25zdCBlc3ByaW1hID0gcmVxdWlyZSgnZXNwcmltYScpXG5cbmNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5jb25zdCBmaWxlVXJsRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlVXJsJylcbmNvbnN0IGZpbGVVcmxJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWxlVXJsIGlucHV0JylcbmNvbnN0IG91dHB1dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3V0cHV0JylcblxuXG5mdW5jdGlvbiB2aXN1YWxpemVTeW50YXggKGZpbGVEYXRhKSB7XG4gIGNvbnN0IG91dHB1dCA9IFtdXG4gIGNvbnN0IGluZGV4T2ZGaXJzdE5ld2xpbmUgPSBmaWxlRGF0YS5jb250ZW50LmluZGV4T2YoJ1xcbicpXG5cbiAgaWYgKGZpbGVEYXRhLmNvbnRlbnQuc3RhcnRzV2l0aCgnIyEnKSkge1xuICAgIGZpbGVEYXRhLnNoZWJhbmcgPSBmaWxlRGF0YS5jb250ZW50LnNsaWNlKDAsIGluZGV4T2ZGaXJzdE5ld2xpbmUpXG4gICAgZmlsZURhdGEuY29udGVudCA9IGZpbGVEYXRhLmNvbnRlbnQuc2xpY2UoaW5kZXhPZkZpcnN0TmV3bGluZSlcbiAgfVxuXG4gIGNvbnN0IHN5bnRheFRyZWUgPSBlc3ByaW1hLnBhcnNlKGZpbGVEYXRhLmNvbnRlbnQsIHtcbiAgICBsb2M6IHRydWUsXG4gICAgcmFuZ2U6IGZhbHNlLFxuICAgIGF0dGFjaENvbW1lbnQ6IHRydWUsXG4gICAgdG9sZXJhbnQ6IHRydWUsXG4gIH0pXG5cbiAgb3V0cHV0RWxlbWVudC5pbm5lckhUTUwgPSAnJ1xuXG4gIG91dHB1dC5wdXNoKHdhbGtUcmVlKHN5bnRheFRyZWUsIGZpbGVEYXRhKSlcblxuICByZXR1cm4gb3V0cHV0XG59XG5cblxuZnVuY3Rpb24gbm9ybWFsaXplVXJsICh1cmwpIHtcbiAgLy8gR2l0SHViIHNwZWNpZmljIG5vcm1hbGl6YXRpb25zXG4gIGNvbnN0IGdpdGh1Yk1hdGNoID0gdXJsLm1hdGNoKC9eaHR0cHM/OlxcL1xcLyhnaXRodWIuY29tKS8pXG4gIHJldHVybiBnaXRodWJNYXRjaFxuICAgID8gdXJsXG4gICAgICAucmVwbGFjZShnaXRodWJNYXRjaFsxXSwgJ3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20nKVxuICAgICAgLnJlcGxhY2UoJy9ibG9iJywgJycpXG4gICAgOiB1cmxcbn1cblxuXG5hc3luYyBmdW5jdGlvbiBsb2FkRmlsZSAoZmlsZVVybCkge1xuICBpZiAoIWZpbGVVcmwuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgZmlsZVVybCA9ICcvZmlsZXMvJyArIGZpbGVVcmxcbiAgfVxuICBlbHNlIHtcbiAgICBmaWxlVXJsID0gbm9ybWFsaXplVXJsKGZpbGVVcmwpXG4gIH1cblxuICBjb25zdCBmaWxlQ29udGVudFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goZmlsZVVybClcbiAgY29uc3QgZmlsZURhdGEgPSB7XG4gICAgbmFtZTogZmlsZVVybElucHV0LnZhbHVlLFxuICAgIGNvbnRlbnQ6IGF3YWl0IGZpbGVDb250ZW50UmVzcG9uc2UudGV4dCgpLFxuICB9XG4gIGNvbnNvbGUuaW5mbyhmaWxlRGF0YSlcbiAgY29uc3Qgc2hhdmVuQXJyYXkgPSB2aXN1YWxpemVTeW50YXgoZmlsZURhdGEpXG5cbiAgc2hhdmVuKFtvdXRwdXRFbGVtZW50LCBzaGF2ZW5BcnJheV0pWzBdXG59XG5cblxuYXN5bmMgZnVuY3Rpb24gbG9hZEluaXRpYWxGaWxlICgpIHtcbiAgY29uc3QgZmlsZU5hbWVSZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvZmlsZW5hbWUnKVxuICBjb25zdCBmaWxlTmFtZSA9IGF3YWl0IGZpbGVOYW1lUmVzcG9uc2UudGV4dCgpXG5cbiAgbG9hZEZpbGUoZmlsZU5hbWUpXG59XG5cblxubG9hZEluaXRpYWxGaWxlKClcblxuZmlsZVVybEZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZXZlbnQgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gIGxvYWRGaWxlKGZpbGVVcmxJbnB1dC52YWx1ZSlcbn0pXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBpbmRlbnQgKi9cbm1vZHVsZS5leHBvcnRzLmJpbmFyeSA9IHtcbiAgICAnLCc6ICdjb21tYScsXG4gICAgJy4uLic6ICdzcHJlYWQnLFxuXG4gICAnfHwnOiAnb3InLFxuICAgJyYmJzogJ2FuZCcsXG5cbiAgICc9PSc6ICdlcXVhbHMnLFxuICAgJyE9JzogJ2VxdWFscy1ub3QnLFxuICAnPT09JzogJ2VxdWFscy1zdHJpY3QnLFxuICAnIT09JzogJ2VxdWFscy1zdHJpY3Qtbm90JyxcblxuICAgICc8JzogJ2xlc3MtdGhhbicsXG4gICAgJz4nOiAnZ3JlYXRlci10aGFuJyxcbiAgICc8PSc6ICdsZXNzLXRoYW4tZXF1YWxzJyxcbiAgICc+PSc6ICdncmVhdGVyLXRoYW4tZXF1YWxzJyxcblxuICAgJzw8JzogJ3NoaWZ0LWxlZnQnLFxuICAgJz4+JzogJ3NoaWZ0LXJpZ2h0JyxcbiAgICc+Pj4nOiAnc2hpZnQtcmlnaHQtemVyby1maWxsJyxcblxuICAgJz8nOiAndGVybmFyeScsXG5cbiAgICAnKyc6ICdhZGQnLFxuICAgICctJzogJ3N1YnRyYWN0JyxcbiAgICAnKic6ICdtdWx0aXBseScsXG4gICAgJy8nOiAnZGl2aWRlJyxcbiAgICAnJSc6ICdyZW1haW5kZXInLFxuICAgJyoqJzogJ2V4cG9uZW50JyxcblxuICAgJyYnOiAnYml0LWFuZCcsXG4gICAnfCc6ICdiaXQtb3InLFxuICAgJ14nOiAnYml0LXhvcicsXG5cbiAgICAgJz0nOiAnYXNzaWduJyxcbiAgICAnKz0nOiAnYXNzaWduLWFkZCcsXG4gICAgJy09JzogJ2Fzc2lnbi1zdWJ0cmFjdCcsXG4gICAgJyo9JzogJ2Fzc2lnbi1tdWx0aXBseScsXG4gICAgJy89JzogJ2Fzc2lnbi1kaXZpZGUnLFxuICAgICclPSc6ICdhc3NpZ24tcmVtYWluZGVyJyxcbiAgICcqKj0nOiAnYXNzaWduLWV4cG9uZW50JyxcbiAgICc8PD0nOiAnYXNzaWduLXNoaWZ0LWxlZnQnLFxuICAgJz4+PSc6ICdhc3NpZ24tc2hpZnQtcmlnaHQnLFxuICAnPj4+PSc6ICdhc3NpZ24tc2hpZnQtcmlnaHQtdW5zaWduZWQnLFxuICAgICcmPSc6ICdhc3NpZ24tYml0LWFuZCcsXG4gICAgJ149JzogJ2Fzc2lnbi1iaXQteG9yJyxcbiAgICAnfD0nOiAnYXNzaWduLWJpdC1vcicsXG5cbiAgIGluc3RhbmNlb2Y6ICdpbnN0YW5jZW9mJyxcbiAgIGluOiAnaW4nLFxufVxuXG5cbm1vZHVsZS5leHBvcnRzLnVuYXJ5ID0ge1xuICAgJyEnOiAnbm90JyxcblxuICAgJysnOiAncGx1cycsXG4gICAnLSc6ICduZWdhdGUnLFxuXG4gICcrKyc6ICdpbmNyZW1lbnQnLFxuICAnLS0nOiAnZGVjcmVtZW50JyxcblxuICAgJ34nOiAnYml0LW5vdCcsXG5cbiAgZGVsZXRlOiAnZGVsZXRlJyxcbiAgbmV3OiAnbmV3JyxcbiAgdHlwZW9mOiAndHlwZW9mJyxcbiAgdm9pZDogJ3ZvaWQnLFxuICB5aWVsZDogJ3lpZWxkJyxcbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLmFycmF5RXhwcmVzc2lvbicsXG4gIC8vIFsnc3Bhbi5vcGVuaW5nQnJhY2tldCcsICdbJ10sXG4gIC4uLm5vZGUuZWxlbWVudHMubWFwKGVsZW1lbnQgPT5cbiAgICBbXG4gICAgICBbJ3NwYW4uYXJyYXlFbGVtZW50Jywgd2Fsa1RyZWUoZWxlbWVudCldLFxuICAgICAgLy8gKGluZGV4ICE9PSBub2RlLmVsZW1lbnRzLmxlbmd0aCAtIDEpID9cbiAgICAgIC8vICBbJ3NwYW4uYXJyYXlTZXBhcmF0b3InLCAnLCddIDpcbiAgICAgIC8vICAnJ1xuICAgIF1cbiAgKSxcbiAgLy8gWydzcGFuLmNsb3NpbmdCcmFja2V0JywgJ10nXVxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJy5hcnJheVBhdHRlcm4nLFxuICB3YWxrVHJlZShub2RlLmVsZW1lbnRzKSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUgPT4ge1xuICBjb25zdCBjbGFzc2VzID0gWydhcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiddXG4gIGlmIChub2RlLmFzeW5jKSBjbGFzc2VzLnB1c2goJ2FzeW5jJylcbiAgaWYgKG5vZGUuZ2VuZXJhdG9yKSBjbGFzc2VzLnB1c2goJ2dlbmVyYXRvcicpXG5cbiAgcmV0dXJuIFtcbiAgICAnZGl2JyxcbiAgICB7Y2xhc3M6IGNsYXNzZXMuam9pbignICcpfSxcbiAgICBbJ2RpdicsIC8vIFVzZWQgZm9yIGZsZXggbGF5b3V0XG4gICAgICBbJy5wYXJhbWV0ZXJzJywgd2Fsa1RyZWUobm9kZS5wYXJhbXMpXSxcbiAgICAgIFsnLmJvZHknLCB3YWxrVHJlZShub2RlLmJvZHkpXSxcbiAgICBdLFxuICBdXG59XG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAoZXhwcmVzc2lvbikgPT4gW1xuICAnZGl2LmFzc2lnbm1lbnRFeHByZXNzaW9uJyxcbiAgWydzcGFuLmxlZnQnLCB3YWxrVHJlZShleHByZXNzaW9uLmxlZnQpXSxcbiAgWydzcGFuLnJpZ2h0Jywgd2Fsa1RyZWUoZXhwcmVzc2lvbi5yaWdodCldLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ2Rpdi5hc3NpZ25tZW50UGF0dGVybicsXG4gIFsnc3Bhbi5sZWZ0Jywgd2Fsa1RyZWUobm9kZS5sZWZ0KV0sXG4gIFsnc3Bhbi5yaWdodCcsIHdhbGtUcmVlKG5vZGUucmlnaHQpXSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLmF3YWl0RXhwcmVzc2lvbicsXG4gIHdhbGtUcmVlKG5vZGUuYXJndW1lbnQpLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5jb25zdCBvcGVyYXRvck1hcCA9IHJlcXVpcmUoJy4uL29wZXJhdG9yTWFwLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnc3Bhbi5iaW5hcnlFeHByZXNzaW9uJyxcbiAge1xuICAgIGNsYXNzOiAnb3BlcmF0b3ItJyArIChvcGVyYXRvck1hcC5iaW5hcnlbbm9kZS5vcGVyYXRvcl0gfHwgJycpLFxuICB9LFxuICBbJ3NwYW4ubGVmdCcsIHdhbGtUcmVlKG5vZGUubGVmdCldLFxuICBbJ3NwYW4ucmlnaHQnLCB3YWxrVHJlZShub2RlLnJpZ2h0KV0sXG5dXG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnc3Bhbi5icmVha1N0YXRlbWVudCcsXG4gIFsnc3Bhbi5sYWJlbCcsIG5vZGUubGFiZWxcbiAgICA/IHdhbGtUcmVlKG5vZGUubGFiZWwpXG4gICAgOiBudWxsLFxuICBdLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ3NwYW4uY2FsbEV4cHJlc3Npb24nLFxuICBbJ3NwYW4uY2FsbGVlJywgd2Fsa1RyZWUobm9kZS5jYWxsZWUpXSxcbiAgWydzcGFuLmFyZ3VtZW50cycsIHdhbGtUcmVlKG5vZGUuYXJndW1lbnRzKV0sXG5dXG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnLmNhdGNoQ2xhdXNlJyxcbiAgWydzcGFuLnBhcmFtJywgd2Fsa1RyZWUobm9kZS5wYXJhbSldLFxuICBbJ3NwYW4uYm9keScsIHdhbGtUcmVlKG5vZGUuYm9keSldLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ2Rpdi5jbGFzc0JvZHknLFxuICB3YWxrVHJlZShub2RlLmJvZHkpLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ3NlY3Rpb24uY2xhc3NEZWNsYXJhdGlvbicsXG4gIFsnaGVhZGVyJyxcbiAgICBbJ3NwYW4ubmFtZScsIHdhbGtUcmVlKG5vZGUuaWQpXSxcbiAgICBbJ3NwYW4uc3VwZXJDbGFzcycsICcnLCBub2RlLnN1cGVyQ2xhc3NcbiAgICAgID8gd2Fsa1RyZWUobm9kZS5zdXBlckNsYXNzKVxuICAgICAgOiBudWxsLFxuICAgIF0sXG4gIF0sXG4gIFsnZGl2LmJvZHknLCB3YWxrVHJlZShub2RlLmJvZHkpXSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzZWN0aW9uLmNsYXNzRXhwcmVzc2lvbicsXG4gIFsnaGVhZGVyJyxcbiAgICBbJ3NwYW4ubmFtZScsIHdhbGtUcmVlKG5vZGUuaWQpXSxcbiAgICBbJ3NwYW4uc3VwZXJDbGFzcycsICcnLCBub2RlLnN1cGVyQ2xhc3NcbiAgICAgID8gd2Fsa1RyZWUobm9kZS5zdXBlckNsYXNzKVxuICAgICAgOiBudWxsLFxuICAgIF0sXG4gIF0sXG4gIFsnZGl2LmJvZHknLCB3YWxrVHJlZShub2RlLmJvZHkpXSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLmNvbmRpdGlvbmFsRXhwcmVzc2lvbicsXG4gIFsnc3BhbicsIHdhbGtUcmVlKG5vZGUudGVzdCldLFxuICBbJ3NwYW4nLCAnID8gJ10sXG4gIFsnc3BhbicsIHdhbGtUcmVlKG5vZGUuY29uc2VxdWVudCldLFxuICBbJ3NwYW4nLCAnIDogJ10sXG4gIFsnc3BhbicsIHdhbGtUcmVlKG5vZGUuYWx0ZXJuYXRlKV0sXG5dXG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlLmpzJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnc3Bhbi5leHByZXNzaW9uU3RhdGVtZW50JyxcbiAgd2Fsa1RyZWUobm9kZS5leHByZXNzaW9uKSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUgPT4ge1xuICByZXR1cm4gW1xuICAgICdzZWN0aW9uLmNvZGUuZm9yT2YnLFxuICAgIFsnaGVhZGVyJyxcbiAgICAgIFsnLmxlZnQnLCB3YWxrVHJlZShub2RlLmxlZnQpXSxcbiAgICAgIFsnLnJpZ2h0Jywgd2Fsa1RyZWUobm9kZS5yaWdodCldLFxuICAgIF0sXG4gICAgWycuYm9keScsIG5vZGUuYm9keVxuICAgICAgPyB3YWxrVHJlZShub2RlLmJvZHkpXG4gICAgICA6IG51bGwsXG4gICAgXSxcbiAgXVxufVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZSA9PiB7XG4gIHJldHVybiBbXG4gICAgJ3NlY3Rpb24uY29kZS5mb3InLFxuICAgIFsnaGVhZGVyJyxcbiAgICAgIFsnLmluaXQnLCB3YWxrVHJlZShub2RlLmluaXQpXSxcbiAgICAgIFsnLnRlc3QnLCB3YWxrVHJlZShub2RlLnRlc3QpXSxcbiAgICBdLFxuICAgIFsnLmJvZHknLCBub2RlLmJvZHkgPyB3YWxrVHJlZShub2RlLmJvZHkpIDogbnVsbF0sXG4gICAgWycudXBkYXRlJywgd2Fsa1RyZWUobm9kZS51cGRhdGUpXSxcbiAgXVxufVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cblxuZnVuY3Rpb24gbWFya0FzRnVuY3Rpb25QYXJhbWV0ZXIgKG9iamVjdHMpIHtcbiAgcmV0dXJuIG9iamVjdHMubWFwKHBhcmFtID0+IHtcbiAgICBwYXJhbS5pc0Z1bmN0aW9uUGFyYW1ldGVyID0gdHJ1ZVxuICAgIHJldHVybiBwYXJhbVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIHJldHVybiBbXG4gICAgJ3NlY3Rpb24uY29kZS5mdW5jdGlvbicsXG4gICAgWydoZWFkZXInLFxuICAgICAgWydzcGFuLm5hbWUnLCB3YWxrVHJlZShub2RlLmlkKV0sXG4gICAgICBbJ3NwYW4ucGFyYW1ldGVycycsIHdhbGtUcmVlKG1hcmtBc0Z1bmN0aW9uUGFyYW1ldGVyKG5vZGUucGFyYW1zKSldLFxuICAgIF0sXG4gICAgWydkaXYnLCBub2RlLmJvZHkgPyB3YWxrVHJlZShub2RlLmJvZHkpIDogbnVsbF0sXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLmZ1bmN0aW9uRXhwcmVzc2lvbicsXG4gIFsnc3Bhbi5wYXJhbWV0ZXJzJywgd2Fsa1RyZWUobm9kZS5wYXJhbXMpXSxcbiAgWydzcGFuJywgJyA9PiAnXSxcbiAgWydzcGFuJywgd2Fsa1RyZWUobm9kZS5ib2R5KV0sXG5dXG4iLCJjb25zdCBzcGVjaWFsQ2xhc3NNYXAgPSB7XG4gIEluZmluaXR5OiAnaW5maW5pdHknLFxuICB1bmRlZmluZWQ6ICd1bmRlZmluZWQnLFxuICBOYU46ICduYW4nLFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSBbJ2lkZW50aWZpZXInXVxuXG4gIGlmIChzcGVjaWFsQ2xhc3NNYXAuaGFzT3duUHJvcGVydHkobm9kZS5uYW1lKSkge1xuICAgIGNsYXNzZXMucHVzaChzcGVjaWFsQ2xhc3NNYXBbbm9kZS5uYW1lXSlcbiAgICBub2RlLm5hbWUgPSAnJ1xuICB9XG5cbiAgaWYgKG5vZGUuaXNGdW5jdGlvblBhcmFtZXRlcikge1xuICAgIGNsYXNzZXMucHVzaCgncGFyYW1ldGVyJylcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgJ3NwYW4nLFxuICAgIHtjbGFzczogY2xhc3Nlcy5qb2luKCcgJyl9LFxuICAgIG5vZGUubmFtZSxcbiAgXVxufVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZSA9PiB7XG4gIHJldHVybiBbXG4gICAgJ3NlY3Rpb24uY29kZS5pZicsXG4gICAgWydoZWFkZXIudGVzdCcsIHdhbGtUcmVlKG5vZGUudGVzdCldLFxuICAgIFsnZGl2LmNvbnNlcXVlbnQnLCBub2RlLmNvbnNlcXVlbnQgPyB3YWxrVHJlZShub2RlLmNvbnNlcXVlbnQpIDogbnVsbF0sXG4gICAgWydkaXYuYWx0ZXJuYXRlJywgbm9kZS5hbHRlcm5hdGUgPyB3YWxrVHJlZShub2RlLmFsdGVybmF0ZSkgOiBudWxsXSxcbiAgXVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4ge1xuICBsZXQgbm9kZVR5cGUgPSB0eXBlb2Ygbm9kZS52YWx1ZVxuICBjb25zdCBjbGFzc2VzID0gWydsaXRlcmFsJ11cblxuICBpZiAobm9kZS5yZWdleCkgbm9kZVR5cGUgPSAncmVnZXgnXG4gIGVsc2UgaWYgKG5vZGUudmFsdWUgPT09IG51bGwpIG5vZGVUeXBlID0gJ251bGwnXG5cbiAgY2xhc3Nlcy5wdXNoKG5vZGVUeXBlKVxuXG4gIGlmIChub2RlLnZhbHVlID09PSB0cnVlKSBjbGFzc2VzLnB1c2goJ3RydWUnKVxuICBpZiAobm9kZS52YWx1ZSA9PT0gZmFsc2UpIGNsYXNzZXMucHVzaCgnZmFsc2UnKVxuXG4gIHJldHVybiBbXG4gICAgJ3NwYW4nLFxuICAgIHtjbGFzczogY2xhc3Nlcy5qb2luKCcgJyl9LFxuICAgIG5vZGUucmVnZXhcbiAgICAgID8gU3RyaW5nKG5vZGUudmFsdWUpXG4gICAgICA6IFsnYm9vbGVhbicsICdudWxsJ10uaW5jbHVkZXMobm9kZVR5cGUpXG4gICAgICAgID8gJydcbiAgICAgICAgOiBKU09OXG4gICAgICAgICAgLnN0cmluZ2lmeShub2RlLnZhbHVlKVxuICAgICAgICAgIC5yZXBsYWNlKC9eXCIoLiopXCIkLywgJyQxJyksXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuY29uc3Qgb3BlcmF0b3JNYXAgPSByZXF1aXJlKCcuLi9vcGVyYXRvck1hcC5qcycpXG5cblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4ge1xuICBjb25zdCBjbGFzc2VzID0gWydsb2dpY2FsRXhwcmVzc2lvbiddXG4gIGlmIChub2RlLm9wZXJhdG9yKSB7XG4gICAgY2xhc3Nlcy5wdXNoKCdvcGVyYXRvci0nICsgb3BlcmF0b3JNYXAuYmluYXJ5W25vZGUub3BlcmF0b3JdKVxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICAnc3BhbicsXG4gICAge2NsYXNzOiBjbGFzc2VzLmpvaW4oJyAnKX0sXG4gICAgWydzcGFuLmxlZnQnLCB3YWxrVHJlZShub2RlLmxlZnQpXSxcbiAgICBbJ3NwYW4ucmlnaHQnLCB3YWxrVHJlZShub2RlLnJpZ2h0KV0sXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSBbJ21lbWJlckV4cHJlc3Npb24nXVxuICBpZiAobm9kZS5jb21wdXRlZCkgY2xhc3Nlcy5wdXNoKCdjb21wdXRlZCcpXG5cbiAgcmV0dXJuIFtcbiAgICAnc3BhbicsXG4gICAge2NsYXNzOiBjbGFzc2VzLmpvaW4oJyAnKX0sXG4gICAgWydzcGFuLm9iamVjdCcsIHdhbGtUcmVlKG5vZGUub2JqZWN0KV0sXG4gICAgWydzcGFuLnByb3BlcnR5Jywgd2Fsa1RyZWUobm9kZS5wcm9wZXJ0eSldLFxuICBdXG59XG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4ge1xuICByZXR1cm4gW1xuICAgICdzZWN0aW9uLmNvZGUubWV0aG9kJyxcbiAgICBbJ2hlYWRlcicsIHdhbGtUcmVlKG5vZGUua2V5KV0sXG4gICAgWydkaXYnLCB3YWxrVHJlZShub2RlLnZhbHVlKV0sXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLm5ld0V4cHJlc3Npb24nLFxuICAnbmV3ICcsXG4gIFsnc3BhbicsIHdhbGtUcmVlKG5vZGUuY2FsbGVlKV0sXG4gIFsnc3Bhbi5sZWZ0U2VwYXJhdG9yJywgJygnXSxcbiAgWydzcGFuJywgLi4ubm9kZS5hcmd1bWVudHMubWFwKHdhbGtUcmVlKV0sXG4gIFsnc3Bhbi5yaWdodFNlcGFyYXRvcicsICcpJ10sXG5dXG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4ge1xuICByZXR1cm4gW1xuICAgICdzcGFuLm9iamVjdEV4cHJlc3Npb24nLFxuICAgIHdhbGtUcmVlKG5vZGUucHJvcGVydGllcyksXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdzcGFuLm9iamVjdFBhdHRlcm4nLFxuICB3YWxrVHJlZShub2RlLnByb3BlcnRpZXMpLFxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBub2RlID0+IFtcbiAgJ3NwYW4ucHJvcGVydHlDb21tZW50JyxcbiAgbm9kZS52YWx1ZSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSBbXG4gICAgJ3Byb3BlcnR5JyxcbiAgICBub2RlLmtpbmQsXG4gIF1cblxuICBpZiAobm9kZS5tZXRob2QpIGNsYXNzZXMucHVzaCgnbWV0aG9kJylcbiAgaWYgKG5vZGUuc2hvcnRoYW5kKSBjbGFzc2VzLnB1c2goJ3Nob3J0aGFuZCcpXG5cbiAgcmV0dXJuIFtcbiAgICAnc3BhbicsXG4gICAge2NsYXNzOiBjbGFzc2VzLmpvaW4oJyAnKX0sXG4gICAgWydzcGFuLmtleScsIHdhbGtUcmVlKG5vZGUua2V5KV0sXG4gICAgWydzcGFuLnZhbHVlJywgd2Fsa1RyZWUobm9kZS52YWx1ZSldLFxuICBdXG59XG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnc3Bhbi5yZXR1cm4nLFxuICB3YWxrVHJlZShub2RlLmFyZ3VtZW50KSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnNvbGUuZGlyKEpTT04uc3RyaW5naWZ5KG5vZGUsIG51bGwsIDIpKVxuXG4gIHJldHVybiBbXG4gICAgJ3NwYW4ub3BlcmF0b3Itc3ByZWFkJyxcbiAgICB3YWxrVHJlZShub2RlLmFyZ3VtZW50KSxcbiAgXVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoKSA9PiBbXG4gICdzcGFuLnN1cGVyJywgJycsXG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSBbJ3RlbXBsYXRlRWxlbWVudCcsICdzdHJpbmcnXVxuXG4gIGlmIChub2RlLnRhaWwpIGNsYXNzZXMucHVzaCgndGFpbCcpXG5cbiAgcmV0dXJuIFtcbiAgICAnc3BhbicsXG4gICAge2NsYXNzOiBjbGFzc2VzLmpvaW4oJyAnKX0sXG4gICAgbm9kZS52YWx1ZS5yYXcsXG4gIF1cbn1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5mdW5jdGlvbiB6aXBFeHByZXNzaW9ucyAocXVhc2lzLCBleHByZXNzaW9ucykge1xuICBjb25zdCBjb21iaW5lZCA9IFtdXG4gIHF1YXNpcy5mb3JFYWNoKChxdWFzaSwgaW5kZXgpID0+IHtcbiAgICBjb21iaW5lZC5wdXNoKHF1YXNpKVxuICAgIGlmIChleHByZXNzaW9uc1tpbmRleF0pIHtcbiAgICAgIGNvbWJpbmVkLnB1c2goZXhwcmVzc2lvbnNbaW5kZXhdKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGNvbWJpbmVkXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZSA9PiBbXG4gICdzcGFuLnRlbXBsYXRlTGl0ZXJhbCcsXG4gIHdhbGtUcmVlKHppcEV4cHJlc3Npb25zKG5vZGUucXVhc2lzLCBub2RlLmV4cHJlc3Npb25zKSksXG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9ICgpID0+IFtcbiAgJ3NwYW4udGhpc0V4cHJlc3Npb24nLFxuICAndGhpcycsXG5dXG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSAobm9kZSkgPT4gW1xuICAnc3Bhbi50aHJvd1N0YXRlbWVudCcsXG4gIFsnc3Bhbi5hcmd1bWVudCcsIHdhbGtUcmVlKG5vZGUuYXJndW1lbnQpXSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICcudHJ5U3RhdGVtZW50JyxcbiAgWycuYmxvY2snLCB3YWxrVHJlZShub2RlLmJsb2NrKV0sXG4gIFsnLmhhbmRsZXInLCB3YWxrVHJlZShub2RlLmhhbmRsZXIpXSxcbiAgWycuZmluYWxpemVyJywgbm9kZS5maW5hbGl6ZXJcbiAgICA/IHdhbGtUcmVlKG5vZGUuZmluYWxpemVyKVxuICAgIDogbnVsbCxcbiAgXSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuY29uc3Qgb3BlcmF0b3JNYXAgPSByZXF1aXJlKCcuLi9vcGVyYXRvck1hcC5qcycpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ3NwYW4udW5hcnlFeHByZXNzaW9uJyxcbiAge1xuICAgIGNsYXNzOiAnb3BlcmF0b3ItJyArIChvcGVyYXRvck1hcC51bmFyeVtub2RlLm9wZXJhdG9yXSB8fCAnJyksXG4gIH0sXG4gIHdhbGtUcmVlKG5vZGUuYXJndW1lbnQpLFxuXVxuIiwiY29uc3Qgd2Fsa1RyZWUgPSByZXF1aXJlKCcuLi93YWxrVHJlZScpXG5cbm1vZHVsZS5leHBvcnRzID0gKG5vZGUpID0+IFtcbiAgJ3NwYW4udXBkYXRlRXhwcmVzc2lvbicsXG4gIFsnc3Bhbi5vcGVyYXRvcicsIG5vZGUub3BlcmF0b3JdLFxuICB3YWxrVHJlZShub2RlLmFyZ3VtZW50KSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiBbXG4gICdkaXYnLFxuICB7Y2xhc3M6ICdkZWNsYXJhdGlvbnMgJyArIG5vZGUua2luZH0sXG4gIHdhbGtUcmVlKG5vZGUuZGVjbGFyYXRpb25zKSxcbl1cbiIsImNvbnN0IHdhbGtUcmVlID0gcmVxdWlyZSgnLi4vd2Fsa1RyZWUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChub2RlKSA9PiB7XG4gIGNvbnN0IGhhc0luaXQgPSBCb29sZWFuKG5vZGUuaW5pdClcbiAgY29uc3QgY2xhc3NlcyA9IFsnZGVjbGFyYXRpb24nXVxuXG4gIGlmIChoYXNJbml0KSBjbGFzc2VzLnB1c2goJ2hhc0luaXQnKVxuXG4gIHJldHVybiBbXG4gICAgJ2RpdicsXG4gICAge2NsYXNzOiBjbGFzc2VzLmpvaW4oJyAnKX0sXG4gICAgWydzcGFuLmlkZW50aWZpZXInLCB3YWxrVHJlZShub2RlLmlkKV0sXG4gICAgWydzcGFuLmluaXQnLCBoYXNJbml0XG4gICAgICA/IHdhbGtUcmVlKG5vZGUuaW5pdClcbiAgICAgIDogbnVsbCxcbiAgICBdLFxuICBdXG59XG4iLCJjb25zdCB3YWxrVHJlZSA9IHJlcXVpcmUoJy4uL3dhbGtUcmVlJylcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlID0+IHtcbiAgcmV0dXJuIFtcbiAgICAnc2VjdGlvbi5jb2RlLndoaWxlJyxcbiAgICBbJ2hlYWRlci50ZXN0JyxcbiAgICAgIFsnZGl2Jywgd2Fsa1RyZWUobm9kZS50ZXN0KV0sXG4gICAgXSxcbiAgICBbJ2Rpdi5ib2R5Jywgbm9kZS5ib2R5ID8gd2Fsa1RyZWUobm9kZS5ib2R5KSA6IG51bGxdLFxuICBdXG59XG4iXX0=
