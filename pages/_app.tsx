import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { trpc } from "~/utils/trpc";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}

export default trpc.withTRPC(MyApp);
