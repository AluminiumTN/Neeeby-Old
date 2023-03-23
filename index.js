const { Client, GatewayIntentBits, Partials, Collection } = require(`discord.js`);

const {Guilds, GuildMembers, GuildMessages, GuildVoiceStates} = GatewayIntentBits;
const {User, Message,GuildMember, ThreadMember, Channel} = Partials;

const {loadEvents} = require(`./Handlers/eventHandler`);
const {loadCommands} = require(`./Handlers/commandHandler`);

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
    partials: [User, Message, GuildMember, ThreadMember],
});

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals

client.commands = new Collection();
client.voiceGenerator = new Collection();

require(`discord-modals`)(client)
client.config = require(`./config.json`);

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});

client.on("interactionCreate", (interaction) => {
    if(!interaction.isChatInputCommand()) return
 
        const command = client.commands.get(interaction.commandName)
 
        if(!command) {
            interaction.reply({ content: "there isn't a command like that" })
        }
 
        command.execute(interaction, client)
});


