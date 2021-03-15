const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class EmbedCommand extends Command {
	constructor() {
		super('embed', {
			aliases: ['embed'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			description: {
				description: 'Takes json input and returns embedded message.',
				usage: 'embed <JSONinput>',
			},
		});
	}

	exec(message, args) {
		const permRoles = [
			'803065968426352640', // Qixing Secretary
			'795102781346021376', // Head Admin
			'786025543124123698', // Server Admin
			'786025543124123699', // Network Admin
			'786025543085981705', // Moderator
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
		try {
			message.channel.send(
				new Discord.MessageEmbed(
					JSON.parse(message.content.split(' ').splice(1).join(' ')),
				),
			);
		} catch (err) {
			message.channel.send(
				new Discord.MessageEmbed({
					description: `There was an error occurred while trying to send given embed.\n**Error:** ${err.message}`,
				}),
			);
		}
	}
}

module.exports = EmbedCommand;
