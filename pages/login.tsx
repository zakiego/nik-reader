import { XCircleIcon } from "@heroicons/react/20/solid";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login = () => {
  const router = useRouter();
  const [secretCode, setSecretCode] = useState("");
  const [errorMessages, setErrorMessages] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const login = await signIn("credentials", {
      secretCode: secretCode,
      callbackUrl: `/`,
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
      <title>Login</title>
      <div className="flex min-h-screen flex-1 bg-gray-950 justify-center">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-white space-y-3">
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight ">
                Sign in for exclusive access
              </h2>
              <p>
                Ping me at{" "}
                <a
                  href="https://twitter.com/zakiego"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-500"
                >
                  @zakiego
                </a>{" "}
                for the secret code 🤣
              </p>
            </div>

            <div className="mt-10">
              <div>
                <div className="mb-4">
                  {errorMessages && <Alert message={errorMessages} />}
                </div>
                <form className="space-y-6" autoComplete="off">
                  <div>
                    <label
                      htmlFor="secretCode"
                      className="block text-sm font-medium leading-6 text-white/80"
                    >
                      Secret Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="secretCode"
                        name="secretCode"
                        type="password"
                        placeholder="Enter your secret code"
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setSecretCode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      onClick={handleLogin}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
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
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
        </div>
      </div>
    </div>
  );
};
