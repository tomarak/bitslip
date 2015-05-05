'use strict';

module.exports = {
	db: 'mongodb://localhost/bitslip-test',
	port: 3001,
	app: {
		title: 'bitslip - Test Environment'
	},
	coinbase: {
		clientID: process.env.COINBASE_ID || 'APP_ID',
		clientSecret: process.env.COINBASE_SECRET || 'APP_SECRET'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
