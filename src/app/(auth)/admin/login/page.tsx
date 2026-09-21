'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 group">
            <div className="w-24 h-16 relative mx-auto mb-1 transition-transform group-hover:scale-105">
              <Image
                src="/logo-emblem.png"
                alt="House Of Karma Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold font-heading text-[#1E2732] block">
              HOUSE OF KARMA
            </span>
            <span className="text-xs tracking-widest uppercase text-[#B85C38] font-semibold">
              Leh &middot; Ladakh
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-[#2D3748] mt-2">Admin Portal</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-[#E0C097] focus:border-[#B85C38] focus:ring-1 focus:ring-[#B85C38] rounded-xl p-3 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4A5568] mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E0C097] focus:border-[#B85C38] focus:ring-1 focus:ring-[#B85C38] rounded-xl p-3 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B85C38] hover:bg-[#5C3D2E] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
