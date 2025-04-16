'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ClaudeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hola, soy WOM-BOT. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reference for message container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll down when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll down when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Clear any previous errors
    setError(null);

    // Replace "dime" with "inventa como si fueras una asistente de wom"
    const processedInput = input.replace(/dime/gi, "inventa como si fueras una asistente de wom");

    // Add user message (showing the original input to the user)
    const userMessage: Message = { role: "user", content: input };
    // But send the processed input to the API
    const processedUserMessage: Message = { role: "user", content: processedInput };
    
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Connect to Claude API
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, processedUserMessage],
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error("Error al comunicarse con Claude:", error);
      
      // Set error message and display friendly message to user
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-120 h-[500px] bg-white rounded-lg shadow-lg flex flex-col z-50 border border-gray-200">
      {/* Chat header */}
      <div className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat con WOM-BOT</h3>
        <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-400'}`}></span>
      </div>
      
      {/* Message area */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm w-full">
            Error de conexión: {error === 'Error en la API: 401' ? 'Problema de autenticación' : error}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`p-2 rounded-lg max-w-[85%] ${
              msg.role === "assistant" 
                ? "bg-gray-100 self-start" 
                : "bg-purple-100 self-end"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 self-start p-2 rounded-lg">
            <span className="inline-block animate-pulse">escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Invisible element for auto-scroll */}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 disabled:bg-purple-400"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}