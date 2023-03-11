const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Отправить объявление в определенный канал')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addChannelOption(option => option.setName('channel').setDescription('Канал в который вы хотите отправить обьявление').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Роль для пинга').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Заголовок').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Содержание обьявления').setRequired(true))
        .addStringOption(option => option.setName('colour').setDescription('Цвет (необязательно)').setRequired(false))
        .addStringOption(option => option.setName('image').setDescription('Изображение (ссылка)').setRequired(false)),
    async execute(interaction) {
        const { options, user } = interaction;

        const channel = options.getChannel('channel');
        const role = options.getRole('role');
        const title = options.getString('title');
        const message = options.getString('message');
        const colour = options.getString('colour') || "DarkButNotBlack";
        const image = options.getString('image') || null;

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setColor(`${colour}`)
            .setDescription(`${message}`)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
            .setImage(image)

        await channel.send({ embeds: [embed], content: `${role}` })
        await interaction.reply({ content: `Обьявление отправлено в  ${channel}`, ephemeral: true})
    }
}