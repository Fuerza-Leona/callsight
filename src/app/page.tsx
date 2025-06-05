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
        className="w-full min-h-screen flex flex-col items-start justify-start bg-[#13202A] px-8 py-16 text-white"
      >
        <h3 className="text-8xl font-medium mb-6">¿Quiénes somos?</h3>
        <p className="w-[85%] text-2xl font-thin leading-relaxed pt-5">
          Somos un equipo de estudiantes del Instituto Tecnológico y de Estudios
          Superiores de Monterrey comprometidos con la innovación en la atención
          al cliente a través de herramientas basadas en inteligencia
          artificial. Nuestra propuesta nace del reto de optimizar la calidad y
          eficiencia de las interacciones entre empresas y sus clientes.
        </p>
        <h3
          className={`text-animation whitespace-nowrap text-3xl font-semibold pt-30`}
        >
          <span></span>{' '}
        </h3>
      </section>

      <section
        id="que-hacemos"
        className="w-full min-h-screen flex flex-col items-center justify-center bg-white px-8 py-16 text-black"
      >
        <h3 className="text-7xl font-medium mb-6">¿Qué hacemos?</h3>
        <div className="flex justify-center items-center">
          <p className="max-w-3xl text-xl leading-relaxed">
            Desarrollamos una plataforma que permite analizar reuniones con
            clientes en tiempo real, transcribirlas automáticamente y extraer
            insights relevantes. A través de análisis de sentimientos,
            emociones, palabras clave y generación de KPIs, ayudamos a mejorar
            la experiencia del cliente y la productividad del equipo. Además,
            proporcionamos retroalimentación personalizada y sugerencias
            concretas para mejorar las interacciones.
          </p>
          <video src="landing.mp4" autoPlay muted loop></video>
        </div>
      </section>

      <section
        id="como-funciona"
        className="w-full min-h-screen flex flex-col items-end justify-center bg-[#13202A] px-8 py-16 text-white text-left"
      >
        <div>
          <h3 className="text-7xl font-medium mb-6">¿Cómo funciona?</h3>
          <div className="flex gap-3 items-center">
            <Image
              src="https://images.pexels.com/photos/17744150/pexels-photo-17744150/free-photo-of-man-talking-on-a-video-call.jpeg"
              alt="call"
              width={384} // tailwind w-96 = 24rem = 384px
              height={256} // or whatever fits; "auto" not supported in next/image
              className="rounded-lg object-cover"
            />
            <p className="max-w-3xl text-xl leading-relaxed">
              La plataforma se integra con herramientas de videollamadas como
              Zoom, Google Meet o Teams, o incluso con llamadas telefonicas. La
              plataforma analiza las llamadas con IA, y permite a los usuarios
              consultar dashboards interactivos, acceder a recomendaciones
              personalizadas y utilizar un chatbot con contexto específico para
              cada llamada, entre otras funciones.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
