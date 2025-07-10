import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNotifyMeAPI } from './useNotifyMeAPI';
import { UserProfile, UserStatistics, NotificationQuery, QueryStatistics } from '../types/api';

export const useDashboardData = () => {
  const { isAuthenticated } = useAuth0();
  const api = useNotifyMeAPI();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [queries, setQueries] = useState<NotificationQuery[]>([]);
  const [queryStats, setQueryStats] = useState<QueryStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping data fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard data...');

      const [profile, stats, allQueries, qStats] = await Promise.all([
        api.getUserProfile(),
        api.getUserStatistics(),
        api.getAllQueries(),
        api.getQueryStatistics()
      ]);

      setUserProfile(profile);
      setUserStats(stats);
      setQueries(allQueries);
      setQueryStats(qStats);
      
      console.log('Dashboard data loaded successfully');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const refreshData = () => {
    fetchData();
  };

  return {
    userProfile,
    userStats,
    queries,
    queryStats,
    loading,
    error,
    refreshData,
    setUserProfile,
    setQueries
  };
};