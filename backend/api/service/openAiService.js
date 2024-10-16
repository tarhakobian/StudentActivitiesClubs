/** Author: Andre Matevosyan */
const openai = require('../../openAiConfigonfig/')


async function moderateChat(message) {
  const userMessage = message;

  try {
    const moderationResponse = await openai.moderations.create({
      input: userMessage,
    });

    console.log(moderationResponse);

    const moderationResult = moderationResponse.data.results[0];

    return moderationResult.flagged;

  } catch (error) {
    console.error("Error during message moderation:", error);
    return false;
  }
}

module.exports = moderateChat;
