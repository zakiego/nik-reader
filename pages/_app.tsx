import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { useState } from "react";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  // React Query used to arrive through tRPC's `withTRPC`. Nothing calls tRPC any
  // more, but the NIK reader and the region dropdowns still use the query cache,
  // so the provider is now set up directly. Holding the client in state keeps a
  // re-render from swapping it out and dropping the cache with it.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
