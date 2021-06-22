const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BlacklistCommand extends Command {
  constructor() {
    super('blacklist', {
      aliases: ['blacklist'],
      category: 'Moderation',
      channel: 'guild',
      args: [
        {
          id: 'channel',
          type: (message, phrase) => {
            return this.client.util.resolveChannel(
              phrase,
              message.guild.channels.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Disables/Enables Ganyu in a given channel.',
        usage: 'blacklist <channel>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const roles = [
      '803065968426352640', // TDA's owner role
      '786025543124123698', // Admin
      '786025543085981705', // Mod
    ];
    var i;
    for (i = 0; i <= roles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => roles.includes(x)).length === 0
      )
        return message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    const prefix = this.client.commandHandler.prefix;

    if (!args.channel)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <channel>\n           ^^^^^^^^^\nchannel is a required argument that is missing.\`\`\``,
        })
      );

    if (
      !(await this.client.db.blacklists.findOne({
        channel_id: args.channel,
      }))
    ) {
      await this.client.db.blacklists
        .create({
          channel_id: args.channel,
          blacklistedBy: message.author,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is now blacklisted.`,
              footer: { text: `Use the command again to unblacklist.` },
            })
          );
          this.client.channels.cache.get(channels.databaseLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Channel Blacklist`,
              description: `**Channel**: ${args.channel}\n**Responsible Staff**: ${message.author.tag}`,
              footer: { text: `Channel ID: ${args.channel.id}` },
              timestamp: new Date(),
            })
          );
        });
    } else
      return await this.client.db.blacklists
        .findOneAndRemove({
          channel_id: args.channel,
        })
        .then(async () => {
          await message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is not blacklisted anymore.`,
              footer: { text: `Use the command again to blacklist.` },
            })
          );
          return await this.client.channels.cache
            .get(channels.databaseLogsChannel)
            .send(
              new Discord.MessageEmbed({
                color: 'RED',
                title: `Channel Unblacklist`,
                description: `**Channel**: ${args.channel}\n**Responsible Staff**: ${message.author.tag}`,
                footer: { text: `Channel ID: ${args.channel.id}` },
                timestamp: new Date(),
              })
            );
        });
  }
}

module.exports = BlacklistCommand;
