const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class UnbanCommand extends Command {
	constructor() {
		super('unban', {
			aliases: ['unban', 'ub'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'BAN_MEMBERS',
			args: [
				{
					id: 'member',
					type: 'string',
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				description: 'Unbans the member. **Use IDs Only**',
				usage: 'unban <user> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to unban.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason for the unban.`,
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
		try {
			await message.guild.members
				.unban(args.member, args.reason)
				.then(() =>
					message.channel
						.send(
							new Discord.MessageEmbed({
								description: `<@${args.member}> is successfully unbanned with the reason: ${args.reason}`,
							}),
						)
						.catch((err) => {
							message.channel.send(err.message);
						}),
				)
				.catch((err) => {
					message.channel.send(
						new Discord.MessageEmbed({
							description: `There was an error occurred while trying to unban ${args.member}.\n**Error**: \`${err.message}\``,
						}),
					);
				});
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = UnbanCommand;
