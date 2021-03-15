const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class UnmuteCommand extends Command {
	constructor() {
		super('unmute', {
			aliases: ['unmute', 'um'],
			ownerOnly: false,
			category: 'Moderation',
			channel: 'guild',
			clientPermissions: 'MANAGE_ROLES',
			args: [
				{
					id: 'member',
					type: 'member',
				},
			],
			description: {
				description: 'Unmutes the member.',
				usage: 'unmute <member>',
			},
		});
	}

	async exec(message, args) {
		const muteRole = message.guild.roles.cache.get('786045122679668758');
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a member to unmute.`,
				}),
			);
		args.member.timeout = message.client.setTimeout(async () => {
			try {
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
				await args.member.roles.remove(muteRole.id);
				args.member
					.send(
						new Discord.MessageEmbed({
							description: `You are now unmuted in ${message.guild.name}.\n**Moderator**: ${message.author}`,
						}),
					)
					.catch(async (err) =>
						message.channel.send(
							new Discord.MessageEmbed().setDescription(
								`${args.member}'s DMs are closed, therefore I could not DM them about this.`,
							),
						),
					);
				message.channel.send(
					new Discord.MessageEmbed({
						description: `${args.member} is now unmuted.`,
					}),
				);
			} catch (err) {
				console.log(err);
			}
		});
	}
}

module.exports = UnmuteCommand;
