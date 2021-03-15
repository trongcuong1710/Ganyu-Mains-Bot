const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { Random } = require('random-discord');
const random = new Random();

class PunchCommand extends Command {
	constructor() {
		super('punch', {
			aliases: ['punch'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a punch image/gif.',
				usage: 'punch',
			},
		});
	}

	async exec(message) {
		let data = await random.getAnimeImgURL('punch');
		message.channel.send(data);
	}
}

module.exports = PunchCommand;
