import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";

interface Props {
  showLogout?: boolean;
}

export function AppHeader({ showLogout = false }: Props) {
  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
        <Image
          src="/logo.png"
          alt="Chios Commercial Divers"
          width={64}
          height={64}
          className="rounded-full bg-white p-0.5"
          priority
        />
        <div className="leading-tight">
          <p className="text-lg font-semibold tracking-wide sm:text-xl">
            Chios Commercial Divers
          </p>
          <p className="text-sm text-white/70">Service Report Tool</p>
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
