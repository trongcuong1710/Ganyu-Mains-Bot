const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

class AddRoleCommand extends Command {
	constructor() {
		super('addrole', {
			aliases: ['addrole', 'ar'],
			category: 'Moderation',
			clientPermissions: ['MANAGE_ROLES'],
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'role',
					type: 'role',
				},
			],
			description: {
				description: 'Adds given role to a member.',
				usage: 'addrole <user> <role>',
			},
		});
	}

	async exec(message, args) {
		if (!args.member)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a user to add a role.`,
				}),
			);
		if (!args.role)
			return message.channel.send(
				new Discord.MessageEmbed({
					description: `Please supply a role to add to the user.`,
				}),
			);
		const permRoles = [
			'803065968426352640', // Qixing Secretary
			'795102781346021376', // Head Admin
			'786025543124123698', // Server Admin
			'786025543124123699', // Network Admin
			'786025543085981705', // Moderator
		];
		var i;
		for (i = 0; i <= permRoles.length; i++) {
			if (
				message.member.roles.cache
					.map((x) => x.id)
					.filter((x) => permRoles.includes(x)).length === 0
			)
				return message.channel.send(
					new Discord.MessageEmbed().setDescription(
						"You can't do that with the permissions you have.",
					),
				);
		}
		try {
			if (!args.member.roles.cache.some((r) => r.id === args.role.id)) {
				await args.member.roles.add(args.role.id).then(async () => {
					message.channel.send(
						new Discord.MessageEmbed({
							description: `Successfully added ${args.role} to ${args.member}!`,
						}),
					);
				});
			} else {
				return message.channel.send(
					new Discord.MessageEmbed({
						description: `${args.member} already has ${args.role}!`,
					}),
				);
			}
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = AddRoleCommand;
