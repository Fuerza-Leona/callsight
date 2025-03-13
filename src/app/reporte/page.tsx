import TranscriptBubble from "../components/TranscriptBubble";

export default function Home() {

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center text-center justify-center lg:pl-[256px] pt-[65px]">
      <div className="w-full text-start">
        <p className="mx-20">Regresar</p>
        <div className="flex text-white text-4xl justify-between bg-[#13202A] rounded-2xl mx-22">
          <p className="mx-20 p-8">Nombre</p>
          <p className="mx-20 p-8">Fecha</p>
        </div>
      </div>
      <div className="flex w-[calc(100%-11rem)] justify-between mt-10">
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <h3 className="text-xl">Categorias:</h3>
            <p className="rounded-lg bg-[#8AD2E6] px-4 py-1">Tecnología</p>
            <p className="rounded-lg bg-[#8AD2E6] px-4 py-1">Tecnología</p>
          </div>
          <div className="flex flex-col bg-gray-200 w-120 h-35 rounded-2xl justify-center items-center">
            <p className="text-2xl">Resumen</p>
          </div>
        </div>


        <div className="flex flex-col bg-gray-200 w-60 h-60 rounded-xl justify-center items-center">
          <h3 className="font-black">Emociones detectadas</h3>
          <p>Emoción 1</p>
          <p>Emoción 2</p>
          <p>Emoción 3</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center">
            <p>Duración: 45 minutos</p>
          </div>

          <h3 className="text-xl">Participantes</h3>

          <div className="flex flex-col gap-3">
            <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 1</p>
            </div>
            <div className="flex bg-gray-200 w-50 h-13 rounded-lg justify-center items-center gap-5">
              <div className="w-8 h-8 bg-black rounded-3xl"></div>
              <p>Persona 2</p>
            </div>
          </div>

        </div>

      </div>
      <div className="flex w-[calc(100%-11rem)] justify-start gap-31 mt-10 bg-gray-200 h-40">
        <div className="flex flex-col w-full" id="testing">
          <TranscriptBubble color="pink" user="me" message="Hola, cómo estás?"/>
          <TranscriptBubble color="blue" user="you" message="Bien, y tú?"/>
        </div>


      </div>
    </div>
  );
}