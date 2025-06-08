import { useAuth } from '@/modules/auth/AuthContext';
import { Spinner } from '@heroui/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function DiscordCbPage() {
  const { exchangeCode } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (code && state) {
      exchangeCode(code, state);
    }

    navigate('/');
  }, [code, state, exchangeCode]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner classNames={{ label: 'text-foreground mt-4' }} variant="gradient" size="lg" />
    </div>
  );
}
