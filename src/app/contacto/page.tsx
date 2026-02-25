import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con el equipo de Adivina la Palabra para sugerencias, reportar problemas o cualquier consulta.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.adivinalapalabra.com/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#0d0820] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8 text-sm text-white/40">
          <Link href="/" className="hover:text-violet-400 transition-colors">← Volver al juego</Link>
        </nav>

        <h1 className="text-3xl font-black text-white mb-2">Contacto</h1>
        <p className="text-white/60 mb-8 leading-relaxed">
          ¿Tienes sugerencias, has encontrado un error o quieres colaborar? Escríbenos.
        </p>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-violet-400 text-lg mb-1">✉️ Email</div>
            <p className="text-white/60 text-sm mb-2">Para cualquier consulta general:</p>
            <a
              href="mailto:hola@adivinalapalabra.com"
              className="text-violet-300 hover:text-violet-200 font-medium transition-colors"
            >
              hola@adivinalapalabra.com
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-violet-400 text-lg mb-1">🐛 Reportar un problema</div>
            <p className="text-white/60 text-sm">
              Si encuentras un error en el juego, describe el problema y el dispositivo/navegador
              que usas al escribirnos.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-violet-400 text-lg mb-1">📢 Publicidad</div>
            <p className="text-white/60 text-sm">
              Para consultas relacionadas con publicidad o colaboraciones comerciales, escríbenos
              indicando el asunto "Publicidad".
            </p>
          </div>
        </div>

        <p className="text-white/30 text-xs mt-8">
          Intentamos responder en un plazo de 48–72 horas laborables.
        </p>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 text-sm text-white/30">
          <Link href="/" className="hover:text-violet-400 transition-colors">Inicio</Link>
          <Link href="/privacidad" className="hover:text-violet-400 transition-colors">Privacidad</Link>
          <Link href="/terminos" className="hover:text-violet-400 transition-colors">Términos</Link>
        </div>
      </div>
    </div>
  );
}
