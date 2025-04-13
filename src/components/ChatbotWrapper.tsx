'use client';

import dynamic from "next/dynamic";

// Aquí podemos usar dynamic con ssr: false porque estamos en un componente cliente
const ClaudeChatbot = dynamic(() => import("@/components/ClaudeChatbot"), {
  ssr: false,
  loading: () => (
    <div className="w-80 h-[400px] bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat con Claude</h3>
        <span className="h-2 w-2 rounded-full bg-green-400"></span>
      </div>
      <div className="p-3 flex flex-col h-[calc(100%-56px)]">
        <p className="text-gray-500 text-center my-auto">
          Cargando chatbot...
        </p>
      </div>
    </div>
  ),
});

export default function ChatbotWrapper() {
  return <ClaudeChatbot />;
}