import  { createContext, useContext, useState, useEffect, useCallback } from 'react';

// @ts-ignore
import  authAPI  from '../services/googleService/authService';
import storageService from '../services/storage/localStorage';

type User = {
  email: string;
  username: string;
  role?: string;
  department?: string | null;
  isGoogleAuth?: boolean;
};


const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  loginWithGoogle: () => void;
  logout: () => void;
  refreshUser: () => Promise<User>;
  updateUser: (userData: User) => void;
  setUserData: (userData: User) => boolean;
  hasValidToken: () => boolean;
  getAuthHeader: () => { Authorization?: string };
  clearAuth: () => void;
}>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  loginWithGoogle: () => {},
  logout: () => {},
  refreshUser: async () => {
    throw new Error('refreshUser not implemented');
  },
  updateUser: () => {},
  setUserData: () => false,
  hasValidToken: () => false,
  getAuthHeader: () => ({}),
  clearAuth: () => {},
});

export const AuthProvider = ({ children }:any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const setUserData = useCallback((userData: User) => {
    if (userData && userData.email && userData.username) {
      console.log('Setting user data:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      storageService.setUser(userData);
      
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
        await handleOAuthCallback();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const checkAuth = async () => {
    const token = storageService.getToken();
    const userData = storageService.getUser();
    
    if (token && userData) {
      try {
        const response = await authAPI.verifyToken();
        
        if (response.valid && response.user) {
          console.log('Token verified, user authenticated:', response.user.email);
          setUserData(response.user);
        } else {
          console.log('Token verification failed, clearing auth');
          clearAuth();
        }
      } catch (error) {
        console.error('Token verification error:', error);
        if (userData.email && userData.username) {
          console.log('Using cached user data:', userData.email);
          setUserData(userData);
        } else {
          clearAuth();
        }
      }
    }
  };

  const handleOAuthCallback = async () => {
    const oauthData = authAPI.parseOAuthCallback();
    const { token, email, username, role, department, user: userDataParam, error } = oauthData;

    if (token && email && username) {
      console.log('Google OAuth success, processing user data');
      
      let userData = {
        email: decodeURIComponent(email),
        username: decodeURIComponent(username),
        role: role || 'viewer',
        department: department ? decodeURIComponent(department) : null,
        isGoogleAuth: true
      };

      // Use complete user data if available
      if (userDataParam) {
        try {
          const decodedUserData = JSON.parse(decodeURIComponent(userDataParam));
          userData = { ...userData, ...decodedUserData };
        } catch (parseError) {
          console.warn('Failed to parse user data parameter:', parseError);
        }
      }

      // Store token and user data
      storageService.setToken(token);
      setUserData(userData);

      console.log('OAuth login successful:', {
        email: userData.email,
        role: userData.role,
        department: userData.department
      });

      // Clear URL parameters
      authAPI.clearOAuthParams();
    } else if (error) {
      let errorMessage = 'Authentication error. Please try again.';
      if (error === 'access_denied') {
        errorMessage = 'Access denied. Authentication failed.';
      } else if (error === 'token_generation_failed') {
        errorMessage = 'Authentication failed. Please try again.';
      }

      console.error('OAuth error:', errorMessage);
      clearAuth();
      
      authAPI.clearOAuthParams();
    }
  };

  const loginWithGoogle = () => {
    console.log('Initiating Google login...');
    
    setIsLoading(true);
    
    storageService.setSessionItem('preAuthLocation', window.location.pathname);
    
    authAPI.initiateGoogleLogin();
  };

  const logout = async () => {
    console.log('Logging out user');
    
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Backend logout failed:', error);
    }

    clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    
    window.location.href = '/';
  };

  const clearAuth = () => {
    storageService.clearAuthData();
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      const userData = await authAPI.refreshUserData();
      setUserData(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      clearAuth();
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const updateUser = useCallback((userData: User) => {
    setUserData(userData);
  }, [setUserData]);

  const hasValidToken = useCallback(() => {
    const token = storageService.getToken();
    const user = storageService.getUser();
    return !!(token && user && user.email);
  }, []);

  // Get authorization header for API calls
  const getAuthHeader = useCallback(() => {
    const token = storageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const value = {
    // Auth state
    isAuthenticated,
    isLoading,
    user,
    
    // Auth methods
    loginWithGoogle,
    logout,
    refreshUser,
    updateUser,
    
    // Utility methods
    setUserData,
    hasValidToken,
    getAuthHeader,
    
    // Storage shortcuts
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};