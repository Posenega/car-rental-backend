const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey:
    "sk-IC-Fzbnb71VIyS-GnC9yWc6jqLbpZQel5fQwxuO-L3T3BlbkFJBgkhPavkCd7zDkReksUxR9n7f2k6QqAQ_FzEjfav0A",
})

async function generateBotReply(prompt) {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    return res.choices[0].message.content
  } catch (err) {
    console.error("OpenAI error:", err.message)
    return "Sorry, I couldn’t process your request."
  }
}

module.exports = { generateBotReply }
