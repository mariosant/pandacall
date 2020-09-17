module.exports = {
	name: 'telnyx',
	settings: {},
	dependencies: [],
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

	methods: {},

	created() {},

	async started() {},

	async stopped() {},
}
