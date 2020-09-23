const R = require('ramda')
const {nanoid} = require('nanoid')
const DbMixin = require('../mixins/db.mixin')

module.exports = {
	name: 'calls',
	mixins: [DbMixin('calls')],
	settings: {
		fields: ['_id', 'accountId', 'visitor', 'agent', 'createdAt', 'endedAt'],
		entityValidator: {
			_id: 'string|optional',
			accountId: 'string',
			visitor: 'string',
			agent: 'string',
			createdAt: 'number',
			endedAt: 'number|optional',
		},
	},
	actions: {
		list: false,
		find: false,
		count: false,
		create: false,
		insert: false,
		update: false,
		remove: false,

		initiate: {
            params: {
				accountId: 'string',
				branch: 'string',
				visitor: 'string',

			},
			async handler(ctx) {
				const {broker, params} = ctx
				const {_create} = this

				const account = await broker.call('accounts.findById', {id: params.accountId})

				const branch = account.branches.find(({name}) => name === params.branch)

				const call = await _create(ctx, {
					_id: nanoid(),
					accountId: params.accountId,
					visitor: params.visitor,
					agent: branch.telephone,
					createdAt: Date.now()
				})

				broker.emit('calls.created', {call})

				return {
					...R.omit(['agent'],call),
					branch: ctx.params.branch
				}
			}
        }


	},
}
