const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class PurgeCommand extends Command {
	constructor() {
		super('purge', {
			aliases: ['purge', 'clear'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: ['MANAGE_MESSAGES'],
			description: {
				description: 'Purges the given amount of messages.',
				usage: 'purge <1-100>',
			},
			args: [
				{
					id: 'amount',
					type: 'number',
				},
			],
		});
	}

	async exec(message, args) {
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
					new Discord.MessageEmbed()
						.setColor(12354762)
						.setDescription("You can't do that with the permissions you have."),
				);
		}
		const purgedEmbed = new Discord.MessageEmbed().setDescription(
			`Successfully purged ${args.amount} messages.`,
		);
		message.delete();
		await message.channel.bulkDelete(args.amount).catch((err) => {
			message.channel.send(
				`There was an error occurred while trying to purge.\n**Error:** ${err.message}`,
			);
		});
		message.channel.send(purgedEmbed).then((msg) => {
			msg.delete({ timeout: 5000 });
		});
	}
}

module.exports = PurgeCommand;
