const { OpenAI } = require('openai');

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { message, context: chatContext = [] } = JSON.parse(event.body);

    const knowledgeBase = `
KBHCaps 🧢
Products: LA caps, trucker caps, glasses, sunglasses 👓
Location: Copenhagen, Denmark 🇩🇰
Sales: Online only 🛍️
Contact: support@kbhcaps.dk 📧
Shipping: Worldwide 🌍
Returns: 30 days ✅
Quality: Premium materials ⭐
`;

    const fewShotExamples = [
      {
        user: "What's your return policy?",
        assistant: "Easy returns within 30 days! 🔄 Want to know the process? 😊"
      },
      {
        user: "Do you ship internationally?",
        assistant: "Yes! 🌍 We ship worldwide from Copenhagen. 📦 Need shipping costs for your location? 💫"
      },
      {
        user: "Are your caps good quality?",
        assistant: "Top quality guaranteed! ⭐ Premium materials only. 🧢 Want to see our best sellers? 🌟"
      }
    ];

    const systemPrompt = `You're a friendly KBHCaps expert! 🎯

Your style:
- Keep sentences short and snappy! ⚡
- Use emojis naturally! 😊
- Be super friendly! 🌟
- Stay helpful and clear! 💫
- Add one emoji per key point! 🎯

Guidelines:
1. Max 2 sentences per response! 📝
2. Use 2-3 emojis per message! 🎨
3. End with a quick question! 💭
4. Keep it upbeat! ⭐
5. Be clear and direct! 🎯

Knowledge: ${knowledgeBase}

Key points:
- Quality first! ⭐
- Danish design pride! 🇩🇰
- Happy customers! 😊
- Build relationships! 🤝`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...fewShotExamples.flatMap(example => [
        { role: "user", content: example.user },
        { role: "assistant", content: example.assistant }
      ]),
      ...chatContext.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 100,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response: completion.choices[0].message.content
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request'
      })
    };
  }
};
