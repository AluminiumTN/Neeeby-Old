const { ActionRowBuilder } = require('@discordjs/builders');
const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandAttachmentOption} = require('discord.js')
const SuggestionSchema = require('../../Models/suggestion')
const suggestionSetup = require('../../Models/suggestionSetup')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Делает предложение по вашему выбору и отправляет его в канал предложений!')
    .addStringOption(option => 
        option.setName('description')
        .setDescription('Каково ваше предложение?')
        .setRequired(true)
    ),

    async execute(interaction) {
        const {options, guildId, member, user, guild} = interaction;

        const description = options.getString('description')

        const embed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
        .addFields(
            {name: 'Предложение:', value: description, inline: false},
            {name: 'Статус:', value: 'Ожидает ответа...', inline: false},
        )
        .setTimestamp();

        const errEmbed = new EmbedBuilder()
        .setColor('#ff69b4')
        .setDescription("На этом сервере не настроены предложения!")

        const embedd = new EmbedBuilder()
        .setColor('#ff69b4')
        .setDescription('Предложение успешно отправлено в канал предложений!')

        suggestionSetup.findOne({GuildId: interaction.guild.id}, async (err, data) => {
            if (err) throw err;

            if (!data) {
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            if (data) {
                const suggestionChannel = interaction.guild.channels.cache.get(data.ChannelId);

                const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('suggest-accept').setLabel('Принять').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('suggest-decline').setLabel('Отклонить').setStyle(ButtonStyle.Danger),
                );
        
                try {
                    const m = await suggestionChannel.send({embeds: [embed], components: [buttons], fetchReply: true});
                    await interaction.reply({embeds: [embedd], ephemeral: true})
        
                    SuggestionSchema.create({
                        GuildId: guildId, MessageId: m.id, Details: [
                            {
                                MemberID: member.id,
                                Suggestion: description
                            }
                        ]
                    });
        
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }
}
