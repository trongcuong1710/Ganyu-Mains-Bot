const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');

class RemoveWarnCommand extends Command {
	constructor() {
		super('removewarn', {
			aliases: ['removewarn', 'rw'],
			ownerOnly: false,
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
				description: 'Warns a member and saving the warn in their warn list.',
				usage: 'warn <member> <reason>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a user to remove their warn.`,
				}),
			);
		if (!args.warnID)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a warnID to remove from the database.`,
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
		await this.client.db.warns
			.deleteOne({ warnID: args.warnID }, function (err) {
				if (err) return handleError(err);
			})
			.then(() => {
				message.channel.send(
					new Discord.MessageEmbed().setDescription(
						`**Warn ID: ${args.warnID}** is successfully removed from ${args.member}'s warn list.`,
					),
				);
			});
	}
}

module.exports = RemoveWarnCommand;
