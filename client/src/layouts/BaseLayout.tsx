import Footer from '@/layouts/components/Footer';
import { Navbar } from '@/layouts/components/header/Navbar';

interface BaseLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function BaseLayout({
  children,
  showNavbar = true,
  showFooter = true,
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center">{children}</div>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
