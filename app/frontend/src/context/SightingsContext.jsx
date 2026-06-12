import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SIGHTINGS } from '../data/mockData';
import { useAuth } from './AuthContext';

const SightingsContext = createContext(null);

export const SightingsProvider = ({ children }) => {
  const [sightings, setSightings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSightings: 0,
    uniqueAircraft: 0,
    uniqueAirlines: 0,
    airportsVisited: 0,
    mostFrequentAirline: 'None',
    mostFrequentType: 'None'
  });
  const { user } = useAuth();

  // Load sightings and analytics from backend API
  const fetchSightingsAndAnalytics = async () => {
    if (!user) {
      setSightings([]);
      setAnalytics({
        totalSightings: 0,
        uniqueAircraft: 0,
        uniqueAirlines: 0,
        airportsVisited: 0,
        mostFrequentAirline: 'None',
        mostFrequentType: 'None'
      });
      return;
    }
    const token = localStorage.getItem('flightwatch_token');
    if (!token) return;

    try {
      // Fetch sightings
      const sightingsRes = await fetch('/api/v1/sightings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const sightingsData = await sightingsRes.json();
      if (sightingsData.success) {
        setSightings(sightingsData.sightings);
      }

      // Fetch analytics
      const analyticsRes = await fetch('/api/v1/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      }
    } catch (err) {
      console.error('Failed to load sightings or analytics from backend:', err);
    }
  };

  useEffect(() => {
    fetchSightingsAndAnalytics();
  }, [user]);

  const addSighting = async (sightingData) => {
    if (!user) return;
    const token = localStorage.getItem('flightwatch_token');
    if (!token) return;

    try {
      const res = await fetch('/api/v1/sightings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sightingData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchSightingsAndAnalytics();
        return data.sighting;
      }
    } catch (err) {
      console.error('Failed to create sighting report:', err);
    }
  };

  const updateSighting = async (id, updatedData) => {
    if (!user) return;
    const token = localStorage.getItem('flightwatch_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/sightings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchSightingsAndAnalytics();
      }
    } catch (err) {
      console.error('Failed to update sighting report:', err);
    }
  };

  const deleteSighting = async (id) => {
    if (!user) return;
    const token = localStorage.getItem('flightwatch_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/v1/sightings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        await fetchSightingsAndAnalytics();
      }
    } catch (err) {
      console.error('Failed to delete sighting report:', err);
    }
  };

  return (
    <SightingsContext.Provider value={{
      sightings,
      allSightings: sightings,
      addSighting,
      updateSighting,
      deleteSighting,
      analytics
    }}>
      {children}
    </SightingsContext.Provider>
  );
};

export const useSightings = () => {
  const context = useContext(SightingsContext);
  if (!context) {
    throw new Error('useSightings must be used within a SightingsProvider');
  }
  return context;
};
