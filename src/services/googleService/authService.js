const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${JSON.parse(token)}` })
    };
  }

  // Helper method for API requests
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { data, status: response.status };
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Verify token with backend
  async verifyToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${this.baseURL}/auth/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser() {
    return this.apiRequest('/api/user/profile');
  }

  // Logout user
  async logout() {
    try {
      await this.apiRequest('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      // Continue with logout even if backend call fails
      console.warn('Backend logout failed:', error);
    }
  }

  // Refresh user data
  async refreshUserData() {
    try {
      const response = await this.getCurrentUser();
      return response.data.user;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  }

  // Admin: Get all users (requires admin role)
  async getAllUsers() {
    return this.apiRequest('/api/admin/users');
  }

  // Admin: Update user role (requires super_admin role)
  async updateUserRole(userId, newRole) {
    return this.apiRequest(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    });
  }

  // Admin: Deactivate user (requires admin role)
  async deactivateUser(userId) {
    return this.apiRequest(`/api/admin/users/${userId}/deactivate`, {
      method: 'PUT'
    });
  }

  // Admin: Activate user (requires admin role)
  async activateUser(userId) {
    return this.apiRequest(`/api/admin/users/${userId}/activate`, {
      method: 'PUT'
    });
  }

  // Google OAuth redirect
  initiateGoogleLogin() {
    const authUrl = `${this.baseURL}/auth/google`;
    console.log('Redirecting to Google OAuth:', authUrl);
    window.location.href = authUrl;
  }

  // Handle OAuth callback (used internally by AuthContext)
  parseOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      token: urlParams.get('token'),
      email: urlParams.get('email'),
      username: urlParams.get('username'),
      role: urlParams.get('role'),
      department: urlParams.get('department'),
      user: urlParams.get('user'),
      error: urlParams.get('error')
    };
  }

  // Clear OAuth parameters from URL
  clearOAuthParams() {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

export const authAPI = new AuthService();

export const authService = {
  verifyToken: () => authAPI.verifyToken(),
  getCurrentUser: () => authAPI.getCurrentUser(),
  logout: () => authAPI.logout(),
  refreshUserData: () => authAPI.refreshUserData(),
  getAllUsers: () => authAPI.getAllUsers(),
  updateUserRole: (userId, newRole) => authAPI.updateUserRole(userId, newRole),
  deactivateUser: (userId) => authAPI.deactivateUser(userId),
  activateUser: (userId) => authAPI.activateUser(userId),
  healthCheck: () => authAPI.healthCheck(),
  initiateGoogleLogin: () => authAPI.initiateGoogleLogin(),
  parseOAuthCallback: () => authAPI.parseOAuthCallback(),
  clearOAuthParams: () => authAPI.clearOAuthParams()
};

export default authAPI;