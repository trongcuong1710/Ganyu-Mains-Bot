const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class KickCommand extends Command {
	constructor() {
		super('kick', {
			aliases: ['kick', 'k'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'KICK_MEMBERS',
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				description: 'Kicks the member.',
				usage: 'kick <user> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to kick.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason for the kick.`,
				}),
			);
		const kickedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been kicked from ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Kicked At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setFooter(
				`If you think you're wrongfully kicked, please contact an Admin.`,
			);
		const cantKickStaffEmbed = new Discord.MessageEmbed().setDescription(
			`Sorry but you can't kick other staff members/staff members that has higher perms than you.`,
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
		if (
			args.member.roles.highest.position >=
			message.member.roles.highest.position
		)
			return message.channel.send(cantKickStaffEmbed);

		await args.member
			.kick(args.reason)
			.then(() => {
				args.member.send(kickedToDMEmbed).catch((err) => {
					return;
				});
				message.channel.send(
					new Discord.MessageEmbed({
						description: `Successfully kicked ${args.member} with the reason: ${args.reason}.`,
					}),
				);
			})
			.catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed({
						description: `There was an error occurred while trying to kick ${args.member}.\n**Error**: \`${err.message}\``,
					}),
				);
			});
	}
}

module.exports = KickCommand;
