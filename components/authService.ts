// Authentication service with refresh token support
class AuthService {
  private static instance: AuthService;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Get tokens from localStorage
  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('refreshToken');
  }

  getUser(): any {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Store tokens
  setTokens(accessToken: string, refreshToken: string, user: any): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear all auth data
  clearAuth(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken, this.getUser());
      return { accessToken: data.accessToken, refreshToken: data.refreshToken };
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearAuth();
  }

  // API call with automatic token refresh
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // If token expired, try to refresh
      if (response.status === 401) {
        if (this.isRefreshing) {
          // Wait for the current refresh to complete
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          });
        }

        this.isRefreshing = true;

        try {
          const { accessToken: newAccessToken } = await this.refreshToken();
          
          // Retry the original request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newAccessToken}`,
            },
          });

          // Process queued requests
          this.failedQueue.forEach(({ resolve }) => {
            resolve(fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`,
              },
            }));
          });
          this.failedQueue = [];

          this.isRefreshing = false;
          return retryResponse;
        } catch (refreshError) {
          this.failedQueue.forEach(({ reject }) => {
            reject(refreshError);
          });
          this.failedQueue = [];
          this.isRefreshing = false;
          this.clearAuth();
          throw refreshError;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getUser();
  }

  // Validate current session
  async validateSession(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const response = await this.fetchWithAuth('http://localhost:5000/api/auth/me');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default AuthService.getInstance(); 