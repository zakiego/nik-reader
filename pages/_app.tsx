import type { AppProps } from "next/app";
import "~/styles/globals.css";
import { trpc } from "~/utils/trpc";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
