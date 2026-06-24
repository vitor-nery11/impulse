import React, { useState, useEffect } from 'react';
import { LayoutDashboard } from '../components/LayoutDashboard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckSquare, Circle, Trash2, Plus, ListTodo } from 'lucide-react';

export function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;

    const taskTitle = newTask.trim();
    setNewTask('');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: user.id, title: taskTitle }])
      .select()
      .single();

    if (error) {
      console.error("Erro no Supabase:", error);
      alert("Erro ao salvar: " + error.message);
      setNewTask(taskTitle); // devolve o texto se falhou
    }

    if (data) {
      setTasks([data, ...tasks]);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    
    await supabase
      .from('tasks')
      .update({ completed: !currentStatus })
      .eq('id', id);
  };

  const deleteTask = async (id) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== id));
    
    await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <LayoutDashboard>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shrink-0">
            <ListTodo size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#f5f5f5]">Tarefas</h1>
            <p className="text-[#888] mt-1">
              {pendingCount === 0 
                ? "Tudo limpo por aqui!" 
                : `Você tem ${pendingCount} tarefa${pendingCount > 1 ? 's' : ''} pendente${pendingCount > 1 ? 's' : ''}.`
              }
            </p>
          </div>
        </div>

        <div className="bg-[#141414] rounded-3xl p-6 sm:p-8 shadow-sm border border-white/5 mb-8">
          <form onSubmit={handleAddTask} className="flex gap-3">
            <Input 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="O que você precisa fazer hoje?"
              className="flex-1 bg-[#0a0a0a]"
            />
            <Button type="submit" disabled={!newTask.trim()} className="gap-2 shrink-0">
              <Plus size={20} />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-[#141414] rounded-3xl border border-white/5 border-dashed">
            <CheckSquare size={48} className="mx-auto text-[#333] mb-4" />
            <h2 className="text-xl font-bold text-[#f5f5f5] mb-2">Nenhuma tarefa criada</h2>
            <p className="text-[#888]">Adicione sua primeira tarefa no campo acima.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  task.completed 
                    ? 'bg-[#0a0a0a] border-transparent opacity-60' 
                    : 'bg-[#141414] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="text-[#555] hover:text-white transition-colors shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare size={24} className="text-white" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <span className={`text-lg truncate transition-all duration-300 ${
                    task.completed ? 'text-[#555] line-through' : 'text-[#f5f5f5]'
                  }`}>
                    {task.title}
                  </span>
                </div>
                
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#555] hover:text-red-500 transition-all p-2 rounded-xl hover:bg-[#1e1e1e] shrink-0"
                  title="Excluir tarefa"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}
