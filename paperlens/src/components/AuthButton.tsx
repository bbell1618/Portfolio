"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [usage, setUsage] = useState<{
    used: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
  }, [session]);

  if (status === "loading") {
    return (
      <div className="h-9 w-24 bg-navy-lighter rounded-lg animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {usage && (
          <span className="text-xs text-slate-400">
            {usage.used}/{usage.limit} analyses used
          </span>
        )}
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-7 h-7 rounded-full"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs text-accent font-semibold">
              {(session.user.name?.[0] || session.user.email?.[0] || "?").toUpperCase()}
            </div>
          )}
          <span className="text-sm text-slate-300 hidden sm:inline">
            {session.user.name || session.user.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-navy-lighter"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {usage && (
        <span className="text-xs text-slate-400">
          {usage.used}/{usage.limit} free analyses used
        </span>
      )}
      <button
        onClick={() => signIn()}
        className="text-sm font-medium text-white bg-accent hover:bg-accent-hover px-4 py-2 rounded-lg transition-all"
      >
        Sign In
      </button>
    </div>
  );
}
