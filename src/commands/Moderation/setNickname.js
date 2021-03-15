const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class SetNicknameCommand extends Command {
	constructor() {
		super('setnickname', {
			aliases: ['setnickname', 'setnick', 'sn', 'nick'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'CHANGE_NICKNAME',
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'newName',
					type: 'string',
					match: 'phrase',
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				description: "Change's people's name.",
				usage: 'setnickname <member> <newName>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to change nickname.`,
				}),
			);
		if (!args.newName)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a new nickname to change.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason for the change.`,
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
		await args.member
			.setNickname(args.newName)
			.then(() => {
				message.channel.send(
					new Discord.MessageEmbed({
						description: `**${args.member.user.username}**'s nickname is now changed to: **${args.newName}**, reason being: **${args.reason}**`,
					}),
				);
			})
			.catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed().setDescription(
						`There was an error while trying to change their nickname.\n**Error:** ${err.message}`,
					),
				);
			});
	}
}

module.exports = SetNicknameCommand;
