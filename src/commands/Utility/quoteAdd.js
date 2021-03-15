const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const mongoose = require('mongoose');

class AddQuoteCommand extends Command {
	constructor() {
		super('addquote', {
			aliases: ['addquote', 'aq'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			args: [
				{
					id: 'quote',
					type: 'string',
				},
				{
					id: 'answer',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				description: 'Add a quote to the database and call it when needed.',
				usage: 'addquote <quoteName> <message>',
			},
		});
	}

	async exec(message, args) {
		if (!args.quote)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a quote name to add into the database.`,
				}),
			);
		if (!args.answer)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a quote answer to add into the database.`,
				}),
			);
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
		let data;
		let embed = false;
		try {
			data = JSON.stringify(
				new Discord.MessageEmbed(JSON.parse(args.answer)).toJSON(),
			);

			embed = true;
		} catch (_) {
			data = args.answer;
		}
		if (!(await this.client.db.quotes.findOne({ quoteName: args.quote }))) {
			await this.client.db.quotes.create({
				quoteName: args.quote,
				quote: data,
				by: message.author.tag,
				embed: embed,
			});
		} else
			return message.channel.send(
				new Discord.MessageEmbed().setDescription(
					`**${args.quote}** is already in the database!`,
				),
			);
		message.channel.send(
			new Discord.MessageEmbed({
				description: `**Quote Added to the Database!**\n\n**Quote Name**: ${args.quote}\n**Quote Returns**: ${args.answer}\n**Added By**: <@${message.author.id}>`,
			}),
		);
	}
}

module.exports = AddQuoteCommand;
