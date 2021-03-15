const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');

class WarnCommand extends Command {
	constructor() {
		super('warn', {
			aliases: ['warn', 'w'],
			ownerOnly: false,
			category: 'Moderation',
			clientPermissions: 'KICK_MEMBERS',
			channel: 'guild',
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
				description: 'Warns a member and saving the warn in their warn list.',
				usage: 'warn <member> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a user to warn.`,
				}),
			);
		if (!args.reason)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a reason to add into the database.`,
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
		const warnedToDMEmbed = new Discord.MessageEmbed()
			.setTitle(`You've been warned in ${message.guild.name}`)
			.setDescription(
				`**Moderator:** ${message.author.tag}\n**Reason:** ${
					args.reason
				}\n**Warned At:** ${moment().format('MMMM Do, hh:mm:ss a')}`,
			)
			.setThumbnail(args.member.user.displayAvatarURL({ dynamic: true }))
			.setFooter(
				`If you think you're wrongfully warned, please contact an Admin.`,
			);

		const warnedToChannelEmbed = new Discord.MessageEmbed().setDescription(
			`${args.member} is successfully warned for "${args.reason}".\nUse \`x!warns ${args.member.user.username}\` for details.`,
		);

		function getRandomIntInclusive(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
		}

		await this.client.db.warn
			.create({
				warnID: getRandomIntInclusive(1, 10000),
				warnedMember: args.member.id,
				warnedStaff: message.author.id,
				reason: args.reason,
				when: message.createdAt,
			})
			.then(() => message.channel.send(warnedToChannelEmbed))
			.then(() =>
				args.member
					.send(warnedToDMEmbed)
					.catch(async (err) =>
						message.channel.send(
							new Discord.MessageEmbed().setDescription(
								`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
							),
						),
					),
			)
			.catch((err) => {
				message.channel.send(
					new Discord.MessageEmbed({
						description: `An error occurred while trying to warn the user.\n**Error**: ${err.message}`,
					}),
				);
			});
	}
}

module.exports = WarnCommand;
