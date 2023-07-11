"use client";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

const dummyLinkClassname = cn(
  "flex items-center text-base transition-colors hover:text-foreground/80"
);

interface DummyNavProps {
  authenticated?: boolean;
}

export function DummyNav({ authenticated = false }: DummyNavProps) {
  // TODO: interesting
  const segment = useSelectedLayoutSegment();

  return (
    <div className="container flex h-full w-full items-center justify-between">
      <Link href="/" className="flex flex-1 justify-between">
        <Logo />
      </Link>
      <nav className="flex items-center gap-6">
        {!authenticated ? (
          <>
            <Link
              href="/login"
              className={cn(
                dummyLinkClassname,
                segment === "login" && "font-bold"
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                dummyLinkClassname,
                segment === "register" && "font-bold"
              )}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/patients" className={dummyLinkClassname}>
              Patients
            </Link>
            <button
              className={dummyLinkClassname}
              onClick={() => void signOut()}
            >
              Logout
            </button>
          </>
        )}
      </nav>
      <div className="flex flex-1 justify-end">
        <ModeToggle />
      </div>
    </div>
  );
}
