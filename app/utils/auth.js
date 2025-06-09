import jwt from 'jsonwebtoken';

// User management functions
export function getUser() {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export function setUser(userData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('user', JSON.stringify(userData));
    // Also store the token separately
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  } catch (error) {
    console.error('Error setting user:', error);
  }
}

export function removeUser() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing user:', error);
  }
}

// Route protection
export function requireAuth(pathname) {
  const publicRoutes = ['/', '/login', '/register', '/education'];
  return !publicRoutes.includes(pathname);
}

// Token management
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Auth API calls
export async function loginUser({ username, password }) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success && data.user) {
      setUser(data.user);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Gagal melakukan login' };
  }
}

export async function registerUser({ username, email, password }) {
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Gagal melakukan registrasi' };
  }
}

// Doctor-specific auth
export const doctorAuth = {
  checkAuth: (user) => {
    if (!user) return false;
    return user.role === 'doctor';
  },

  protectRoute: (router) => {
    const user = getUser();
    if (!user || user.role !== 'doctor') {
      router.replace('/login');
      return false;
    }
    return true;
  },

  isDoctorRoute: (pathname) => {
    const doctorRoutes = ['/doctor', '/doctor/dashboard'];
    return doctorRoutes.some(route => pathname.startsWith(route));
  }
};

// API request helper
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (res.status === 401) {
      removeUser();
      window.location.href = '/login';
      return null;
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return { success: false, error: 'Terjadi kesalahan pada server' };
  }
};

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  // Handle direct API URLs
  if (imageUrl.startsWith('/api/images/')) return imageUrl;
  // Handle full URLs
  if (imageUrl.startsWith('http')) return imageUrl;
  // Extract ID and return API URL
  const id = imageUrl.split('/').pop();
  return `/api/images?id=${id}`;
};