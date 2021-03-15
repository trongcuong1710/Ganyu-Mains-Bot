const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const api = require('random-stuff-api');

class DankMemeCommand extends Command {
	constructor() {
		super('dankmeme', {
			aliases: ['dankmeme', 'dm'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a dankmeme image/gif.',
				usage: 'dankmeme',
			},
		});
	}

	async exec(message) {
		await message.channel.send(await api.image.dankmeme());
	}
}

module.exports = DankMemeCommand;
