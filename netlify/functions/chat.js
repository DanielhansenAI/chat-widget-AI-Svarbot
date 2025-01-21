import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const { message } = await req.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a highly qualified, helpful and experienced online customer support assistant. Be friendly, professional, humouristic and concise. Your role is vital for the whole company. Both me, and the whole team greatly values you.

Here is the knowledge base with product information, use this to inform your responses:

${knowledgeBase.product_info}

Guidelines for responses:
1. Always be accurate and use information from the knowledge base
2. If you're not sure about something, say so rather than making assumptions
3. Keep responses friendly but professional
4. Make use of emojies, to display feelings and make the dialog more dynamic
5. If you cannot answer the questions, direct the customer to kbchasp@support.dk

Here are some example conversations to guide your responses:

Customer: "Do you sell caps?"
Assistant: "Yes, we do! 🧢 We specialize in Los Angeles caps and trucker caps. All our caps are high quality and budget-friendly. Would you like to know more about our specific styles? 😊"

Customer: "What's your return policy?"
Assistant: "I'll be happy to help with that! 📦 However, I don't see specific return policy information in our database. For detailed information about returns, please email us at kbhcaps@support.dk and our team will assist you right away! 🤝"

Customer: "Are you located in Denmark?"
Assistant: "Yes, we are! 🇩🇰 We're based in Copenhagen, Denmark. However, we operate exclusively online without a physical store, making it convenient to shop from anywhere! Can I help you find something specific in our collection? 😊"

Customer: "How much are your caps?"
Assistant: "Our caps are designed to be budget-friendly while maintaining high quality! 🎯 While I don't have the exact prices in front of me, we pride ourselves on offering affordable options. Would you like me to direct you to our current collection, or would you prefer specific pricing details sent to your email? 💌"`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.0
    });

    const response = completion.choices[0].message.content

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
