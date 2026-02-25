import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad de Adivina la Palabra. Información sobre cómo tratamos tus datos, el uso de cookies, publicidad de Google AdSense y gestión del consentimiento RGPD.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.adivinalapalabra.com/privacidad" },
};

export default function PrivacidadPage() {
  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0d0820] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8 text-sm text-white/40">
          <Link href="/" className="hover:text-violet-400 transition-colors">← Volver al juego</Link>
        </nav>

        <article>
          <h1 className="text-3xl font-black text-white mb-2">Política de Privacidad</h1>
          <p className="text-white/40 text-sm mb-8">Última actualización: {today}</p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">1. Responsable</h2>
            <p className="text-white/70 leading-relaxed">
              El titular de este sitio web es <strong className="text-white">Adivina la Palabra</strong>{" "}
              (adivinalapalabra.com). Para cualquier consulta, contáctanos en{" "}
              <a href="mailto:hola@adivinalapalabra.com" className="text-violet-400 hover:underline">
                hola@adivinalapalabra.com
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">2. Datos que recogemos</h2>
            <p className="text-white/70 leading-relaxed mb-3">
              Este sitio <strong className="text-white">no requiere registro</strong> y no recoge datos
              personales directamente. Los datos tratados son:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-1.5 ml-2">
              <li>Estado del juego en <code className="text-violet-300">localStorage</code> de tu navegador (solo en tu dispositivo).</li>
              <li>Datos de navegación anónimos a través de Google Analytics.</li>
              <li>Datos de publicidad gestionados por Google AdSense (cuenta <code className="text-violet-300">ca-pub-3910777888437721</code>).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">3. Gestión del consentimiento (RGPD)</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Usamos la <strong className="text-white">Plataforma de Gestión del Consentimiento (CMP)
              de Google</strong> (Google Funding Choices) para cumplir con el RGPD y la ePrivacy.
              Al visitar el sitio por primera vez verás un mensaje con tres opciones:
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: "✅",
                  label: "Consentir",
                  desc: "Aceptas todas las cookies y la publicidad personalizada basada en tus intereses.",
                  color: "border-emerald-400/30 bg-emerald-500/10",
                  labelColor: "text-emerald-300",
                },
                {
                  icon: "✗",
                  label: "No consentir",
                  desc: "Solo se mostrarán anuncios no personalizados. No se instalarán cookies de seguimiento.",
                  color: "border-red-400/30 bg-red-500/10",
                  labelColor: "text-red-300",
                },
                {
                  icon: "⚙️",
                  label: "Gestionar opciones",
                  desc: "Accedes a un panel detallado para controlar qué cookies y proveedores aceptas, uno a uno.",
                  color: "border-violet-400/30 bg-violet-500/10",
                  labelColor: "text-violet-300",
                },
              ].map((item) => (
                <div key={item.label} className={`border rounded-xl p-4 ${item.color}`}>
                  <div className={`font-bold mb-1 flex items-center gap-2 ${item.labelColor}`}>
                    <span>{item.icon}</span> {item.label}
                  </div>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-white/50 text-sm mt-4">
              Puedes cambiar tu elección en cualquier momento haciendo clic en el enlace
              &ldquo;Gestionar consentimiento&rdquo; que aparece en el pie de página del juego.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies y tecnologías similares</h2>
            <div className="space-y-3">
              {[
                {
                  name: "Google AdSense",
                  purpose: "Muestra publicidad relevante para financiar el servicio gratuito. Puede usar cookies para personalizar anuncios según tu historial de navegación si has dado tu consentimiento.",
                },
                {
                  name: "Google Funding Choices (CMP)",
                  purpose: "Gestiona tus preferencias de consentimiento de cookies según el RGPD. Almacena tu elección para no volverte a preguntar en cada visita.",
                },
                {
                  name: "Google Analytics",
                  purpose: "Analiza el tráfico del sitio de forma anónima (páginas visitadas, tiempo de sesión) para mejorar la experiencia de usuario.",
                },
              ].map((item) => (
                <div key={item.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="font-semibold text-violet-300 mb-1">{item.name}</div>
                  <p className="text-white/60 text-sm">{item.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">5. Base legal y derechos</h2>
            <p className="text-white/70 leading-relaxed">
              El tratamiento para publicidad personalizada se basa en tu <strong className="text-white">consentimiento
              explícito</strong> (RGPD, Art. 6.1.a). Tienes derecho a acceder, rectificar, suprimir y
              oponerte al tratamiento. Puedes ejercer estos derechos contactándonos o retirando el
              consentimiento desde el panel de gestión de cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-3">6. Más información</h2>
            <p className="text-white/70 leading-relaxed">
              Consulta la{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline">
                política de privacidad de Google
              </a>{" "}
              para más detalles sobre AdSense y Analytics. Para reclamaciones, puedes acudir a la
              Agencia Española de Protección de Datos (AEPD).
            </p>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 text-sm text-white/30">
          <Link href="/" className="hover:text-violet-400 transition-colors">Inicio</Link>
          <Link href="/terminos" className="hover:text-violet-400 transition-colors">Términos</Link>
          <Link href="/contacto" className="hover:text-violet-400 transition-colors">Contacto</Link>
        </div>
      </div>
    </div>
  );
}
