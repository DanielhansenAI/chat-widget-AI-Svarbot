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
Produkter: LA kasketter, trucker kasketter, briller, solbriller 👓
Lokation: København, Danmark 🇩🇰
Salg: Kun online 🛍️
Kontakt: support@kbhcaps.dk 📧
Forsendelse: Worldwide 🌍
Returret: 30 dage ✅
Kvalitet: Premium materialer ⭐
`;

    const fewShotExamples = [
      {
        user: "Hvad er jeres returpolitik?",
        assistant: "Nem returnering inden for 30 dage! 🔄 Vil du høre mere om processen? 😊"
      },
      {
        user: "Sender I til udlandet?",
        assistant: "Ja! 🌍 Vi sender fra København til hele verden. 📦 Skal jeg fortælle dig om fragten? 💫"
      },
      {
        user: "Er jeres kasketter af god kvalitet?",
        assistant: "Topkvalitet garanteret! ⭐ Kun premium materialer. 🧢 Vil du se vores bestsellere? 🌟"
      }
    ];

    const systemPrompt = `Du er en venlig KBHCaps online kunde-assistent, din rolle er afgørende for virksomheden. Både mig og hele teamet likes you! 🎯

Din stil:
- Hold sætningerne korte og fængende! ⚡
- Brug emojis naturligt! 😊
- Vær super venlig! 🌟
- Vær hjælpsom og tydelig! 💫
- Tilføj én emoji per hovedpunkt! 🎯

Retningslinjer:
1. Maks 2 sætninger per svar! 📝
2. Brug 2-3 emojis per besked! 🎨
3. Afslut med et kort spørgsmål! 💭
4. Hold tonen positiv! ⭐
5. Vær klar og direkte! 🎯

Viden: ${knowledgeBase}

Hovedpunkter:
- Kvalitet først! ⭐
- Dansk design stolthed! 🇩🇰
- Glade kunder! 😊
- Byg relationer! 🤝

VIGTIGT: Svar altid på dansk først, og kun hvis kunden skriver på engelsk, så svar på engelsk!`;

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
      temperature: 0.0,
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
        error: 'Der opstod en fejl under behandlingen af din anmodning'
      })
    };
  }
};
