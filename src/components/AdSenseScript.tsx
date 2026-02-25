"use client";

import Script from "next/script";

// Publisher ID real
export const ADSENSE_PUBLISHER_ID = "ca-pub-3910777888437721";

// ─── Script principal AdSense ────────────────────────────────────────────────
export function AdSenseScript() {
  return (
    <>
      {/*
        Google CMP (Funding Choices / Consent Management Platform)
        Ha de carregar-se ABANS d'AdSense.
        Gestiona automàticament el missatge de consentiment amb:
          - Consenteix
          - No consenteixis
          - Gestiona les opcions
        Aplica als llocs actuals i futurs del compte ca-pub-3910777888437721.
      */}
      <Script
        id="google-cmp-fc"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || { cmd: [] };
            window.__tcfapi = window.__tcfapi || function() {};
          `,
        }}
      />
      {/* Funding Choices – CMP de Google */}
      <Script
        id="funding-choices"
        src="https://fundingchoicesmessages.google.com/i/${ADSENSE_PUBLISHER_ID}/euro_gdpr_consent.js"
        strategy="beforeInteractive"
      />
      {/* AdSense – carrega DESPRÉS del CMP */}
      <Script
        id="adsense-main"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

// ─── Banner d'anunci ─────────────────────────────────────────────────────────
interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style = {},
}: AdBannerProps) {
  // Inicialitza l'anunci quan el component es munta
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* ignore */ }
  }

  return (
    <div
      className={`adsense-container ${className}`}
      style={{ textAlign: "center", overflow: "hidden", ...style }}
      aria-label="Publicidad"
      role="complementary"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
