const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const TOKEN = 'MTM3NTYwNTE2MDA5MjM2ODkxNg.GLGRYb.c0rum080bNgA7HICYUpkJ2Ww2V4T59eHJ589lc'; // Replace with your actual bot token
const BUTTON_CHANNEL_ID = '1375140214514913290'; // Channel with the start button
const REPORT_CHANNEL_ID = '1378456297644626081'; // Channel where apps are sent

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
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

// Track user progress
const userStates = new Map();

client.once(Events.ClientReady, async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const buttonChannel = await client.channels.fetch(BUTTON_CHANNEL_ID);
  if (!buttonChannel) return console.error('❌ Button channel not found');

  const startButton = new ButtonBuilder()
    .setCustomId('start_application')
    .setLabel('Start Whitelist Application')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('📝');

  const row = new ActionRowBuilder().addComponents(startButton);

  await buttonChannel.send({
    content: '🎯 Click the button below to start your whitelist application:',
    components: [row],
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'start_application') return;

  await interaction.deferReply({ ephemeral: true });

  try {
    userStates.set(interaction.user.id, { step: 0, answers: [] });

    const dm = await interaction.user.createDM();

    await dm.send({
      embeds: [
        {
          color: 0x00b0f4,
          title: `❓ Question 1/${questions.length}`,
          description: questions[0],
          thumbnail: {
            url: 'https://media.discordapp.net/attachments/1374161651242111067/1374545184326549504/ChatGPT_Image_21_mai_2025_01_31_16.png?ex=684f65f5&is=684e1475&hm=9ade9ab306d36d2c8482db9a09ecae10744908fc4a363a58ce03b24c803fea72&=&format=webp&quality=lossless&width=960&height=960https://media.discordapp.net/attachments/1374161651242111067/1374545184326549504/ChatGPT_Image_21_mai_2025_01_31_16.png?ex=684f65f5&is=684e1475&hm=9ade9ab306d36d2c8482db9a09ecae10744908fc4a363a58ce03b24c803fea72&=&format=webp&quality=lossless&width=960&height=960',
          },
          footer: {
            text: '📋 Whitelist Application',
          },
        },
      ],
    });

    await interaction.editReply('✅ I have sent you a DM with the first question!');
  } catch (error) {
    console.error(error);
    await interaction.editReply('❌ Could not send you a DM. Please check your privacy settings.');
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 1) return; // 1 = DM

  const state = userStates.get(message.author.id);
  if (!state) return;

  state.answers[state.step] = message.content;
  state.step++;

  if (state.step < questions.length) {
    await message.channel.send({
      embeds: [
        {
          color: 0x00b0f4,
          title: `❓ Question ${state.step + 1}/${questions.length}`,
          description: questions[state.step],
          thumbnail: {
            url: 'https://media.discordapp.net/attachments/1374161651242111067/1374545184326549504/ChatGPT_Image_21_mai_2025_01_31_16.png?ex=684f65f5&is=684e1475&hm=9ade9ab306d36d2c8482db9a09ecae10744908fc4a363a58ce03b24c803fea72&=&format=webp&quality=lossless&width=960&height=960',
          },
          footer: {
            text: '📋 Whitelist Application',
          },
        },
      ],
    });
  } else {
    userStates.delete(message.author.id);

    await message.channel.send({
  embeds: [
    {
      color: 0x2ecc71,
      title: '✅ Application Submitted',
      description: `Thank you! Your whitelist application has been sent to the staff.\n\n🔊 You can now join the voice channel for a quick interview:\n<#1375138498910228500>`,
      footer: {
        text: '🎮 Good luck and have fun in the city!',
      },
    },
  ],
});


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
