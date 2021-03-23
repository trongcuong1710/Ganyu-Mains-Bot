const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`),
);

const {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
} = require('discord-akairo');

require('dotenv').config();

const mongoose = require('mongoose');

class MyClient extends AkairoClient {
	constructor() {
		super(
			{
				ownerID: '488699894023061516',
			},
			{
				disableMentions: 'everyone',
			},
		);
		this.commandHandler = new CommandHandler(this, {
			directory: './src/commands',
			prefix: 'g!',
			automateCategories: true,
			allowMention: true,
			blockBots: true,
			blockClient: true,
		});
		this.commandHandler.handle = async function (message) {
			if (
				!(await this.client.db.blacklists.findOne({
					channel_id: message.channel.id,
				}))
			)
				return CommandHandler.prototype.handle.call(this, message);
		};
		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listeners/',
			automateCategories: true,
		});
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.loadAll();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();

		mongoose
			.connect(
				process.env.MONGOOSE_URL,
				{
					useNewUrlParser: true,
					useUnifiedTopology: true,
					useFindAndModify: false,
				},
			)
			.then(() => console.log('Connected to the database!'));

		this.db = {
			warns: mongoose.model(
				'warns',
				new mongoose.Schema({
					warnID: Number,
					warnedStaff: String,
					warnedMember: String,
					reason: String,
					when: Date,
				}),

				'warns',
			),
			quotes: mongoose.model(
				'quotes',
				new mongoose.Schema({
					quoteName: String,
					quote: String,
					by: String,
					embed: Boolean,
				}),
				'quotes',
			),
			blacklists: mongoose.model(
				'blacklists',
				new mongoose.Schema({
					channel_id: String,
					blacklistedBy: String,
				}),
				'blacklists',
			),
		};
	}
}

const client = new MyClient();
client.login();
