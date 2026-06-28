import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const TasksContext = createContext();

export function useTasks() {
  return useContext(TasksContext);
}

export function TasksProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  const addTask = async (title) => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: user.id, title }])
      .select()
      .single();

    if (data) {
      setTasks([data, ...tasks]);
      return data;
    }
    return null;
  };

  const toggleTask = async (id, currentStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    await supabase.from('tasks').update({ completed: !currentStatus }).eq('id', id);
  };

  const deleteTask = async (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}
