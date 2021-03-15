const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const api = require('random-stuff-api');

class DogCommand extends Command {
	constructor() {
		super('dog', {
			aliases: ['dog', 'woof', 'rawr'],
			channel: 'guild',
			cooldown: 60000,
			description: {
				description: 'Sends a dog image/gif.',
				usage: 'dog',
			},
		});
	}

	async exec(message) {
		await message.channel.send(await api.image.dog());
	}
}

module.exports = DogCommand;
