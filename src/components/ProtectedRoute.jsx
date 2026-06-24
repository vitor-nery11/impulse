import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#333] border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redireciona para o login se não estiver logado
    return <Navigate to="/" replace />;
  }

  return children;
}
