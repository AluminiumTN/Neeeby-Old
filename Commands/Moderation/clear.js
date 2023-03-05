const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder} = require(`discord.js`);

module.exports ={
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Удалить специфические сообщения пользователя с определенного канала.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName(`amount`)
        .setDescription(`Количество сообщений которых нужно удалить`)
        .setRequired(true)
        )
    .addUserOption(option =>
        option.setName(`target`)
        .setDescription(`Выберите пользователя для того чтобы удалить его сообщения.`)
        .setRequired(false)
        ),
    
    async execute(interaction) {
        const {channel, options} = interaction;

        const amount = options.getInteger(`amount`);
        const target = options.getUser("target");

        const messages = await channel.messages.fetch({
            limit: amount +1,
        });

        const res = new EmbedBuilder()
        .setColor(`#ff69b4`)

        if(target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Успешно удалены ${messages.size} сообщения от ${target}.`);
                interaction.reply({embeds: [res]});
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`Успешно удалены ${messages.size} сообщения с канала.`);
                interaction.reply({embeds: [res]});
            });
        }
    }

}