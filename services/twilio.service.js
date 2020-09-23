const got = require('got')

const initialFrom = process.env.INITIAL_PHONE_NUMBER
const flowId = process.env.TWILIO_FLOW_ID

const initiateTwilioCall = async ({agent, visitor, }) => {

    return got.post(`https://studio.twilio.com/v2/Flows/${flowId}`, {
        form: {
            To: visitor,
            From: initialFrom,
            Parameters: {
                visitor
            }
        }
    })
}

module.exports = {
	name: 'twilio',
	events: {
		async 'calls.created'(ctx) {
			initiateTwilioCall({
				agent: ctx.params.call.agent,
				visitor: ctx.params.call.visitor
			})
		}
	}
}
