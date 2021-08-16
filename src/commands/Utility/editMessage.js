const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EditMessageCommand extends Command {
  constructor() {
    super('editmessage', {
      aliases: ['editmessage', 'em'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'messageID',
          type: 'guildMessage',
          match: 'phrase',
        },
        {
          id: 'newMessage',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Edits a message.',
        usage: 'editmessage <messageID> <new message>',
      },
    });
  }

  async exec(message, args) {
    const permRoles = [
      '803065968426352640', // TDA's owner role
      '786025543124123698', // Admin
      '786025543085981705', // Mod
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new MessageEmbed().setDescription(
            "You can't do that with the permissions you have."
          )
        );
    }

    if (!args.messageID)
      return message.channel.send(
        new MessageEmbed({
          description: `I can't find the message.`,
        })
      );
    if (!args.newMessage)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a message to replace the old one.`,
        })
      );

    if (args.messageID.partial) {
      await args.messageID
        .fetch()
        .then(async (fullMessage) => {
          await fullMessage.edit(args.newMessage).then(async () => {
            message.react('803731360296075344');
          });
        })
        .catch((error) => {
          message.channel.send(
            'Something went wrong when fetching the message: ',
            error
          );
        });
    } else {
      await args.messageID.edit(args.newMessage).then(async () => {
        message.react('803731360296075344');
      });
    }
  }
}

module.exports = EditMessageCommand;
