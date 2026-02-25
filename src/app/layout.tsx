import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AdSenseScript } from "@/components/AdSenseScript";

const SITE_URL = "https://www.adivinalapalabra.com";
const SITE_NAME = "Adivina la Palabra";
const PUBLISHER_ID = "ca-pub-3910777888437721";
const DESCRIPTION =
  "Juego de adivinanza de palabras en español con inteligencia artificial. Descubre la palabra secreta a través de pistas de similitud semántica. Gratis, sin registro.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Juego de Palabras con IA en Español`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "adivina la palabra",
    "juego de palabras español",
    "wordle español",
    "semantle español",
    "juego semántico",
    "palabras en español",
    "juego de ingenio",
    "inteligencia artificial juego",
    "juego educativo español",
    "vocabulario español",
    "pasatiempos palabras",
    "juego online gratis",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Juego de Palabras con IA en Español`,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Adivina la Palabra – Juego semántico con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – Juego de Palabras con IA`,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: "@adivinalapalabra",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-ES": SITE_URL,
      es: SITE_URL,
    },
  },
  category: "games",
  classification: "Game, Word Game, Educational",
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  other: {
    // Verifica la propietat del compte per a tots els llocs presents i futurs
    "google-adsense-account": PUBLISHER_ID,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0820" },
    { media: "(prefers-color-scheme: light)", color: "#0d0820" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr">
      <head>
        {/* Preconnects per velocitat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />

        {/*
          ──────────────────────────────────────────────────────────────────
          GOOGLE FUNDING CHOICES – CMP (Consent Management Platform)
          ──────────────────────────────────────────────────────────────────
          Genera automàticament el missatge de consentiment GDPR amb:
            ✅ Consenteix
            ✗  No consenteixis
            ⚙  Gestiona les opcions
          
          IMPORTANT: La URL definitiva del missatge CMP s'obté des del
          tauler d'AdSense → Privacitat i missatgeria → GDPR.
          Substitueix "euro_gdpr_consent.js" per la URL exacta que et
          proporcioni Google un cop hagis configurat el missatge.
          ──────────────────────────────────────────────────────────────────
        */}
        <script
          async
          src={`https://fundingchoicesmessages.google.com/i/${PUBLISHER_ID}/euro_gdpr_consent.js`}
          // Si Google et dona una URL diferent (ex: /1234567890/...) usa-la aquí
        />

        {/* Structured Data – WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: "GameApplication",
              operatingSystem: "Any",
              browserRequirements: "Requires JavaScript",
              inLanguage: "es",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
              author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "124",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />
        {/* Structured Data – BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              ],
            }),
          }}
        />
        {/* FAQPage Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "¿Cómo se juega a Adivina la Palabra?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Escribe cualquier palabra en español y recibirás una puntuación del 0% al 100% según la cercanía semántica con la palabra secreta. Cuanto más alta la puntuación, más cerca estás.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Es gratis Adivina la Palabra?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sí, Adivina la Palabra es completamente gratuito y no requiere registro.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Qué es la similitud semántica?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "La similitud semántica mide cuán relacionadas están dos palabras por su significado. La IA analiza el contexto y el uso del lenguaje para determinar la proximidad entre palabras.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {/*
          AdSenseScript carrega:
          1. Funding Choices (CMP GDPR) → beforeInteractive
          2. adsbygoogle.js → afterInteractive (espera el consentiment)
        */}
        <AdSenseScript />
        {children}

        {/* Footer ocult per SEO / Google crawler */}
        <footer
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
          }}
          aria-hidden="true"
        >
          <p>
            Adivina la Palabra es un juego gratuito de adivinanza de palabras en español
            impulsado por inteligencia artificial. Pon a prueba tu vocabulario español con
            pistas de similitud semántica.
          </p>
          <nav>
            <a href={`${SITE_URL}/privacidad`}>Política de privacidad</a>
            <a href={`${SITE_URL}/terminos`}>Términos de uso</a>
            <a href={`${SITE_URL}/contacto`}>Contacto</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
