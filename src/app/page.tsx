import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section className="relative w-full min-h-screen flex items-center justify-center bg-[#13202A]">
        <Image
          src="/fuerzaLeona.jpg"
          alt="Logo"
          fill
          className="object-cover pt-20"
        />
        <div className="absolute bg-white/40 p-8 rounded-lg shadow-lg w-[90%] max-w-xl text-center">
          <h2 className="text-white text-2xl font-bold">
            OBTÉN INSIGHTS VALIOSOS DE TUS REUNIONES
          </h2>
          <p className="text-white/90 mt-2">
            Potencia tu relación con clientes con análisis inteligentes. Nuestra
            plataforma transforma las reuniones en dashboards, estadísticas y
            resúmenes accionables con IA, ayudando a mejorar la comunicación y
            la toma de decisiones.
          </p>
        </div>
      </section>

      <section
        id="nosotros"
        className="w-full min-h-screen flex flex-col items-center justify-center bg-[#13202A] px-8 py-16 text-white text-center"
      >
        <h3 className="text-3xl font-bold mb-6">¿Quiénes somos?</h3>
        <p className="max-w-3xl text-lg leading-relaxed">
          Somos un equipo de estudiantes del Instituto Tecnológico y de Estudios
          Superiores de Monterrey comprometidos con la innovación en la atención
          al cliente a través de herramientas basadas en inteligencia
          artificial. Nuestra propuesta nace del reto de optimizar la calidad y
          eficiencia de las interacciones entre empresas y sus clientes.
        </p>
      </section>

      <section
        id="que-hacemos"
        className="w-full min-h-screen flex flex-col items-center justify-center bg-[#13202A] px-8 py-16 text-white text-center"
      >
        <h3 className="text-3xl font-bold mb-6">¿Qué hacemos?</h3>
        <p className="max-w-3xl text-lg leading-relaxed">
          Desarrollamos una plataforma que permite analizar reuniones con
          clientes en tiempo real, transcribirlas automáticamente y extraer
          insights relevantes. A través de análisis de sentimientos, emociones,
          palabras clave y generación de KPIs, ayudamos a mejorar la experiencia
          del cliente y la productividad del equipo. Además, proporcionamos
          retroalimentación personalizada y sugerencias concretas para mejorar
          las interacciones.
        </p>
      </section>

      <section
        id="como-funciona"
        className="w-full min-h-screen flex flex-col items-center justify-center bg-[#13202A] px-8 py-16 text-white text-center"
      >
        <h3 className="text-3xl font-bold mb-6">¿Cómo funciona?</h3>
        <p className="max-w-3xl text-lg leading-relaxed">
          La plataforma se integra con herramientas de videollamadas como Zoom,
          Google Meet o Teams. Durante las reuniones, se transcriben
          automáticamente las conversaciones, se analizan con IA mediante la API
          de OpenAI y se almacenan en una base de datos vectorizada (Supabase +
          pgvector). Luego, los usuarios pueden consultar dashboards
          interactivos, acceder a recomendaciones personalizadas y utilizar un
          chatbot con contexto específico para cada llamada.
        </p>
      </section>
    </>
  );
}
