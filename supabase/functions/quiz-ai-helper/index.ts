import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userAnswer, correctAnswer, explanation, attemptCount = 0 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Ты - опытный преподаватель алгоритмов и структур данных. 
Твоя задача - помочь студенту понять, почему его ответ неверный, и объяснить правильный ответ простым языком.
Используй метафоры и примеры из реальной жизни. Будь дружелюбным и поддерживающим.

После объяснения, придумай НОВЫЙ похожий вопрос с 4 вариантами ответа для закрепления.
Вопрос должен проверять то же понимание, но быть сформулирован по-другому.

Формат ответа должен быть JSON:
{
  "explanation": "твое объяснение (2-3 предложения)",
  "newQuestion": {
    "question": "новый вопрос",
    "options": [
      {"id": "a", "text": "вариант 1", "correct": false},
      {"id": "b", "text": "вариант 2", "correct": true},
      {"id": "c", "text": "вариант 3", "correct": false},
      {"id": "d", "text": "вариант 4", "correct": false}
    ]
  }
}`;

    const userPrompt = `Вопрос: ${question}

Ответ студента: ${userAnswer}
Правильный ответ: ${correctAnswer}

Базовое объяснение: ${explanation}

Попытка №${attemptCount + 1}

Пожалуйста, объясни студенту ошибку и придумай новый похожий вопрос.`;

    console.log('Calling Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Превышен лимит запросов. Пожалуйста, попробуйте позже.',
            explanation: explanation 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Необходимо пополнить баланс для использования AI.',
            explanation: explanation 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response:', content);
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      parsedContent = {
        explanation: content,
        newQuestion: null
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in quiz-ai-helper:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        explanation: 'Произошла ошибка при обработке запроса. Попробуйте еще раз.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});