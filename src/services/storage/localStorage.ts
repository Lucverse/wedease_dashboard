interface User {
    email: string;
    username: string;
    role?: string;
    department?: string | null;
    isGoogleAuth?: boolean;
  }
  
  class StorageService {
    // Token management
    setToken(token: string): void {
      try {
        localStorage.setItem('token', JSON.stringify(token));
      } catch (error) {
        console.error('Failed to store token:', error);
      }
    }
  
    getToken(): string | null {
      try {
        const token = localStorage.getItem('token');
        return token ? JSON.parse(token) : null;
      } catch (error) {
        console.error('Failed to retrieve token:', error);
        return null;
      }
    }
  
    // User data management
    setUser(user: User): void {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to store user data:', error);
      }
    }
  
    getUser(): User | null {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Failed to retrieve user data:', error);
        return null;
      }
    }
  
    // Session management
    setSessionItem(key: string, value: string): void {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.error(`Failed to store session item ${key}:`, error);
      }
    }
  
    getSessionItem(key: string): string | null {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.error(`Failed to retrieve session item ${key}:`, error);
        return null;
      }
    }
  
    removeSessionItem(key: string): void {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove session item ${key}:`, error);
      }
    }
  
    // Clear all auth data
    clearAuthData(): void {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('preAuthLocation');
      } catch (error) {
        console.error('Failed to clear auth data:', error);
      }
    }
  
    // Clear all storage
    clearAll(): void {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.error('Failed to clear all storage:', error);
      }
    }
  
    // Check if storage is available
    isStorageAvailable(): boolean {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    }
  }
  
  // Create and export instance
  export const storageService = new StorageService();
  
  // Also export the class for potential extension
  export { StorageService };
  
  // Default export
  export default storageService;