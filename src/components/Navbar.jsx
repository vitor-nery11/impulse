import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { BookOpen } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-bold text-slate-900">LinguaCards</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Início</Link>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Recursos</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Como funciona</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Entrar
            </Link>
            <Link to="/register">
              <Button size="sm">Começar agora</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
