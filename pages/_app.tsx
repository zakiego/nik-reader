import "~/styles/globals.css";
import { trpc } from "~/utils/trpc";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
