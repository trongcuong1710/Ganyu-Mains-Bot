const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistsCommand extends Command {
	constructor() {
		super('blacklists', {
			aliases: ['blacklists', 'blist'],
			category: 'Moderation',
			channel: 'guild',
			description: {
				description: 'List blacklisted channels.',
				usage: 'blacklists',
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
		const blacklists = await this.client.db.blacklists.find();
		const noBlacklistsEmbed = new Discord.MessageEmbed().setDescription(
			`There are no blacklisted channels in the database.`,
		);
		if (!blacklists.length) return message.channel.send(noBlacklistsEmbed);
		const blacklistsListEmbed = new Discord.MessageEmbed()
			.setTitle(`List of Blacklisted Channels`)

			.setDescription(
				blacklists
					.map(
						(x) =>
							`**Blacklisted Channel: **<#${x.channel_id}>\n**Blacklisted By: ** <@${x.blacklistedBy}>`,
					)
					.join('\n\n'),
			);
		message.channel.send(blacklistsListEmbed);
	}
}

module.exports = BlacklistsCommand;
