const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PollCommand extends Command {
  constructor() {
    super('poll', {
      aliases: ['poll'],
      description: { description: 'Create a poll.', usage: 'poll <question>' },
      ownerOnly: false,
      category: 'Moderation',
      args: [{ id: 'question', type: 'string', match: 'rest' }],
    });
  }

  async exec(message, args) {
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
    if (!args.question)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `\`\`\`\n${
            prefix + this.id
          } <question>\n      ^^^^^^^^^^\nquestion is a required argument that is missing.\`\`\``,
        })
      );

    message.delete();

    message.channel
      .send(
        new MessageEmbed({
          description: `**${message.author.username}** asks:\n${args.question}`,
        })
      )
      .then(async (m) => {
        await m.react('832988077013729370');
        await m.react('832988076925779978');
      });
  }
}

module.exports = PollCommand;
