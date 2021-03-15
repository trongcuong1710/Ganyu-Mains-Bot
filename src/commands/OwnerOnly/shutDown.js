const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ShutDownCommand extends Command {
	constructor() {
		super('shutdown', {
			aliases: ['shutdown', 'shut'],
			ownerOnly: true,
			category: 'OwnerOnly',
			description: {
				description: 'Shuts down the bot.',
				usage: 'shutdown',
			},
		});
	}

	async exec(message) {
		const shutDownEmbed = new Discord.MessageEmbed().setDescription(
			'Bot is shutting down.\nRestart manually!',
		);
		await message.channel.send(shutDownEmbed).then(async () => {
			await process.exit(0);
		});
	}
}

module.exports = ShutDownCommand;
