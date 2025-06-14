import Image from 'next/image';

export default function Home() {
  return (
    <>
      <section
        id="que-hacemos"
        className="w-full min-h-screen flex flex-col items-center justify-center bg-white px-8 py-16 pt-32 text-black"
      >
        <div className="flex justify-center items-center">
          <div className="max-w-3xl text-xl pr-10 leading-relaxed">
            <div className="font-bold text-5xl mb-15">¿Qué hacemos?</div>

            <div className="font-bold">
              Desarrollamos una plataforma de IA que:
            </div>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Analiza reuniones con clientes en tiempo real
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Transcribe automáticamente las conversaciones
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Extrae insights clave de cada interacción
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Genera KPIs y análisis de sentimientos
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Proporciona retroalimentación personalizada
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-[#13202A] rounded-full mt-2"></div>
                <span className="text-lg">
                  Mejora la experiencia del cliente y la productividad del
                  equipo
                </span>
              </li>
            </ul>
          </div>
          <video src="landing.mp4" autoPlay muted loop></video>
        </div>
      </section>

      <section
        id="nosotros"
        className="w-full min-h-screen flex flex-col items-start justify-start bg-[#13202A] px-8 py-16 text-white pt-32"
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
