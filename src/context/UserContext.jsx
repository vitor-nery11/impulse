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
    dailyNewCards: 20
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats({
        streakDays: 0,
        lastStudyDate: null,
        totalStudySeconds: 0,
        dailyNewCards: 20
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
      setStats({
        streakDays: data.streak_days || 0,
        lastStudyDate: data.last_study_date,
        totalStudySeconds: data.total_study_seconds || 0,
        dailyNewCards: data.daily_new_cards || 20
      });
    } else if (error && error.code === 'PGRST116') {
      await supabase.from('user_stats').insert([{ user_id: user.id, daily_new_cards: 20 }]);
      setStats({ streakDays: 0, lastStudyDate: null, totalStudySeconds: 0, dailyNewCards: 20 });
    }
  };

  const updateStudyMode = async (limit) => {
    setStats(prev => ({ ...prev, dailyNewCards: limit }));
    if (user) {
      await supabase.from('user_stats').update({ daily_new_cards: limit }).eq('user_id', user.id);
    }
  };

  const recordStudySession = async (secondsSpent) => {
    setStats(prev => {
      const today = new Date();
      const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      
      let newStreak = prev.streakDays;
      let newLastStudyDate = prev.lastStudyDate;

      if (!prev.lastStudyDate) {
        newStreak = 1;
        newLastStudyDate = todayStr;
      } else if (prev.lastStudyDate !== todayStr) {
        const lastDate = new Date(prev.lastStudyDate);
        const currentDate = new Date(todayStr);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
        
        newLastStudyDate = todayStr;
      }

      const newStats = {
        ...prev,
        streakDays: newStreak,
        lastStudyDate: newLastStudyDate,
        totalStudySeconds: prev.totalStudySeconds + secondsSpent
      };

      if (user) {
        supabase.from('user_stats')
          .update({
            streak_days: newStreak,
            last_study_date: newLastStudyDate,
            total_study_seconds: prev.totalStudySeconds + secondsSpent
          })
          .eq('user_id', user.id)
          .then();
      }

      return newStats;
    });
  };

  const getFormattedStudyTime = () => {
    if (stats.totalStudySeconds < 60) {
      return `${stats.totalStudySeconds}s`;
    }
    const totalMinutes = Math.floor(stats.totalStudySeconds / 60);
    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <UserContext.Provider value={{ stats, recordStudySession, getFormattedStudyTime, updateStudyMode }}>
      {children}
    </UserContext.Provider>
  );
}
