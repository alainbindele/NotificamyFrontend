import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { DashboardApiService } from '../services/dashboardApiService';
import { UserProfile, UserStatistics, NotificationQuery, QueryStatistics } from '../types/api';

export const useDashboardData = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
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

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://notificamy.com/api',
          scope: 'openid profile email offline_access'
        },
        cacheMode: 'cache-only' // Try cache first, then refresh if needed
      });
      
      console.log('Token obtained for dashboard');

      const [profile, stats, allQueries, qStats] = await Promise.all([
        DashboardApiService.getUserProfile(token),
        DashboardApiService.getUserStatistics(token),
        DashboardApiService.getAllQueries(token),
        DashboardApiService.getQueryStatistics(token)
      ]);

      setUserProfile(profile);
      setUserStats(stats);
      setQueries(allQueries);
      setQueryStats(qStats);
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