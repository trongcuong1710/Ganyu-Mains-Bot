const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const api = require('random-stuff-api');

class FacepalmCommand extends Command {
	constructor() {
		super('facepalm', {
			aliases: ['facepalm'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a facepalm moment image/gif.',
				usage: 'facepalm',
			},
		});
	}

	async exec(message) {
		await message.channel.send(await api.image.facepalm());
	}
}

module.exports = FacepalmCommand;
