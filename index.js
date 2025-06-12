const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  Events 
} = require('discord.js');

const TOKEN = 'MTM3NTYwNTE2MDA5MjM2ODkxNg.GT8fUR.LwWBctTh6XKV9hZ9vka_Q-EdR_w5A3pHUvM-0E'; // Replace this with your bot token
const BUTTON_CHANNEL_ID = '1375140214514913290'; // Channel with the start button
const REPORT_CHANNEL_ID = '1378456297644626081'; // Channel where apps are sent

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel], // Needed to receive DMs
});

const questions = [
  'What is your real name?',
  'What is your real age?',
  'What is your RP name?',
  'What is your RP age?',
  'Please provide your Steam profile link.',
  'Is your RP legal or illegal?',
  'What experience do you have in RP?',
];

// Store user progress
const userStates = new Map();

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Send button message to the BUTTON channel once on startup
  const buttonChannel = await client.channels.fetch(BUTTON_CHANNEL_ID);
  if (!buttonChannel) return console.error('Button channel not found');

  const startButton = new ButtonBuilder()
    .setCustomId('start_application')
    .setLabel('Start Whitelist Application')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(startButton);

  await buttonChannel.send({
    content: 'Click the button below to start your whitelist application.',
    components: [row],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'start_application') return;

  await interaction.deferReply({ ephemeral: true });

  try {
    // Start tracking this user's application state
    userStates.set(interaction.user.id, { step: 0, answers: [] });

    // Create DM and send first question
    const dm = await interaction.user.createDM();
    await dm.send(questions[0]);

    await interaction.editReply('✅ I have sent you a DM with the first question!');
  } catch (error) {
    console.error(error);
    await interaction.editReply('❌ Could not send you a DM. Please check your privacy settings.');
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return; // DM only

  const state = userStates.get(message.author.id);
  if (!state) return;

  // Save answer
  state.answers[state.step] = message.content;
  state.step++;

  if (state.step < questions.length) {
    // Ask next question
    await message.channel.send(questions[state.step]);
  } else {
    // Done with all questions
    userStates.delete(message.author.id);

    await message.channel.send('✅ Thank you! Your application has been submitted.');

    // Send answers to REPORT channel
    const reportChannel = await client.channels.fetch(REPORT_CHANNEL_ID);
    if (!reportChannel) return;

    const compiled = questions
      .map((q, i) => `**${q}**\n${state.answers[i]}`)
      .join('\n\n');

    await reportChannel.send({
      content: `📩 New Whitelist Application from <@${message.author.id}>:\n\n${compiled}`,
    });
  }
});

client.login(TOKEN);
