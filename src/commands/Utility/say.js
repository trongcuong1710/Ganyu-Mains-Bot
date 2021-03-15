const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class SayCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say'],
			ownerOnly: false,
			category: 'Utility',
			channel: 'guild',
			args: [
				{
					id: 'channel',
					type: 'channel',
				},
				{
					id: 'message',
					type: 'string',
					match: 'rest',
				},
			],
			clientPermissions: 'MANAGE_MESSAGES',
			description: {
				description:
					'Resends the message either to current channel or given channel.',
				usage: 'say',
			},
		});
	}

	exec(message, args) {
		if (!args.channel)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a channel to send the message.`,
				}),
			);
		if (!args.message)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a message to send to the channel.`,
				}),
			);
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
		args.channel.send(args.message).catch((err) => {
			message.channel.send(
				new Discord.MessageEmbed({
					description: `There was an error occurred while trying to send the message.\n**Error:** ${err.message}`,
				}),
			);
		});
	}
}

module.exports = SayCommand;
