import { Spinner } from '@heroui/react';

function Loader() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner variant="gradient" size="lg" />
    </div>
  );
}

export default Loader;
