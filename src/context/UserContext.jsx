import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    streakDays: 0,
    lastStudyDate: null,
    totalStudySeconds: 0,
    dailyNewCards: 20,
    cardsStudiedToday: 0,
    studyHistory: []
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats({
        streakDays: 0,
        lastStudyDate: null,
        totalStudySeconds: 0,
        dailyNewCards: 20,
        cardsStudiedToday: 0,
        studyHistory: []
      });
    }
  }, [user]);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      const today = new Date();
      const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const isToday = data.last_study_date === todayStr;

      setStats({
        streakDays: data.streak_days || 0,
        lastStudyDate: data.last_study_date,
        totalStudySeconds: data.total_study_seconds || 0,
        dailyNewCards: data.daily_new_cards || 20,
        cardsStudiedToday: isToday ? (data.cards_studied_today || 0) : 0,
        studyHistory: data.study_history || []
      });

      // Se virou o dia, reseta no banco
      if (!isToday && user) {
        supabase.from('user_stats').update({ cards_studied_today: 0 }).eq('user_id', user.id).then();
      }
    } else if (error && error.code === 'PGRST116') {
      await supabase.from('user_stats').insert([{ user_id: user.id, daily_new_cards: 20 }]);
      setStats({ streakDays: 0, lastStudyDate: null, totalStudySeconds: 0, dailyNewCards: 20, cardsStudiedToday: 0, studyHistory: [] });
    }
  };

  const updateStudyMode = async (limit) => {
    setStats(prev => ({ ...prev, dailyNewCards: limit }));
    if (user) {
      await supabase.from('user_stats').update({ daily_new_cards: limit }).eq('user_id', user.id);
    }
  };

  const incrementDailyCard = async () => {
    if (!user) return;
    
    setStats(prev => {
      const today = new Date();
      const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      const newCount = prev.cardsStudiedToday + 1;
      let newStreak = prev.streakDays;
      let newHistory = [...prev.studyHistory];

      // Atingiu a meta exata de hoje
      if (newCount === prev.dailyNewCards) {
        if (!prev.lastStudyDate) {
          newStreak = 1;
        } else if (prev.lastStudyDate !== todayStr) {
          const lastDate = new Date(prev.lastStudyDate);
          const currentDate = new Date(todayStr);
          const diffDays = Math.ceil(Math.abs(currentDate - lastDate) / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) newStreak += 1;
          else if (diffDays > 1) newStreak = 1;
        }
        
        if (!newHistory.includes(todayStr)) {
          newHistory.push(todayStr);
        }
        
        supabase.from('user_stats').update({
          cards_studied_today: newCount,
          streak_days: newStreak,
          last_study_date: todayStr,
          study_history: newHistory
        }).eq('user_id', user.id).then();
        
        return {
          ...prev,
          cardsStudiedToday: newCount,
          streakDays: newStreak,
          lastStudyDate: todayStr,
          studyHistory: newHistory
        };
      }

      // Apenas incrementa contador
      supabase.from('user_stats').update({ cards_studied_today: newCount }).eq('user_id', user.id).then();
      
      return {
        ...prev,
        cardsStudiedToday: newCount
      };
    });
  };

  const recordStudySession = async (secondsSpent) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        totalStudySeconds: prev.totalStudySeconds + secondsSpent
      };

      if (user) {
        supabase.from('user_stats')
          .update({ total_study_seconds: prev.totalStudySeconds + secondsSpent })
          .eq('user_id', user.id)
          .then();
      }
      return newStats;
    });
  };

  const getFormattedStudyTime = () => {
    if (stats.totalStudySeconds < 60) return `${stats.totalStudySeconds}s`;
    const totalMinutes = Math.floor(stats.totalStudySeconds / 60);
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <UserContext.Provider value={{ stats, recordStudySession, getFormattedStudyTime, updateStudyMode, incrementDailyCard }}>
      {children}
    </UserContext.Provider>
  );
}
