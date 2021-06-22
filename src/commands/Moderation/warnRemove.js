const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class RemoveWarnCommand extends Command {
  constructor() {
    super('removewarn', {
      aliases: ['removewarn', 'rw'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
        {
          id: 'warnID',
          type: 'string',
        },
      ],
      description: {
        description: "Remove a member's warn.",
        usage: 'removewarn <member> <warn ID>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <warnID>\n            ^^^^^^^^\nmember is a required argument that is missing.\`\`\``,
        })
      );
    if (!args.warnID)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <member> <warnID>\n                     ^^^^^^^^\nwarnID is a required argument that is missing.\`\`\``,
        })
      );

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

    const warnReasonWas = await this.client.db.warns.find({
      warnID: args.warnID,
    });
    await this.client.db.warns
      .deleteOne({ warnID: args.warnID })
      .then(async (c) => {
        await message.channel.send(
          new MessageEmbed({
            color: 'GREEN',
            description: `Removed **${args.warnID}** from ${args.member.user.tag}'s warns.`,
          })
        );
        await this.client.channels.cache
          .get(channels.punishmentLogsChannel)
          .send(
            new MessageEmbed({
              color: 'RED',
              title: `Member Warn Removed`,
              description: `**Offender**: ${
                args.member.user.tag
              }\n**Responsible Staff**: ${
                message.author.tag
              }\n**Reason Was**: ${warnReasonWas
                .map((x) => x.reason)
                .join('\n')}`,
              footer: { text: `ID: ${args.member.id}` },
              timestamp: new Date(),
            })
          );
      });
  }
}

module.exports = RemoveWarnCommand;
