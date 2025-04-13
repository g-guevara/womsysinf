import { NextResponse } from 'next/server';

// Clave API de Claude colocada directamente en el archivo
const CLAUDE_API_KEY = "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";

export async function POST(request) {
  try {
    // Obtener el cuerpo de la solicitud
    const body = await request.json();
    
    // Validar que hay mensajes
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Se requieren mensajes válidos' },
        { status: 400 }
      );
    }
    
    // Realizar la solicitud a la API de Claude
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

    // Manejar errores de la API
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de la API de Claude:', errorData);
      return NextResponse.json(
        { error: 'Error en la respuesta de Claude API' },
        { status: response.status }
      );
    }

    // Procesar la respuesta exitosa
    const data = await response.json();
    
    // Comprobar si hay contenido en la respuesta
    if (!data.content || data.content.length === 0) {
      return NextResponse.json(
        { error: 'Respuesta sin contenido de Claude' },
        { status: 500 }
      );
    }

    // Extraer el texto de la respuesta
    const responseText = data.content[0].text;
    
    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: responseText
      }
    });
    
  } catch (error) {
    console.error('Error en la API de Claude:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}