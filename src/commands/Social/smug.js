const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class SmugCommand extends Command {
	constructor() {
		super('smug', {
			aliases: ['smug'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a smug image/gif.',
				usage: 'smug',
			},
		});
	}

	async exec(message) {
		let data = await random.getAnimeImgURL('smug');
		message.channel.send(data);
	}
}

module.exports = SmugCommand;
