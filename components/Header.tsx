'use client';

import { useEffect, useState } from 'react';

export function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('ms-dashboard-theme');
    const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('ms-dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface bg-surface-strong/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-surface border border-accent-red shadow-xl shadow-accent-red/20">
              <svg viewBox="0 0 64 64" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sharkGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
                <path
                  d="M52 29c-4-3-10-5-15-5-8 0-14 3-20 6-4 2-8 4-12 3 1 5 3 8 7 10 5 3 10 2 15 0 5-2 10-4 15-5 5-1 10-2 14-4 1-1 1-3 1-5z"
                  fill="#020617"
                  stroke="url(#sharkGradient)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path d="M22 27c-1.2-1.5-3.5-4.5-6-5 1.5 2.5 3 5 6 5z" fill="#fff" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-accent-yellow font-semibold">MoraSpirit</p>
              <h1 className="text-2xl font-bold text-body">Member Dashboard</h1>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface bg-surface text-body shadow-sm transition hover:border-accent-red hover:bg-accent-red/10"
            aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="text-lg">{theme === 'dark' ? '☀' : '🌙'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
