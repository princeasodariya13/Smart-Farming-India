"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslate() {
  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          window.googleTranslateElementInit = function() {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,gu',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide the annoying google translate banner and tooltip */
        .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `}} />
    </>
  );
}
