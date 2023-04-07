const { 
    SlashCommandBuilder, 
    EmbedBuilder 
  } = require('discord.js');
  
  module.exports = {
      data: new SlashCommandBuilder()
          .setName('lockdown')
          .setDescription('Закрывает канал для определенной роли.')
          .addRoleOption(option =>
              option.setName('role')
                  .setDescription('Выберите роль.')
                  .setRequired(true))
          .addBooleanOption(option =>
              option.setName('value')
                  .setDescription('Выберите канал который хотите закрыть.')
                  .setRequired(true)),
      async execute(interaction) {
          const role = interaction.options.getRole('role');
          const shouldLock = interaction.options.getBoolean('value');
  
          if (!interaction.member.permissions.has('ManageChannels') || !role || shouldLock === undefined) {
              return interaction.reply('У вас нет прав).');
          }
  
          await interaction.channel.permissionOverwrites.edit(role, {
              SendMessages: shouldLock ? false : true,
          });
  
          const embed = new EmbedBuilder()
              .setDescription(`**${shouldLock ? 'Заблокирован' : 'Разблокирован'}** канал ${interaction.channel} для роли ${role}`)
              .setColor("Blue");
  
          await interaction.reply({ embeds: [embed] });
      },
  };