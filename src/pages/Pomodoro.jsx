import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

const FlipPanel = ({ value }) => (
  <div className="relative bg-[#1c1c1e] rounded-2xl flex items-center justify-center px-4 py-8 shadow-2xl min-w-[140px] sm:min-w-[220px] overflow-hidden border border-white/5">
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
    <div className="absolute top-0 left-0 right-0 h-1/2 bg-black/20 rounded-t-2xl pointer-events-none"></div>
    <span className="text-[7rem] sm:text-[12rem] font-bold text-[#f5f5f5] tracking-tighter leading-none" style={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      {value}
    </span>
    <div className="absolute top-1/2 left-0 w-full h-[3px] sm:h-[5px] bg-[#0a0a0a] -translate-y-1/2 flex items-center justify-between shadow-[0_1px_2px_rgba(255,255,255,0.1)]">
      <div className="w-2 h-4 sm:h-6 bg-[#0a0a0a] rounded-r-md"></div>
      <div className="w-2 h-4 sm:h-6 bg-[#0a0a0a] rounded-l-md"></div>
    </div>
  </div>
);

const SettingsModal = ({ focusTime, breakTime, onSave, onClose }) => {
  const [f, setF] = useState(focusTime);
  const [b, setB] = useState(breakTime);
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[3rem]">
      <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
        <h3 className="text-xl font-bold text-white mb-6">Configurações do Timer</h3>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm text-[#888] mb-2 font-medium">Tempo de Foco (minutos)</label>
            <input 
              type="number" min="1" max="120" 
              value={f} 
              onChange={e => setF(parseInt(e.target.value) || 1)} 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-white/30" 
            />
          </div>
          <div>
            <label className="block text-sm text-[#888] mb-2 font-medium">Tempo de Pausa (minutos)</label>
            <input 
              type="number" min="1" max="60" 
              value={b} 
              onChange={e => setB(parseInt(e.target.value) || 1)} 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-bold outline-none focus:border-white/30" 
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-lg text-white hover:bg-white/5 transition-colors font-medium">Cancelar</button>
          <button onClick={() => onSave(f, b)} className="flex-1 py-3 rounded-lg bg-white text-black font-bold hover:bg-[#e5e5e5] transition-colors shadow-lg">Salvar</button>
        </div>
      </div>
    </div>
  );
};

const TaskCompleteModal = ({ taskTitle, onComplete, onSkip }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[3rem]">
    <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 text-center">
      <div className="w-16 h-16 bg-emerald-900/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Ciclo Concluído!</h3>
      <p className="text-[#888] mb-6">Você finalizou a tarefa: <br/><strong className="text-white mt-1 block">{taskTitle}</strong></p>
      
      <div className="flex flex-col gap-3">
        <button onClick={onComplete} className="w-full py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors shadow-lg">Sim, finalizei!</button>
        <button onClick={onSkip} className="w-full py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors font-medium">Ainda não</button>
      </div>
    </div>
  </div>
);

export function Pomodoro() {
  const [focusConfig, setFocusConfig] = useState(25);
  const [breakConfig, setBreakConfig] = useState(5);
  
  const [timeLeft, setTimeLeft] = useState(focusConfig * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus');
  const [cycles, setCycles] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const { tasks, toggleTask } = useTasks();
  const pendingTasks = tasks.filter(t => !t.completed);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [showTaskCompleteModal, setShowTaskCompleteModal] = useState(false);

  const FOCUS_TIME = focusConfig * 60;
  const BREAK_TIME = breakConfig * 60;

  const getMinutes = () => Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const getSeconds = () => (timeLeft % 60).toString().padStart(2, '0');

  const playBeep = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [440, 880, 1320]; 
      
      frequencies.forEach((freq, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.3 / (index + 1), context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 2.5);
      });
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      playBeep();
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(BREAK_TIME);
        setCycles(c => c + 1);
        if (selectedTaskId) setShowTaskCompleteModal(true);
      } else {
        setMode('focus');
        setTimeLeft(FOCUS_TIME);
      }
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, FOCUS_TIME, BREAK_TIME, selectedTaskId]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const handleSaveSettings = (newFocus, newBreak) => {
    setFocusConfig(newFocus);
    setBreakConfig(newBreak);
    setShowSettings(false);
    setIsRunning(false);
    setMode('focus');
    setTimeLeft(newFocus * 60);
  };

  const isFocus = mode === 'focus';

  return (
    <LayoutDashboard>
      <div className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-140px)] rounded-[3rem] bg-[#0a0a0a] p-6 animate-in fade-in duration-700 shadow-inner overflow-hidden">
        
        <div className="absolute top-8 right-8 sm:top-10 sm:right-12 z-20">
          <button 
            onClick={() => setShowSettings(true)}
            className="p-3 bg-transparent hover:bg-white/10 rounded-xl text-[#666] hover:text-white transition-colors"
            title="Configurações do Timer"
          >
            <Settings size={24} />
          </button>
        </div>

        {showSettings && (
          <SettingsModal 
            focusTime={focusConfig} 
            breakTime={breakConfig} 
            onSave={handleSaveSettings} 
            onClose={() => setShowSettings(false)} 
          />
        )}

        {showTaskCompleteModal && (
          <TaskCompleteModal 
            taskTitle={tasks.find(t => t.id === selectedTaskId)?.title}
            onComplete={() => {
              toggleTask(selectedTaskId, false);
              setSelectedTaskId(''); // Reset choice since it's done
              setShowTaskCompleteModal(false);
            }}
            onSkip={() => setShowTaskCompleteModal(false)}
          />
        )}
        
        <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">
          
          {/* Task Selector */}
          <div className="mb-8 w-full max-w-sm transition-opacity duration-500">
            <select 
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isRunning}
              className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/10 text-[#f5f5f5] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-white/20 font-medium disabled:opacity-50 appearance-none text-center cursor-pointer disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}
            >
              <option value="">🎯 Foco livre (Nenhuma tarefa)</option>
              {pendingTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mb-16 bg-[#1a1a1a]/80 backdrop-blur-sm p-1.5 rounded-xl border border-white/10 shadow-lg">
            <button 
              onClick={() => switchMode('focus')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isFocus 
                  ? 'bg-[#2a2a2c] text-white shadow-sm border border-white/10' 
                  : 'text-[#888] hover:text-[#bbb]'
              }`}
            >
              <Brain size={16} /> Foco
            </button>
            <button 
              onClick={() => switchMode('break')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isFocus 
                  ? 'bg-[#2a2a2c] text-white shadow-sm border border-white/10' 
                  : 'text-[#888] hover:text-[#bbb]'
              }`}
            >
              <Coffee size={16} /> Pausa
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-6 mb-16">
            <FlipPanel value={getMinutes()} />
            <div className="flex flex-col gap-4 sm:gap-8 pb-4">
              <div className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#e5e5e5] ${isRunning ? 'animate-pulse' : 'opacity-50'}`}></div>
              <div className={`w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#e5e5e5] ${isRunning ? 'animate-pulse' : 'opacity-50'}`}></div>
            </div>
            <FlipPanel value={getSeconds()} />
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={toggleTimer}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white text-black hover:scale-105 hover:bg-[#f0f0f0] transition-all shadow-xl"
            >
              {isRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-2" />}
            </button>

            <button 
              onClick={resetTimer}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2c] border border-white/10 transition-colors shadow-lg"
              title="Zerar Timer"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          
          <div className="mt-12 text-sm font-bold text-[#111] bg-white/90 px-4 py-1.5 rounded-full tracking-widest uppercase shadow-md">
            Ciclos Completos: {cycles}
          </div>

        </div>
      </div>
    </LayoutDashboard>
  );
}
