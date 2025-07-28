import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useThoughts = () => {
  const [thought, setThought] = useState<{ thought: string; author: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveThought = async () => {
      try {
        const { data } = await supabase
          .from('thoughts')
          .select('thought, author')
          .eq('is_active', true)
          .single();
        
        if (data) {
          setThought(data);
        }
      } catch (error) {
        console.error('Error fetching thought:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveThought();
  }, []);

  return { thought, isLoading };
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false })
          .limit(5);
        
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return { announcements, isLoading };
};

export const useHousePoints = () => {
  const [houses, setHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHousePoints = async () => {
      try {
        const { data } = await supabase
          .from('houses')
          .select('*')
          .order('total_points', { ascending: false });
        
        setHouses(data || []);
      } catch (error) {
        console.error('Error fetching house points:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHousePoints();
  }, []);

  return { houses, isLoading };
};