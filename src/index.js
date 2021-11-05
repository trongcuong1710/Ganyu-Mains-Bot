const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');

require('dotenv').config();

const mongoose = require('mongoose');

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '488699894023061516',
      },
      {
        disableMentions: 'none',
        fetchAllMembers: true,
        partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
        presence: {
          activity: {
            name: `DM g!ticket for help!`,
            type: 'PLAYING',
          },
          status: 'idle',
          afk: false,
        },
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands',
      prefix: 'g!',
      automateCategories: true,
      allowMention: true,
      blockBots: true,
      blockClient: true,
    });
    this.commandHandler.handle = async function (message) {
      // if (message.author.id != this.client.ownerID) return;
      if (
        !(await this.client.db.blacklists.findOne({
          channel_id: message.channel,
        }))
      )
        return CommandHandler.prototype.handle.call(this, message);
    };
    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners/',
      automateCategories: true,
    });
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    mongoose
      .connect(`${process.env.MONGOOSE_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('Connected to the database!'));

    this.db = {
      warns: mongoose.model(
        'warns',
        new mongoose.Schema({
          warnID: Number,
          warnedStaff: String,
          warnedMember: String,
          reason: String,
          when: Date,
        }),

        'warns'
      ),
      quotes: mongoose.model(
        'quotes',
        new mongoose.Schema({
          quoteName: String,
          quote: String,
          by: String,
          embed: Boolean,
        }),
        'quotes'
      ),
      blacklists: mongoose.model(
        'blacklists',
        new mongoose.Schema({
          channel_id: String,
          blacklistedBy: String,
        }),
        'blacklists'
      ),
      ignoreList: mongoose.model(
        'ignoreList',
        new mongoose.Schema({
          member_id: String,
          ignoredBy: String,
        }),
        'ignoreList'
      ),
      customRoles: mongoose.model(
        'customRoles',
        new mongoose.Schema({
          roleID: String,
          roleOwner: String,
        }),
        'customRoles'
      ),
      modmail: mongoose.model(
        'modmail',
        new mongoose.Schema({
          channel_id: String,
          member_id: String,
        }),
        'modmail'
      ),
      mutes: mongoose.model(
        'mutes',
        new mongoose.Schema({
          member_id: String,
          responsibleStaff: String,
          reason: String,
          unmuteDate: Number,
        }),
        'mutes'
      ),
    };
  }
}

const client = new MyClient();
client.login();
