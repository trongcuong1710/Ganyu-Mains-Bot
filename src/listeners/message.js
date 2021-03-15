const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
class MessageListener extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(message) {
		if (message.guild == null) return;
		if (
			await this.client.db.blacklists.findOne({
				channel_id: message.channel.id,
			})
		)
			return;

		const prefix = this.client.commandHandler.prefix;

		let quoteName = '';
		const firstWord = message.content.trim().split(/ +/g)[0];
		if (firstWord.startsWith(prefix)) {
			quoteName = firstWord.slice(prefix.length);
		}

		const quotes = await this.client.db.quotes.findOne({
			quoteName: quoteName,
		});

		if (quotes)
			return message.channel.send(
				quotes.embed
					? new Discord.MessageEmbed(JSON.parse(quotes.quote))
					: quotes.quote,
			);
	}
}

module.exports = MessageListener;
