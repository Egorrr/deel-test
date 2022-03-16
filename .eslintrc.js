module.exports = {
	env: {
		node: true,
		es6: true
	},
	extends: ['eslint:recommended'],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	globals: {
		describe: true,
		it: true,
		before: true,
		after: true
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		curly: ['error', 'all'],
		semi: ['error', 'always'],
		'dot-notation': 'error',
		'arrow-parens': 'error',
		'arrow-spacing': 'error',
		'no-const-assign': 'error',
		'no-class-assign': 'error',
		'no-multi-spaces': ['error'],
		'comma-dangle': ['error', 'never'],
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'after-used',
				argsIgnorePattern: '^_'
			}
		],
		'eol-last': ['error', 'unix'],
		'no-path-concat': 'error',
		camelcase: 'error',
		'no-new-symbol': 'error',
		'template-curly-spacing': ['error', 'never'],
		'prefer-template': 'error',
		'no-array-constructor': 'error',
		'no-shadow': 'error',
		'no-var': 'error',
		'no-trailing-spaces': 'error',
		'no-else-return': 'error',
		'use-isnan': 'error',
		'no-cond-assign': ['error', 'except-parens'],
		'array-bracket-newline': ['error', 'consistent'],
		'keyword-spacing': 'error',
		'object-curly-spacing': ['error', 'always'],
		'space-in-parens': ['warn', 'never'],
		'no-use-before-define': [
			'error',
			{
				functions: false,
				classes: true
			}
		],
		'no-duplicate-imports': [
			'error',
			{
				includeExports: true
			}
		],
		'prefer-arrow-callback': [
			'error',
			{
				allowNamedFunctions: true
			}
		],
		'require-jsdoc': [
			'error',
			{
				require: {
					FunctionDeclaration: true,
					MethodDefinition: false,
					ClassDeclaration: false
				}
			}
		],
		'valid-jsdoc': [
			'error',
			{
				requireReturn: false,
				prefer: {
					return: 'returns'
				}
			}
		],
		'space-before-function-paren': [
			'error',
			{
				anonymous: 'never',
				named: 'never',
				asyncArrow: 'always'
			}
		],
		'max-len': [
			'warn',
			{
				code: 120
			}
		],
		'no-multiple-empty-lines': ['error', { max: 1 }]
	}
};
