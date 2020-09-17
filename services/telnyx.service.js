const got = require('got')

const telnyxApiKey = process.env.TELNYX_API_KEY

const telnyxClient = got.extend({
	prefixUrl: 'https://api.telnyx.com/v2',
	responseType: 'json',
	resolveBodyOnly: true,
	hooks: {
		beforeRequest: options => {
			options.headers.Authorization = `Bearer ${telnyxApiKey}`
		}
	}
})

module.exports = {
	name: 'telnyx',
	actions: {
		webhook: {
			rest: {
				method: 'POST',
				path: '/webhook',
			},
			async handler(ctx) {
				const { broker, params } = ctx
				const {
					data: { event_type },
				} = params

				const eventType = `telnyx.webhook.${event_type}`
				broker.emit(eventType, ctx.params)

				return 'ok'
			},
		},
	},

	events: {
		'telnyx.webhook.**'(ctx) {
			this.logger.info(ctx.params)
		},
	},

	methods: {
		async apiRequest({action, id, payload}) {
			return id
				? telnyxClient.post(`calls/${id}/${action}`, {
					json: payload
				})
				: telnyxClient.post(`calls/${action}`, {
					json: payload
				})
		}
	},
}
