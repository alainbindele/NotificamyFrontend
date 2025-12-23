import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogto } from '@logto/react';
import { Loader2 } from 'lucide-react';

export const CallbackPage = () => {
  const { isAuthenticated, isLoading, handleSignInCallback } = useLogto();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      handleSignInCallback().then(() => {
        navigate('/dashboard');
      }).catch((error) => {
        console.error('Callback error:', error);
        navigate('/');
      });
    }
  }, [isLoading, handleSignInCallback, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fuchsia-400" />
        <p className="text-gray-300">Completing sign in...</p>
      </div>
    </div>
  );
};
