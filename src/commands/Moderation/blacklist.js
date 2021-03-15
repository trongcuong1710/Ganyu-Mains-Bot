const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistCommand extends Command {
	constructor() {
		super('blacklist', {
			aliases: ['blacklist', 'bl'],
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
					'Add a channel to the database "Blacklists" to disable the bot in that specific channel. (Can be more than one channel)',
				usage: 'blacklist <channel>',
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
					new Discord.MessageEmbed()
						.setColor(12354762)
						.setDescription("You can't do that with the permissions you have."),
				);
		}
		if (!args.channel)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a channel to blacklist.`,
				}),
			);
		if (
			!(await this.client.db.blacklists.findOne({
				channel_id: args.channel.id,
			}))
		) {
			await this.client.db.blacklists.create({
				channel_id: args.channel.id,
				blacklistedBy: message.author.id,
			});
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `${args.channel} is now added to the database as a blacklisted channel, I am not going to run commands there.`,
				}),
			);
		} else
			return message.channel.send(
				new Discord.MessageEmbed()
					.setColor(12354762)
					.setDescription(`${args.channel} is already blacklisted!`),
			);
	}
}

module.exports = BlacklistCommand;
