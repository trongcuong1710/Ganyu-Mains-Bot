const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const paginationEmbed = require('discord.js-pagination');

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      description: {
        usage: 'help',
        description: 'Summons the help menu or shows info about a command.',
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
        },
      ],
    });
  }

  async exec(message, args) {
    if (!args.command)
      return message.channel.send(
        new Discord.MessageEmbed({
          description: `Help command has been removed.`,
        })
      );

    const helpCmdWithoutAliasesEmbed = new Discord.MessageEmbed()
      .addFields(
        {
          name: `\`${args.command.id}\``,
          value: `${args.command.description.description}`,
        },
        {
          name: 'Usage',
          value: `\`${
            this.client.commandHandler.prefix + args.command.description.usage
          }\``,
        }
      )
      .setFooter(`Category: ${args.command.categoryID}`);

    if (args.command.aliases == args.command.id)
      return message.channel.send(helpCmdWithoutAliasesEmbed);

    const helpCmdWithAliasesEmbed = new Discord.MessageEmbed()
      .addFields(
        {
          name: `\`${args.command}\` **/** \`${args.command.aliases[1]}\``,
          value: `${args.command.description.description}`,
        },
        {
          name: 'Usage',
          value: `\`${
            this.client.commandHandler.prefix + args.command.description.usage
          }\``,
        }
      )
      .setFooter(`Category: ${args.command.categoryID}`);

    if (args.command.aliases)
      return message.channel.send(helpCmdWithAliasesEmbed);
  }
}

module.exports = HelpCommand;
