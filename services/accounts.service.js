const {customAlphabet} = require('nanoid')
const slugify = require('@sindresorhus/slugify');
const DbMixin = require('../mixins/db.mixin')

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 15)

module.exports = {
	name: 'accounts',
	mixins: [DbMixin('accounts')],
	settings: {
		fields: ['_id', 'name', 'branches', 'slug', 'enabled'],
		entityValidator: {
			_id: 'string|optional',
			enabled: 'boolean|optional',
			name: 'string|min:3',
			branches: {
				$$type: 'array',
				items: {
					name: 'string',
					telephone: 'string',
				},
			},
		},
	},
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		findById: {
			params: {
				id: 'string'
			},
			async handler(ctx) {
				const account = await this.adapter.findById(ctx.params.id)

				return account
			}
		},

		canReceiveCalls: {
			params: {
				id: 'string',
			},
			async handler(ctx) {
				const doc = await this.adapter.findById(ctx.params.id)

				return doc.enabled || false
			}
		},

		switch: {
			params: {
				id: 'string',
				enabled: 'boolean'
			},
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {
					$set: {enabled: ctx.params.enabled}
				})

				return doc
			}
		},
	},

	methods: {
		async seedDB() {
			await this.adapter.insertMany([])
		},
	},

	hooks: {
		before: {
			create(ctx) {
				ctx.params.id = nanoid()
				ctx.params.enabled = ctx.params.enabled || false
			},
		},
	},
}
