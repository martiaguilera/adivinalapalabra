import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Uso",
  description: "Términos y condiciones de uso de Adivina la Palabra, el juego de palabras gratuito en español.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.adivinalapalabra.com/terminos" },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#0d0820] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8 text-sm text-white/40">
          <Link href="/" className="hover:text-violet-400 transition-colors">← Volver al juego</Link>
        </nav>

        <article>
          <h1 className="text-3xl font-black text-white mb-2">Términos de Uso</h1>
          <p className="text-white/40 text-sm mb-8">
            Al usar Adivina la Palabra aceptas los siguientes términos.
          </p>

          {[
            {
              title: "1. Uso del servicio",
              body: "Adivina la Palabra es un servicio gratuito de entretenimiento. Está permitido su uso personal y no comercial. Queda prohibido cualquier uso que pueda dañar, sobrecargar o alterar el funcionamiento del sitio.",
            },
            {
              title: "2. Propiedad intelectual",
              body: "El diseño, código y contenido del sitio son propiedad de Adivina la Palabra. La reproducción total o parcial sin autorización expresa está prohibida.",
            },
            {
              title: "3. Publicidad",
              body: "Este sitio muestra anuncios de Google AdSense para financiar el servicio gratuito. Los anunciantes son independientes y no representamos ni validamos sus productos o servicios.",
            },
            {
              title: "4. Limitación de responsabilidad",
              body: "El servicio se proporciona tal cual, sin garantías de disponibilidad continua. No somos responsables de los daños derivados del uso o la imposibilidad de uso del sitio.",
            },
            {
              title: "5. Modificaciones",
              body: "Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio implica la aceptación de los términos vigentes.",
            },
          ].map((item) => (
            <section key={item.title} className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">{item.title}</h2>
              <p className="text-white/70 leading-relaxed">{item.body}</p>
            </section>
          ))}
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 text-sm text-white/30">
          <Link href="/" className="hover:text-violet-400 transition-colors">Inicio</Link>
          <Link href="/privacidad" className="hover:text-violet-400 transition-colors">Privacidad</Link>
          <Link href="/contacto" className="hover:text-violet-400 transition-colors">Contacto</Link>
        </div>
      </div>
    </div>
  );
}
