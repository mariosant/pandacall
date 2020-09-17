const ApiGateway = require('moleculer-web')

module.exports = {
	name: 'api',
	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT || 3000,
		ip: '0.0.0.0',
		routes: [
			{
				path: '/webhooks',

				whitelist: ['telnyx.*'],

				mergeParams: true,
				authentication: false,
				authorization: false,
				autoAliases: true,
				aliases: {},
				bodyParsers: {
					json: {
						strict: false,
						limit: '1MB',
					},
					urlencoded: {
						extended: true,
						limit: '1MB',
					},
				},
				mappingPolicy: 'all',
				logging: true,
			},
		],
		log4XXResponses: false,
		logRequestParams: null,
		logResponseData: null,
	},

	methods: {},
}
