const {EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits} = require('discord.js')
const suggestionSetup = require('../../models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-suggest')
    .setDescription('Удаляет предложения с этого сервера!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
        .setColor('#ff69b4')

        suggestionSetup.findOne({GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [embed.setDescription(`Предложения не настроены на этом сервере!`)], ephemeral: true})
            }

            if (data) {
                interaction.reply({embeds: [embed.setDescription(`Успешно удалены предложения этого сервера!`)]})

                await suggestionSetup.findOneAndDelete({GuildId: interaction.guild.id, data})
            }
        })
    }
}