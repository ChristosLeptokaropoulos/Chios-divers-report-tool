import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";

interface Props {
  showLogout?: boolean;
}

export function AppHeader({ showLogout = false }: Props) {
  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
        <Image
          src="/logo.png"
          alt="Chios Commercial Divers"
          width={44}
          height={44}
          className="rounded-full bg-white p-0.5"
          priority
        />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-wide sm:text-base">
            Chios Commercial Divers
          </p>
          <p className="text-xs text-white/70">Service Report Tool</p>
        </div>
        {showLogout && (
          <div className="ml-auto">
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
