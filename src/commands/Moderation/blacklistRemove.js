const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistRemoveCommand extends Command {
	constructor() {
		super('blacklistremove', {
			aliases: ['blacklistremove', 'blr'],
			category: 'Moderation',
			channel: 'guild',
			args: [
				{
					id: 'channel',
					type: 'channel',
				},
			],
			description: {
				description:
					'Remove a channel from the database "Blacklists" to enable the bot in that specific channel.',
				usage: 'blacklistremove <channel>',
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
		if (!args.channel)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a channel to blacklist.`,
				}),
			);
		if (
			await this.client.db.blacklists.findOne({
				channel_id: args.channel.id,
			})
		) {
			await this.client.db.blacklists.deleteOne(
				{ channel_id: args.channel.id },
				function (err) {
					if (err) console.log(err);
				},
			);
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `${args.channel} is not blacklisted anymore.`,
				}),
			);
		} else
			return message.channel.send(
				new Discord.MessageEmbed().setDescription(
					`${args.channel} was not blacklisted!`,
				),
			);
	}
}

module.exports = BlacklistRemoveCommand;
