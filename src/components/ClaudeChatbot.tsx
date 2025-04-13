'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ClaudeChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hola, soy Claude. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia para el contenedor de mensajes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para desplazarse hacia abajo cuando lleguen nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Efecto para desplazarse hacia abajo cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Añadir mensaje del usuario
    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Conectar con la API real de Claude
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al comunicarse con Claude:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje." 
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 h-[400px] bg-white rounded-lg shadow-lg flex flex-col z-50 border border-gray-200">
      {/* Cabecera del chat */}
      <div className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat con Claude</h3>
        <span className="h-2 w-2 rounded-full bg-green-400"></span>
      </div>
      
      {/* Área de mensajes */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
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
            <span className="inline-block animate-pulse">Claude está escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Elemento invisible para el auto-scroll */}
      </div>
      
      {/* Formulario de entrada */}
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