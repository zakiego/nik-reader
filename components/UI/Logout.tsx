import { signOut } from "next-auth/react";

export const Logout = () => {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold text-content shadow-sm transition-colors hover:bg-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      Logout
    </button>
  );
};
