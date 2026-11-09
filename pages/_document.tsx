import { Head, Html, Main, NextScript } from "next/document";
import { UMAMI_BEFORE_SEND } from "~/lib/analytics";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Keep long numeric strings (like a NIK) from being auto-linked as phone numbers on iOS */}
        <meta name="format-detection" content="telephone=no" />
        {/* Light and dark follow the system; the bar color matches --background */}
        <meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fafaf9"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0c0a09"
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Self-hosted Umami; data-domains keeps localhost and preview deploys out,
            and data-before-send strips anything shaped like a NIK from every payload */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: a static string from lib/analytics, no user input
          dangerouslySetInnerHTML={{ __html: UMAMI_BEFORE_SEND }}
        />
        <script
          defer
          src="https://umami.zakiego.com/stats.js"
          data-website-id="c258ac23-6815-47db-8e01-0dd1e8bd6e10"
          data-domains="nik.zakiego.com"
          data-before-send="umamiBeforeSend"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
