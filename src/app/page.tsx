import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Navigation */}
      <nav className="w-full bg-navy-800 text-white py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white hover:opacity-90 transition-opacity">
            CallSight
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/nosotros" className="hover:text-blue-300 transition-colors">
              Nosotros
            </Link>
            <Link href="/que-hacemos" className="hover:text-blue-300 transition-colors">
              Qué hacemos
            </Link>
            <Link href="/como-funciona" className="hover:text-blue-300 transition-colors">
              Cómo funciona
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content - vertically centered with text aligned left */}
      <main className="flex-1 flex items-center py-16 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
              Obtén insights valiosos de tus reuniones.
            </h1>
            <p className="text-xl mt-6 text-slate-300">
              Potencia tu relación con clientes con análisis inteligentes.
            </p>
            <div className="mt-10 flex gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg p-6 font-bold text-lg"
              >
                <Link href="/login">
                  Inténtalo ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-400">
            © 2025 CallSight.
          </div>
        </div>
      </footer>
    </div>
  );
}