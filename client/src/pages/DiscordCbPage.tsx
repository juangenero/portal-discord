import { useAuth } from '@/modules/auth/AuthContext';
import { Spinner } from '@heroui/react';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function DiscordCbPage() {
  const { callback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cbRef = useRef(false); // Para evitar varias llamadas al método callback

  useEffect(() => {
    if (code && state && !cbRef.current) {
      cbRef.current = true;
      callback(code, state);
    } else if (!code || !state) {
      navigate('/', { replace: true });
    }
  }, [code, state, callback]);

  // Loader que se muestra cuando mientras se está realizando el callback o la redirección
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner variant="gradient" size="lg" />
    </div>
  );
}
