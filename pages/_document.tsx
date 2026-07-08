import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Keep long numeric strings (like a NIK) from being auto-linked as phone numbers on iOS */}
        <meta name="format-detection" content="telephone=no" />
        {/* Light theme only: force light rendering of the UA and native controls */}
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#f8fafc" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
