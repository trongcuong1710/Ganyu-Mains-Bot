const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class QuotesCommand extends Command {
	constructor() {
		super('quotes', {
			aliases: ['quotes'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			args: [
				{
					id: 'quoteName',
					type: 'string',
				},
			],
			description: {
				description: 'Shows list of quotes.',
				usage: 'quotes',
			},
		});
	}

	async exec(message, args) {
		const permRoles = [
			'803065968426352640', // Qixing Secretary
			'795102781346021376', // Head Admin
			'786025543124123698', // Server Admin
			'786025543124123699', // Network Admin
			'786025543085981705', // Moderator
			'802560679767965717', // Guiding Goat
		];
		var i;
		for (i = 0; i <= permRoles.length; i++) {
			if (
				message.member.roles.cache
					.map((x) => x.id)
					.filter((x) => permRoles.includes(x)).length === 0
			)
				return message.channel.send(
					new Discord.MessageEmbed().setDescription(
						"You can't do that with the permissions you have.",
					),
				);
		}
		const quotes = await this.client.db.quotes.find();
		const noQuotesEmbed = new Discord.MessageEmbed().setDescription(
			`There are no quotes in the database.`,
		);
		if (!quotes.length) return message.channel.send(noQuotesEmbed);
		async function showQuotes() {
			return message.channel.send(
				new Discord.MessageEmbed({
					description: quotes
						.map((x) => `**Quote Name**: ${x.quoteName}`)
						.join('\n'),
				}),
			);
		}
		if (!args.quoteName) return showQuotes();
		const quoteOfName = await this.client.db.quotes.find({
			quoteName: args.quoteName,
		});
		async function showWarnOfID() {
			return message.channel.send(
				new Discord.MessageEmbed({
					description: quoteOfName
						.map(
							(x) =>
								`**Quote Name**: ${x.quoteName}\n**Quote Returns**: ${
									x.quote
								}\n**Added By**: ${x.by}\n**Date & Time**: ${moment().format(
									'LLLL',
								)}`,
						)
						.join('\n'),
				}),
			);
		}
		showWarnOfID();
	}
}

module.exports = QuotesCommand;
