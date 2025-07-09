import React, { useState } from 'react';
import authService from './authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, accessToken: string, refreshToken: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      const endpoint = isLogin 
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login` 
  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || 'Authentication failed');
        setLoading(false);
        return;
      }
      
      // Store tokens using auth service
      authService.setTokens(data.accessToken, data.refreshToken, data.user);
      
      onAuthSuccess(data.user, data.accessToken, data.refreshToken);
      setLoading(false);
      onClose();
    } catch (err) {
      console.log('error: ', err);
      setError('Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Sign In' : 'Register'}</h2>
        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-2" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button className="text-blue-600 underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 
