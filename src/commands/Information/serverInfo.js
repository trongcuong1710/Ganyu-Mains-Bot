const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ServerInfoCommand extends Command {
	constructor() {
		super('serverinfo', {
			aliases: ['serverinfo', 'sinfo', 'si'],
			ownerOnly: false,
			category: 'Info',
			description: {
				description: 'Sends information about the server.',
				usage: 'serverinfo',
			},
			channel: 'guild',
		});
	}

	exec(message) {
		function checkDays(date) {
			let now = new Date();
			let diff = now.getTime() - date.getTime();
			let days = Math.floor(diff / 86400000);
			return days + (days == 1 ? ' day' : ' days') + ' ago';
		}
		let region = {
			brazil: ':flag_br: Brazil',
			europe: ':flag_eu: Central Europe',
			singapore: ':flag_sg: Singapore',
			'us-central': ':flag_us: U.S. Central',
			sydney: ':flag_au: Sydney',
			'us-east': ':flag_us: U.S. East',
			'us-south': ':flag_us: U.S. South',
			'us-west': ':flag_us: U.S. West',
			'eu-west': ':flag_eu: Western Europe',
			'vip-us-east': ':flag_us: VIP U.S. East',
			london: ':flag_gb: London',
			amsterdam: ':flag_nl: Amsterdam',
			hongkong: ':flag_hk: Hong Kong',
			russia: ':flag_ru: Russia',
			southafrica: ':flag_za:  South Africa',
		};
		const serverInfoEmbed = new Discord.MessageEmbed()
			.setAuthor(
				message.guild.name,
				message.guild.iconURL({ dynamic: true, size: 256 }),
			)
			.addField('Name', message.guild.name, false)
			.addField('ID', message.guild.id, false)
			.addField('Owner', message.guild.owner, false)
			.addField('Region', region[message.guild.region], false)
			.addField(
				'Total | Humans | Bots',
				`${message.guild.members.cache.size} | ${
					message.guild.members.cache.filter((member) => !member.user.bot).size
				} | ${
					message.guild.members.cache.filter((member) => member.user.bot).size
				}`,
				false,
			)
			.addField('Emoji Count', `${message.guild.emojis.cache.size}`)
			.addField('Verification Level', message.guild.verificationLevel, false)
			.addField('Channels', message.guild.channels.cache.size, false)
			.addField('Roles', message.guild.roles.cache.size, false)
			.addField(
				'Creation Date',
				`${message.channel.guild.createdAt
					.toUTCString()
					.substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})`,
				false,
			)
			.setThumbnail(message.guild.iconURL({ dynamic: false }));
		message.channel.send(serverInfoEmbed);
	}
}

module.exports = ServerInfoCommand;
