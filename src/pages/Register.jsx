import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AudioLines } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
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
            Criar uma conta
          </h1>
          <p className="text-sm text-[#888]">
            Junte-se ao Impulse hoje mesmo.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleRegister}>
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <Input 
            label="Nome completo" 
            id="name" 
            type="text" 
            autoComplete="name" 
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            autoComplete="new-password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 mt-6 rounded-lg bg-white text-black font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[#555]">
          Já tem uma conta?{' '}
          <Link to="/" className="font-medium text-white hover:underline">
            Entrar
          </Link>
        </p>

      </div>
    </div>
  );
}
