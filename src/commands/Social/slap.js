const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class SlapCommand extends Command {
	constructor() {
		super('slap', {
			aliases: ['slap'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a slap image/gif.',
				usage: 'slap',
			},
		});
	}

	async exec(message) {
		let data = await random.getAnimeImgURL('slap');
		message.channel.send(data);
	}
}

module.exports = SlapCommand;
