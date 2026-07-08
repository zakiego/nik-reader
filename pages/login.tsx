import { EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC, useState } from "react";
import { Seo } from "~/components/Seo";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
};

const Login = () => {
  const router = useRouter();
  const [secretCode, setSecretCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const login = await signIn("credentials", {
      secretCode: secretCode,
      callbackUrl: "/",
      redirect: false,
    });

    if (login.ok) {
      return router.push("/");
    }

    if (login.status === 401) {
      return setErrorMessages("Invalid secret code");
    }

    return setErrorMessages("Something went wrong");
  };

  return (
    <>
      <Seo title="Masuk" path="/login" noindex />
      <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-fg shadow-sm ring-1 ring-black/5">
              <IdentificationIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight text-content">
                NIK
              </div>
              <div className="text-xs font-medium text-muted">
                Reader &amp; Generator
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-content">
              Sign in for exclusive access
            </h2>
            <p className="text-sm text-muted">
              Ping me at{" "}
              <a
                href="https://twitter.com/zakiego"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                @zakiego
              </a>{" "}
              for the secret code 🤣
            </p>
            <p className="text-sm text-muted">
              And tell me why {`you're`} interested in trying it. Please note
              that this project is limited due to its potential for abuse.
            </p>
          </div>

          <div className="mt-8">
            {errorMessages && (
              <div className="mb-4">
                <Alert message={errorMessages} />
              </div>
            )}
            <form className="space-y-5" autoComplete="off">
              <div>
                <label
                  htmlFor="secretCode"
                  className="block text-sm font-medium text-content"
                >
                  Secret Code
                </label>
                <div className="relative mt-2">
                  <input
                    id="secretCode"
                    name="secretCode"
                    type={showCode ? "text" : "password"}
                    placeholder="Enter your secret code"
                    className="block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 pr-10 text-sm text-content shadow-sm outline-none transition-colors placeholder:text-faint focus:border-primary focus:ring-2 focus:ring-primary/25"
                    onChange={(e) => setSecretCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode((prev) => !prev)}
                    aria-label={
                      showCode ? "Sembunyikan kode" : "Tampilkan kode"
                    }
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-r-xl text-faint transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {showCode ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-fg shadow-sm outline-none transition-all hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.99]"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

interface AlertProps {
  message: string;
}

const Alert: FC<AlertProps> = ({ message }) => {
  return (
    <div className="rounded-xl border border-danger/20 bg-danger/10 p-3">
      <div className="flex items-center gap-2">
        <XCircleIcon
          className="h-5 w-5 shrink-0 text-danger"
          aria-hidden="true"
        />
        <h3 className="text-sm font-medium text-danger">{message}</h3>
      </div>
    </div>
  );
};
