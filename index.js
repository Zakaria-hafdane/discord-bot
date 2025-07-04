const fs = require('fs');
const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require('discord.js');

const TOKEN = 'put your bot token here';
const BUTTON_CHANNEL_ID = '1375140214514913290';
const REPORT_CHANNEL_ID = '1378456297644626081';
const VC_LINK = 'https://discord.com/channels/1374511524273459250/1375138498910228500';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const questions = [
  '🧑 What is your real name?',
  '🎂 What is your real age?',
  '🕵️ What is your RP name?',
  '📅 What is your RP age?',
  '🔗 Please provide your Steam profile link.',
  '⚖️ Is your RP legal or illegal?',
  '🎮 What experience do you have in RP?',
];

const userStates = new Map();
let buttonSent = false; // Track if the button has been sent

// Load user states from the file when the bot starts
function loadUserStates() {
  if (fs.existsSync('userStates.json')) {
    const data = fs.readFileSync('userStates.json');
    const states = JSON.parse(data);
    states.forEach(([userId, state]) => {
      userStates.set(userId, state);
    });
  }
}

// Save user states to the file
function saveUserStates() {
  fs.writeFileSync('userStates.json', JSON.stringify([...userStates]));
}

// Load user states on bot start
loadUserStates();

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const buttonChannel = await client.channels.fetch(BUTTON_CHANNEL_ID);
  if (!buttonChannel) return console.error('Button channel not found');

  // Only send the button if it has not been sent before
  if (!buttonSent) {
    const startButton = new ButtonBuilder()
      .setCustomId('start_application')
      .setLabel('Start Whitelist Application')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(startButton);

    await buttonChannel.send({
      content: 'Click the button below to start your whitelist application.',
      components: [row],
      files: ['./logo.png'],
    });

    // Mark the button as sent
    buttonSent = true;
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    // Start the application interaction
    if (interaction.customId === 'start_application') {
      await interaction.deferReply({ flags: 64 }); // Defer the reply

      const dm = await interaction.user.createDM();

      const welcomeEmbed = new EmbedBuilder()
        .setTitle('🎉 Welcome to X-LIFE RP Whitelist')
        .setDescription(
          `You’re about to start your **whitelist application** for X-LIFE RP.\n\n` +
          `✅ Click **Apply** to begin.\n` +
          `❌ Click **Cancel** to exit.\n\n` +
          `🧠 *Make sure your answers reflect good RP knowledge and maturity.*\n` +
          `💬 *All responses must be written in clear and understandable English or Arabic.*`
        )
        .setImage('attachment://logo.png')
        .setColor('Red');

      const applyButton = new ButtonBuilder()
        .setCustomId('apply')
        .setLabel('Apply')
        .setStyle(ButtonStyle.Success);

      const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger);

      const welcomeRow = new ActionRowBuilder().addComponents(applyButton, cancelButton);

      await dm.send({
        embeds: [welcomeEmbed],
        components: [welcomeRow],
        files: ['./logo.png'],
      });

      await interaction.editReply('✅ I have sent you a DM with instructions.');
    }

    // Handle 'apply' button interaction
    else if (interaction.customId === 'apply') {
      const userId = interaction.user.id;

      // Make sure that the user hasn't already started the application process
      if (!userStates.has(userId)) {
        userStates.set(userId, { step: 0, answers: [] });
      }

      const state = userStates.get(userId);

      // Send the first question
      const embed = new EmbedBuilder()
        .setTitle(`❓ Whitelist Application - Question 1/${questions.length}`)
        .setDescription(
          `**${questions[0]}**\n\n` +
          `💡 *Take your time to answer thoughtfully.*\n` +
          `📌 *Once you reply, you can’t go back to edit it.*`
        )
        .setThumbnail('attachment://logo.png')
        .setColor('Blue')
        .setFooter({ text: '📝 X-LIFE RP | Serious RP Only' });

      await interaction.reply({ embeds: [embed], files: ['./logo.png'] });
    }

    // Handle 'cancel' button interaction
    else if (interaction.customId === 'cancel') {
      await interaction.reply({ content: '❌ Application cancelled.', ephemeral: true });
    }

  } catch (error) {
    console.error('Error handling interaction:', error);
    if (interaction.deferred) {
      await interaction.editReply('❌ There was an error processing your request.');
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return; // DMs only

  const state = userStates.get(message.author.id);
  if (!state) return;

  // Save the user's answer
  state.answers[state.step] = message.content;
  state.step++;

  // Only send the next question if the user hasn't completed all questions
  if (state.step < questions.length) {
    const embed = new EmbedBuilder()
      .setTitle(`❓ Whitelist Application - Question ${state.step + 1}/${questions.length}`)
      .setDescription(
        `**${questions[state.step]}**\n\n` +
        `💡 *Take your time to answer thoughtfully.*\n` +
        `📌 *Once you reply, you can’t go back to edit it.*`
      )
      .setThumbnail('attachment://logo.png')
      .setColor('Blue')
      .setFooter({ text: '📝 X-LIFE RP | Serious RP Only' });

    await message.channel.send({ embeds: [embed], files: ['./logo.png'] });
  } else {
    // If all questions are answered, process the responses
    userStates.delete(message.author.id);

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Application Submitted!')
          .setDescription(
            `🎉 **Thank you for applying to X-LIFE RP!**\n\n` +
            `🕵️‍♂️ Our team will review your answers shortly.\n\n` +
            `🔊 While you wait, feel free to join our VC to meet the community:\n[Join VC](${VC_LINK})\n\n` +
            `⚠️ **Important:** Avoid spamming staff or DMs about your status.`
          )
          .setColor('Green')
          .setThumbnail('attachment://logo.png')
      ],
      files: ['./logo.png']
    });

    const compiled = questions
      .map((q, i) => `**${q}**\n${state.answers[i]}`)
      .join('\n\n');

    const reportChannel = await client.channels.fetch(REPORT_CHANNEL_ID);
    if (!reportChannel) return;

    await reportChannel.send({
      content: `📩 New Whitelist Application from <@${message.author.id}>:\n\n${compiled}`,
    });
  }
});

// Save the user states periodically
setInterval(saveUserStates, 60000); // Save every minute

client.login(TOKEN);
