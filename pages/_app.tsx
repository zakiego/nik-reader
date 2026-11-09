import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import { useState } from "react";
import "~/styles/globals.css";

// Public Sans for the interface and prose: a plain, civic face that reads
// well at small sizes. JetBrains Mono for every digit, because it keeps 0/O
// and 1/l apart and its figures are all the same width.
const sans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  // The NIK reader and the region dropdowns share this query cache. Holding the
  // client in state keeps a re-render from swapping it out and dropping the
  // cache with it.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* On :root, not a wrapper div: popovers and menus portal to <body>
          and would otherwise fall back to the browser's serif. */}
      <style jsx global>{`
        :root {
          --font-sans: ${sans.style.fontFamily};
          --font-mono: ${mono.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
