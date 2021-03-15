const { Listener } = require('discord-akairo');
const Discord = require('discord.js');

class GuildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd',
		});
	}
	exec(member) {
		const welcomeChannel = member.guild.channels.cache.get(
			'808150446689615903',
		);
		const welcomeEmbed = new Discord.MessageEmbed()
			.setColor(29128)
			.setTitle(`**Welcome to ${member.guild.name}!**`)
			.setDescription(
				`**Welcome to ${member.guild.name}, <@${member.user.id}>!\nMake sure to read <#786025543517601854>.**`,
			)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setImage(
				'https://cdn.discordapp.com/attachments/805893251042902047/808827618094350336/GanyuBanner20FPS.gif',
			);
		welcomeChannel.send(welcomeEmbed);
	}
}

module.exports = GuildMemberAddListener;
