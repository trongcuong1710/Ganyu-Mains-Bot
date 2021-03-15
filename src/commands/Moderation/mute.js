const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');

class MuteCommand extends Command {
	constructor() {
		super('mute', {
			aliases: ['mute', 'm'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES', 'MUTE_MEMBERS'],
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'duration',
					type: 'string',
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
				},
			],
			description: {
				description: 'Mutes the member for a given duration.',
				usage: 'mute <user> <duration> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to mute.`,
				}),
			);
		if (!args.duration)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a duration to mute.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason for the mute.`,
				}),
			);
		const muteRole = message.guild.roles.cache.get('786045122679668758');
		const mutedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been muted in ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Muted At:** ${moment().format(
					'MMMM Do, hh:mm:ss a',
				)}\n**Duration:** ${ms(ms(args.duration), { long: true })}`,
			)

			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully muted, please contact an Admin.`,
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
			await args.member.roles
				.add(muteRole.id)
				.then(() =>
					message.channel.send(
						new Discord.MessageEmbed({
							description: `${args.member} is now muted for ${ms(
								ms(args.duration),
								{ long: true },
							)}`,
						}),
					),
				)
				.catch((err) => {
					message.channel.send(
						new Discord.MessageEmbed().setDescription(
							`There was an error occurred while trying to mute ${args.member}.\n**Error:** ${err.message}`,
						),
					);
				});
			await setTimeout(async () => {
				await args.member.roles
					.remove(muteRole.id)
					.catch((err) => {
						message.channel.send(
							new Discord.MessageEmbed().setDescription(
								`There was an error occurred while trying to unmute ${args.member}.\n**Error:** ${err.message}`,
							),
						);
					})
					.then(() => {
						message.channel.send(
							new Discord.MessageEmbed({
								description: `${args.member} is now unmuted.`,
							}),
						);
					});
			}, ms(args.duration));
		} catch (err) {
			console.log(err);
		}
		args.member
			.send(mutedToDMEmbed)
			.catch(async (err) =>
				message.channel.send(
					new Discord.MessageEmbed().setDescription(
						`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
					),
				),
			);
	}
}

module.exports = MuteCommand;
