import { AppHeader } from "@/components/AppHeader";
import { ReportForm } from "@/components/ReportForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader showLogout />
      <main className="flex-1 bg-background">
        <ReportForm />
      </main>
    </div>
  );
}
