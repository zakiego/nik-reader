import { signOut } from "next-auth/react";

export const Logout = () => {
  return (
    <button
      onClick={() => signOut()}
      className="rounded bg-gray-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
    >
      Logout
    </button>
  );
};
