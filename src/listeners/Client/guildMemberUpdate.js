const { Listener } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const roles = require('../../Constants/roles.json');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class GuildMemberUpdateListener extends Listener {
  constructor() {
    super('guildMemberUpdate', {
      emitter: 'client',
      event: 'guildMemberUpdate',
      category: 'Client',
    });
  }

  async exec(oldMember, newMember) {
    moment.locale('en');
    const memberLogsCH = global.guild.channels.cache.get(
      channels.memberLogsChannel
    );
    //? Nitro Booster
    //#region If nitro booster.
    var messages = [
      "That indulgent feeling of being spoilt by you... Thank you. I won't forget your kindness.",
      'I’m grateful that you’re always here and supporting us!',
      'Your support have thrilled me,and I’m overwhelmed with happiness. This encouragement is what keeps me going. Thank you for the support.',
      "Thank you; I appreciate everyone who has been a part of this. None of this could’ve been possible without your contribution. It's not like I like you... but all of you are valuable to me.",
    ];

    const nitroBoosterRole = global.guild.roles.cache.get(
      roles.nitroBoosterRole
    );

    var randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const notBoosting = oldMember.roles.cache.find(
      (role) => role.id === nitroBoosterRole.id
    );
    const isBoosting = newMember.roles.cache.find(
      (role) => role.id === nitroBoosterRole.id
    );

    const customRoles = await this.client.db.customRoles.find({
      roleOwner: newMember.id,
    });
    const role = global.guild.roles.cache.get(
      customRoles.map((x) => x.roleID).join('\n')
    );
    const prefix = this.client.commandHandler.prefix;

    const ganyuLove = new MessageAttachment(
      'https://cdn.discordapp.com/emojis/796906401908654140.png?v=1'
    );

    if (!notBoosting && isBoosting) {
      global.guild.channels.cache
        .get('876912695729877013') // boosts channel
        .send(`${newMember}, ${randomMessage}`, ganyuLove);
      newMember
        .send(
          new MessageEmbed({
            color: 'GREEN',
            title: 'You have unlocked a new perk by boosting the server!',
            description: `You can now have a custom role you desire!`,
            fields: [
              {
                name: `${prefix}myrole <role name>`,
                value: `Creates a custom role with the given name.`,
              },
              {
                name: `${prefix}myrole --name <new name>`,
                value: `Edits your role name.`,
                inline: true,
              },
              {
                name: `${prefix}myrole --color <new color>`,
                value: `Edits your role color.`,
                inline: true,
              },
            ],
          })
        )
        .catch(() => {
          // booster chat
          global.guild.channels.cache.get('807033733076484096').send(
            newMember,
            new MessageEmbed({
              color: 'GREEN',
              title: 'You have unlocked a new perk by boosting the server!',
              description: `You can now have a custom role you desire!`,
              fields: [
                {
                  name: `${prefix}myrole <role name>`,
                  value: `Creates a custom role with the given name.`,
                },
                {
                  name: `${prefix}myrole --name <new name>`,
                  value: `Edits your role name.`,
                  inline: true,
                },
                {
                  name: `${prefix}myrole --color <new color>`,
                  value: `Edits your role color.`,
                  inline: true,
                },
              ],
            })
          );
        });
    }

    if (!isBoosting && notBoosting) {
      newMember
        .send(
          new MessageEmbed({
            color: 'RED',
            description: `You lost your custom role due to expiration of your boost.`,
          })
        )
        .then(async () => {
          await this.client.db.customRoles.deleteOne({
            roleID: role.id,
          });
          if (!role) return;
          role.delete('No more a booster.');
        })
        .catch((e) => {
          return;
        });
    }
    //#endregion
  }
}

module.exports = GuildMemberUpdateListener;
