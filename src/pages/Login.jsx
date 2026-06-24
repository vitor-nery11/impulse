import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AudioLines } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 sm:px-6">
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black mb-6">
            <AudioLines size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-[#888]">
            Faça login na sua conta Impulse.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <Input 
            label="E-mail" 
            id="email" 
            type="email" 
            autoComplete="email" 
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Senha" 
            id="password" 
            type="password" 
            autoComplete="current-password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between pt-2 pb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-[#1a1a1a] text-white focus:ring-white/20 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#ccc] cursor-pointer">
                Lembrar de mim
              </label>
            </div>

            <a href="#" className="text-sm text-[#888] hover:text-white transition-colors">
              Esqueci a senha
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-white text-black font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#555]">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-medium text-white hover:underline">
            Criar agora
          </Link>
        </p>

      </div>
    </div>
  );
}
