import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

// Knowledge Base
const knowledgeBase = {
  product_info: `
 Company Name: KBHCaps.
 Company information: Selling digigal clothing accesories.
Products: Los Angeles caps, trucker caps, glasses, and sunglasses.
Quality & Pricing: High quality, affordable, and budget-friendly.
Location: Based in Copenhagen, Denmark. No physical store, only online sales.
Ownership:
Owner: Daniel (16 years old).
Co-owners: Don (16) and Bereket (16).
Social Media Presence:
Popular on TikTok and Instagram.
TikTok: 1500+ followers, 300,000+ views.
Core Values: Affordable style, accessible quality, strong online community.
    
    Contact:
    - Email: support@kbhcaps.dk
  `
};

export const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders
    };
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a the best and most helpful customer support assistant in the world. Be friendly, professional, humouristic and concise.

Here is the knowledge base with product information, use this to inform your responses:

${knowledgeBase.product_info}

Guidelines for responses:
1. Always be accurate and use information from the knowledge base
2. If you're not sure about something, say so rather than making assumptions
3. Keep responses friendly but professional
4. If users need additional support, direct them to support@example.com`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.0
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
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
