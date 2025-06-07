import { Navbar } from "@/components/navbar";
import { Link } from "@heroui/link";

interface BaseLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function BaseLayout({
  children,
  showNavbar = true,
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <footer className="mt-auto w-full flex items-center justify-center py-3">
        <Link
          className="flex items-center gap-1 text-current"
          href="#"
          title="heroui.com homepage"
        >
          <p className="text-primary">Alcalá City</p>
        </Link>
      </footer>
    </div>
  );
}