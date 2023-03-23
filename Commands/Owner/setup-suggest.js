const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType} = require('discord.js')
const suggestionSetup = require('../../models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup-suggest')
    .setDescription('Настраивает предложения для этого сервера!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('На каком канале вы хотите настроить предложения?')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options, channel} = interaction;

        const embed = new EmbedBuilder()
        .setColor('#ff69b4');

        const suggestChannel = options.getChannel('channel')

        suggestionSetup.findOne({ GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                
                interaction.reply({embeds: [embed.setDescription(`Успешно настройте предложения этого сервера!`)]})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: suggestChannel.id
                })
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`Успешно настройте предложения этого сервера!`)]})

                await suggestionSetup.findOneAndDelete({GuildId: interaction.guild.id, data})

                suggestionSetup.create({
                    GuildId: interaction.guild.id,
                    ChannelId: suggestChannel.id
                })
            }
        })
    }
}