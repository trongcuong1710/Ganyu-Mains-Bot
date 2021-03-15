const { Command } = require('discord-akairo');
const { Guild } = require('discord.js');
const Discord = require('discord.js');

class CreateInviteCommand extends Command {
	constructor() {
		super('createinvite', {
			aliases: ['createinvite', 'invite', 'inv'],
			ownerOnly: false,
			category: 'Server',
			channel: 'guild',
			cooldown: 10000,
			description: {
				description: 'Creates invite for the server and sends it.',
				usage: 'createinvite or inv',
			},
		});
	}

	exec(message) {
		const checkPermsEmbed = new Discord.MessageEmbed().setDescription(
			"Apparently you can't create invite.",
		);
		if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
			return message.channel.send(checkPermsEmbed);
		if (!message.guild.vanityURLCode)
			return message.channel
				.createInvite()
				.then((invite) =>
					message.channel.send(`https://discord.gg/${invite.code}`),
				)
				.catch(console.error);
		return message.channel
			.createInvite()
			.then(() =>
				message.channel.send(
					`https://discord.gg/${message.guild.vanityURLCode}`,
				),
			)
			.catch(console.error);
	}
}

module.exports = CreateInviteCommand;
