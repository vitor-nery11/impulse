import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Button } from '../components/Button';
import { useUser } from '../context/UserContext';

export function Settings() {
  const { stats, updateStudyMode } = useUser();
  const [localLimit, setLocalLimit] = useState(stats.dailyNewCards || 20);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalLimit(stats.dailyNewCards || 20);
  }, [stats.dailyNewCards]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateStudyMode(localLimit);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <LayoutDashboard>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f5f5f5]">Configurações</h1>
          <p className="text-[#888] mt-2">Gerencie suas preferências de aprendizado e conta.</p>
        </div>

        <div className="space-y-6">

          <div className="bg-[#141414] rounded-3xl p-8 shadow-sm border border-white/5">
            <h2 className="text-xl font-bold text-[#f5f5f5] mb-6 border-b border-white/5 pb-4">Metas e Notificações</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#888] mb-2">Meta Diária de Estudos</label>
                <select 
                  value={localLimit}
                  onChange={(e) => setLocalLimit(parseInt(e.target.value))}
                  className="w-full max-w-xs rounded-xl border border-[#333] bg-[#0a0a0a] text-[#f5f5f5] px-4 py-3 focus:ring-1 focus:ring-white/20 focus:border-white/30 outline-none transition-colors"
                >
                  <option value={10}>10 novos (Relaxado)</option>
                  <option value={20}>20 novos (Regular)</option>
                  <option value={40}>40 novos (Intenso)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-white/5 mt-4">
                <div>
                  <h4 className="font-medium text-[#f5f5f5]">Lembretes diários</h4>
                  <p className="text-sm text-[#888]">Receba notificações push para manter sua ofensiva.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-[#1a1a1a] border border-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#888] peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f5f5f5]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] rounded-3xl p-8 shadow-sm border border-white/5">
            <h2 className="text-xl font-bold text-[#f5f5f5] mb-6 border-b border-white/5 pb-4">Conta</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#f5f5f5]">Sair da conta</h4>
                <p className="text-sm text-[#888]">Desconectar sua sessão atual.</p>
              </div>
              <Link to="/">
                <Button variant="danger">Sair do App</Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 items-center">
            {saved && <span className="text-emerald-400 text-sm font-bold">Salvo com sucesso!</span>}
            <Button variant="ghost" onClick={() => setLocalLimit(stats.dailyNewCards || 20)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}
