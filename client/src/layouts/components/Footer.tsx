import { Link } from '@heroui/react';

function Footer() {
  return (
    <footer className="mt-auto w-full flex items-center justify-center py-3">
      <Link className="flex items-center gap-1 text-current" href="#" title="heroui.com homepage">
        <p className="text-primary">Alcalá City</p>
      </Link>
    </footer>
  );
}

export default Footer;
