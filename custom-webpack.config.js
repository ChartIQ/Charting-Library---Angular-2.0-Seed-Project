const path = require('path');

module.exports = {
	module: {
		rules: [
			/* HTML bundling rule, used mainly for plugins UI */
			{
				test: /\.html/,
				use: [{ loader: 'html-loader' }],
			},
		]
	}
};
