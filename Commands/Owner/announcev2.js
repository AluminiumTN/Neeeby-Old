// идите нахуй я не умею писать модалки сука
const { SlashCommandBuilder, EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announcev2")
        .setDescription("Обьявления")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('role').setDescription('Роль для пинга').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Изображение (ссылка)').setRequired(false)),

    async execute(interaction) {
        const { options, user } = interaction;

        const role = options.getRole('role');
        const image = options.getString('image') || null;

        let Modal = new ModalBuilder()
            .setCustomId('report')
            .setTitle('Создание объявления')

        let question1 = new TextInputBuilder()
            .setCustomId('title')
            .setLabel('Заголовок')
            .setRequired(false)
            .setPlaceholder('ну тип о чем да ')
            .setStyle(TextInputStyle.Short)

        let question2 = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("Описание")
            .setRequired(true)
            .setPlaceholder('Ну типо описание')
            .setStyle(TextInputStyle.Paragraph)

        let question3 = new TextInputBuilder()
            .setCustomId('color')
            .setLabel('Цвет')
            .setRequired(false)
            .setPlaceholder('Цвет этой хуйни слева : #3dffcc (необязательно)')
            .setStyle(TextInputStyle.Short)

        let question4 = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel('Маленькая строка ?')
            .setRequired(false)
            .setPlaceholder('Пиши сюда епта (необязательно)')
            .setStyle(TextInputStyle.Short)

        let question5 = new TextInputBuilder()
            .setCustomId('timestamp')
            .setLabel('Задать промежуток времени ?')
            .setRequired(false)
            .setPlaceholder('yes/no')
            .setStyle(TextInputStyle.Short)

        let ActionRow1 = new ActionRowBuilder().addComponents(question1);
        let ActionRow2 = new ActionRowBuilder().addComponents(question2);
        let ActionRow3 = new ActionRowBuilder().addComponents(question3);
        let ActionRow4 = new ActionRowBuilder().addComponents(question4);
        let ActionRow5 = new ActionRowBuilder().addComponents(question5);

        Modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4, ActionRow5)

        await interaction.showModal(Modal)

        try {

            let reponse = await interaction.awaitModalSubmit({ time: 300000 })

            let title = reponse.fields.getTextInputValue('title')
            let description = reponse.fields.getTextInputValue('description')
            let color = reponse.fields.getTextInputValue('color')
            let footer = reponse.fields.getTextInputValue('footer')
            let timestamp = reponse.fields.getTextInputValue('timestamp')

            const Embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`**Создано успешно**`)

            if (!color) color = "Blue"
            if (!footer) footer = ' '
            if (!title) title = ' '
            if (!description) description = ' '

            let Embed1 = new EmbedBuilder()
                .setColor(`${color}`)
                .setTitle(`${title}`)
                .setDescription(`${description}`)
                .setFooter({ text: `${footer}` })
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({dynamic: true})})
                .setImage(image)

            if (reponse.fields.getTextInputValue('timestamp') === 'yes') Embed1.setTimestamp()
            if (!reponse.fields.getTextInputValue('timestamp') === 'yes') return;

            await interaction.channel.send({ embeds: [Embed1], content: `${role}` })

            await reponse.reply({ embeds: [Embed], ephemeral: true })


        } catch (err) { return; }
    }
}