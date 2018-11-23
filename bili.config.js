module.exports = {
	input: ['index.js'],
	moduleName: 'PanResponder',
	formats: ['umd'],
	global: {
		react: 'React',
		'react-dom': 'ReactDom',
		'react-dom/unstable-native-dependencies': 'UnstableDependencies'
	},
	banner: true,
	filename: 'panresponder[suffix].js'
}