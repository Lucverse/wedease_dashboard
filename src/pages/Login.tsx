import  { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import WedeaseLogo from "../assets/wedease.svg";

const Login = () => {
  const { loginWithGoogle, isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsProcessing(false);
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
      const errorMessages = {
        access_denied: 'Access denied. Authentication failed.',
        token_generation_failed: 'Authentication failed. Please try again.',
        authentication_failed:
          'Authentication failed. Please contact support if this continues.',
      };

      setError(
        (errorMessages as Record<string, string>)[error] ||
          'Authentication error. Please try again.'
      );
      setIsProcessing(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlParams.get('token')) {
      setIsProcessing(true);
    }
  }, []);

  const handleGoogleLogin = () => {
    setIsProcessing(true);
    setError('');
    loginWithGoogle();
  };

  if (isLoading || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
          <p className="text-gray-700">
            {isProcessing ? 'Processing authentication...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-[#8B0000]/30 p-8">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          {/* Replace with your actual logo */}
          <img
            src={WedeaseLogo}
            alt="Wedease"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#8B0000]">
            Wedease Admin Dashboard
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="ml-3 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isProcessing}
          className="w-full flex justify-center items-center py-3 px-4 border border-[#8B0000] hover:cursor-pointer rounded-md shadow-sm text-sm font-medium text-[#8B0000] bg-white hover:bg-[#8B0000]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#8B0000] mr-2"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="mr-3"
              >
                <path
                  fill="#EA4335"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
