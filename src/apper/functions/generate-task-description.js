// Custom action to generate task descriptions using OpenAI
export default async function handler(request, { apper }) {
  try {
    // Parse the request body
    const { title } = await request.json();
    
    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Task title is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get OpenAI API key from secrets
    const openaiApiKey = await apper.getSecret('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `Generate a concise, professional task description for the following task title. The description should be 2-3 sentences, actionable, and provide context about what needs to be accomplished.

Task Title: "${title}"

Description:`;
    
    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates professional task descriptions. Keep descriptions concise, actionable, and focused on the specific task requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to generate description'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const openaiData = await openaiResponse.json();
    
    // Extract the generated description
    const generatedDescription = openaiData.choices?.[0]?.message?.content?.trim();
    
    if (!generatedDescription) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No description generated'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return the generated description
    return new Response(JSON.stringify({
      success: true,
      description: generatedDescription
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error in generate-task-description:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Export for apper registration
export { handler };