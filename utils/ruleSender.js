// utils/ruleSender.js
const { EmbedBuilder } = require('discord.js');

function chunkText(text, max = 4000) {
    const chunks = [];
    let current = '';
    for (const line of text.split('\n')) {
        if ((current + '\n' + line).length > max) {
            chunks.push(current);
            current = line;
        } else {
            current += '\n' + line;
        }
    }
    if (current) chunks.push(current);
    return chunks;
}

async function sendRuleText(channel, title, text) {
    const chunks = chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
        const embed = new EmbedBuilder()
            .setTitle(`${title} ${chunks.length > 1 ? `(Page ${i + 1})` : ''}`)
            .setDescription(chunks[i])
            .setColor('DarkBlue');
        await channel.send({ embeds: [embed] });
    }
}

module.exports = { sendRuleText };
