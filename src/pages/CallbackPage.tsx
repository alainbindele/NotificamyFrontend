import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleSignInCallback } from '@logto/react';
import { Loader2 } from 'lucide-react';

export const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 Callback Page Debug:', {
      fullUrl: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      origin: window.location.origin,
    });

    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      console.error('❌ Error in callback URL:', {
        error: errorParam,
        description: errorDescription,
      });
    }
  }, []);

  const { isLoading, error } = useHandleSignInCallback(() => {
    console.log('✅ Sign in callback successful, navigating to dashboard');
    navigate('/dashboard', { replace: true });
  });

  useEffect(() => {
    if (error) {
      console.error('Callback error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      navigate('/', { replace: true });
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-400" />
        <p className="text-gray-300">Completing sign in...</p>
      </div>
    </div>
  );
};
