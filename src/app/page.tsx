import Image from "next/image";
import ChatbotWrapper from "@/components/ChatbotWrapper";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-auto bg-white relative">
      {/* Imagen de fondo a ancho completo */}
      <div className="w-full max-w-[100vw] mx-auto">
        <div className="relative w-full">
          <Image
            src="/wompg.png"
            alt="Captura de pantalla de la página web"
            width={1920}
            height={5000}
            priority
            className="w-full h-auto"
            style={{
              userSelect: "none",
              objectPosition: "top",
            }}
          />
        </div>
      </div>
      
      {/* Componente del chatbot (cliente) posicionado en la parte inferior derecha */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatbotWrapper />
      </div>
    </div>
  );
}