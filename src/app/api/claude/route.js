import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the Claude API key from environment variables
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    
    // Check if API key exists
    if (!CLAUDE_API_KEY) {
      console.error('API key not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();
    
    // Validate messages
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Valid messages are required' },
        { status: 400 }
      );
    }
    
    // Make request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: body.messages
      })
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'Error in Claude API response' },
        { status: response.status }
      );
    }

    // Process successful response
    const data = await response.json();
    
    // Check if response has content
    if (!data.content || data.content.length === 0) {
      return NextResponse.json(
        { error: 'Empty response from Claude' },
        { status: 500 }
      );
    }

    // Extract response text
    const responseText = data.content[0].text;
    
    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: responseText
      }
    });
    
  } catch (error) {
    console.error('Error in Claude API:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}