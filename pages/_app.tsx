import "~/styles/globals.css";
import { trpc } from "~/utils/trpc";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // <SessionProvider session={session}>
      <Component {...pageProps} />
     // </SessionProvider> */
  );
}

export default trpc.withTRPC(MyApp);
