const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');

class WarnsCommand extends Command {
	constructor() {
		super('warns', {
			aliases: ['warns'],
			ownerOnly: true,
			category: 'Moderation',
			channel: 'guild',
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'warnID',
					type: 'string',
				},
			],
			description: {
				description: 'Shows list of warnings of a member.',
				usage: 'warns <member>',
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
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to view warnings.`,
				}),
			);
		const prefix = this.client.commandHandler.prefix;
		const warns = await this.client.db.warns.find({
			warnedMember: args.member.id,
		});
		if (!warns.length)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `${args.member} has no warnings, yet.`,
				}),
			);
		async function showMemberWarnings() {
			return message.channel.send(
				new Discord.MessageEmbed({
					description: warns.map((x) => `**Warn ID**: ${x.warnID}`).join('\n'),
					footer: {
						text: `Use ${prefix}removewarn <warnID> to remove the warn.`,
					},
				}),
			);
		}
		if (!args.warnID) return showMemberWarnings();
		const warnOfID = await this.client.db.warns.find({
			warnID: args.warnID,
		});
		async function showWarnOfID() {
			return message.channel.send(
				new Discord.MessageEmbed({
					description: warnOfID
						.map(
							(x) =>
								`**Warn ID**: ${x.warnID}\n**Moderator**: ${
									x.warnedStaff
								}\n**Reason**: ${x.reason}\n**Date & Time**: ${moment(
									x.when,
								).format('LLLL')}`,
						)
						.join('\n'),
					footer: {
						text: `Use ${prefix}removewarn <warnID> to remove the warn.`,
					},
				}),
			);
		}
		showWarnOfID();
	}
}

module.exports = WarnsCommand;
