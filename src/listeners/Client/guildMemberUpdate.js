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
    const nitroBoosterRole = global.guild.roles.cache.get(
      roles.nitroBoosterRole
    );

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

    if (!notBoosting && isBoosting) {
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
