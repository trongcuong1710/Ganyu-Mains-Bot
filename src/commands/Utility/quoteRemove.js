const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const mongoose = require('mongoose');

class RemoveQuoteCommand extends Command {
	constructor() {
		super('removequote', {
			aliases: ['removequote', 'rq'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			args: [
				{
					id: 'quote',
					type: 'string',
				},
			],
			description: {
				description: 'Remove a quote from the database.',
				usage: 'removequote <quoteName> <message>',
			},
		});
	}

	async exec(message, args) {
		if (!args.quote)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a quote name to remove from the database.`,
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
		if (await this.client.db.quotes.findOne({ quoteName: args.quote })) {
			await this.client.db.quotes.deleteOne({
				quoteName: args.quote,
			});
		} else
			return message.channel.send(
				new Discord.MessageEmbed().setDescription(
					`**${args.quote}** doesn't exist in the database!`,
				),
			);
		message.channel.send(
			new Discord.MessageEmbed({
				description: `**Quote Removed from the Database!**\n\n**Quote Name**: ${args.quote}\n**Removed By**: <@${message.author.id}>`,
			}),
		);
	}
}

module.exports = RemoveQuoteCommand;
