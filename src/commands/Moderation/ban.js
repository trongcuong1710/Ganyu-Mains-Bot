const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class BanCommand extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban', 'b'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'BAN_MEMBERS',
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
				description: 'Bans the member.',
				usage: 'ban <user> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to ban.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason for the ban.`,
				}),
			);
		const bannedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been banned from ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Banned At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setColor(12354762)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully banned, please contact an Admin.`,
			);
		const cantBanStaffEmbed = new Discord.MessageEmbed()
			.setDescription(
				`Sorry but you can't ban other staff members/staff members that has higher perms than you.`,
			)
			.setColor(12354762);
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
		if (
			args.member.roles.highest.position >=
			message.member.roles.highest.position
		)
			return message.channel.send(cantBanStaffEmbed);
		try {
			const banList = await message.guild.fetchBans();

			const bannedUser = banList.find((user) => user.id === args.member.id);

			if (bannedUser)
				return await message.channel.send(
					`${bannedUser.tag} is already banned!`,
				);
			else
				await args.member
					.ban({ reason: args.reason })
					.then(() => {
						message.channel
							.send(
								new Discord.MessageEmbed({
									description: `${args.member} is successfully banned with the reason: ${args.reason}`,
								}),
							)
							.catch((err) => {
								message.channel.send(err.message);
							});
					})
					.catch((err) => {
						message.channel.send(
							new Discord.MessageEmbed({
								description: `There was an error occurred while trying to ban ${args.member}.\n**Error**: \`${err.message}\``,
							}),
						);
					});

			args.member.send(bannedToDMEmbed).catch((err) => {
				return;
			});
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = BanCommand;
