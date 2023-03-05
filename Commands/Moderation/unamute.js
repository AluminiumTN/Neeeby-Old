const {Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const { execute } = require("./ban");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Размутить пользователя")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
        option.setName("target")
        .setDescription("Выберите пользователя которого хотите размутить")
        .setRequired(true)
        ),
        async execute(interaction) {
            const {guild, options} = interaction;
            const user = options.getUser("target");
            const member = guild.members.cache.get(user.id);

            const errEmbed = new EmbedBuilder()
            .setDescription(`Что-то пошло не так. Пожалуйста попробуйте позже`)
            .setColor(`#ff69b4`)

            const succesEmbed = new EmbedBuilder()
            .setTitle("**Размучен**")
            .setDescription(`${user} был размучен`)
            .setColor(`#ff69b4`)
            .setTimestamp();

            if  (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: false });

            try {
                await member.timeout(null);

                interaction.reply({ embeds: [succesEmbed], ephemeral: false});
            } catch (error) {
                console.log(error);
            }
        }
}