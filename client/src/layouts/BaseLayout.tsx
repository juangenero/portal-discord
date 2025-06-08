import Footer from '@/layouts/components/Footer';
import { Navbar } from '@/layouts/components/header/Navbar';

interface BaseLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function BaseLayout({ children, showNavbar = true }: BaseLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
