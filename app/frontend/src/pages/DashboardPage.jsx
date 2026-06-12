import React from 'react';
import { Link } from 'react-router-dom';
import { useSightings } from '../context/SightingsContext';
import { useAuth } from '../context/AuthContext';
import { Plane, Eye, Compass, Landmark, Plus, ArrowRight, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { sightings, analytics } = useSightings();

  const recentSightings = sightings.slice(0, 5);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTopAirlines = () => {
    const counts = {};
    sightings.forEach(s => { counts[s.airline] = (counts[s.airline] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 4);
  };

  const getTopAircraftTypes = () => {
    const counts = {};
    sightings.forEach(s => { counts[s.aircraft_type] = (counts[s.aircraft_type] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 4);
  };

  const topAirlines = getTopAirlines();
  const topAircraft = getTopAircraftTypes();
  
  // Apple dashboard chart palette: Blue, Green, Orange, Purple
  const tints = ['#0066cc', '#34c759', '#ff9f0a', '#af52de'];

  return (
    <div>
      {/* Sleek welcome banner */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', margin: 0, color: 'var(--color-ink)' }}>
            Welcome, {user?.name.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-ink-muted-80)', margin: '4px 0 0 0' }}>
            Here is a summary of your aircraft spotting records.
          </p>
        </div>
        <div>
          <Link to="/sightings" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Log Sighting
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrapper primary"><Eye size={20} color="#0066cc" /></div>
          <div className="metric-info">
            <h3>Total Sightings</h3>
            <div className="metric-value">{analytics.totalSightings}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper accent"><Plane size={20} color="#ff9f0a" style={{ transform: 'rotate(-45deg)' }} /></div>
          <div className="metric-info">
            <h3>Unique Aircraft</h3>
            <div className="metric-value">{analytics.uniqueAircraft}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper success"><Landmark size={20} color="#34c759" /></div>
          <div className="metric-info">
            <h3>Unique Airlines</h3>
            <div className="metric-value">{analytics.uniqueAirlines}</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon-wrapper danger"><Compass size={20} color="#ff3b30" /></div>
          <div className="metric-info">
            <h3>Airports Visited</h3>
            <div className="metric-value">{analytics.airportsVisited}</div>
          </div>
        </div>
      </div>

      {/* Two Column: Top Operators + Top Aircraft */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Top Operators */}
        <div className="store-utility-card">
          <div>
            <h3 className="store-utility-title" style={{ borderBottom: '1px solid var(--color-divider-soft)', paddingBottom: '12px', marginBottom: '16px', textTransform: 'uppercase', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-muted-80)', letterSpacing: '0.5px' }}>
              Top Operators
            </h3>
            {topAirlines.length === 0 ? (
              <p style={{ color: 'var(--color-ink-muted-80)', fontSize: '14px', margin: '12px 0' }}>No data logged yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {topAirlines.map((airline, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < topAirlines.length - 1 ? '1px solid var(--color-divider-soft)' : 'none' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600, color: 'var(--color-ink)' }}>{airline.name}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-ink-muted-80)' }}>{airline.count} spot{airline.count !== 1 ? 's' : ''}</td>
                      <td style={{ padding: '10px 0', width: '90px', textAlign: 'right' }}>
                        <div className="runway-progress" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}>
                          <div className="runway-bar" style={{ width: `${Math.round((airline.count / sightings.length) * 100)}%`, backgroundColor: tints[idx] || 'var(--color-primary)' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Aircraft Types */}
        <div className="store-utility-card">
          <div>
            <h3 className="store-utility-title" style={{ borderBottom: '1px solid var(--color-divider-soft)', paddingBottom: '12px', marginBottom: '16px', textTransform: 'uppercase', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink-muted-80)', letterSpacing: '0.5px' }}>
              Top Aircraft Types
            </h3>
            {topAircraft.length === 0 ? (
              <p style={{ color: 'var(--color-ink-muted-80)', fontSize: '14px', margin: '12px 0' }}>No data logged yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <tbody>
                  {topAircraft.map((aircraft, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < topAircraft.length - 1 ? '1px solid var(--color-divider-soft)' : 'none' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600, color: 'var(--color-ink)' }}>{aircraft.name}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-ink-muted-80)' }}>{aircraft.count}</td>
                      <td style={{ padding: '10px 0', width: '90px', textAlign: 'right' }}>
                        <div className="runway-progress" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}>
                          <div className="runway-bar" style={{ width: `${Math.round((aircraft.count / sightings.length) * 100)}%`, backgroundColor: tints[idx] || 'var(--color-primary)' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sightings */}
      <div className="store-utility-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-divider-soft)', paddingBottom: '16px', marginBottom: '16px' }}>
          <h3 className="store-utility-title" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>
            Recent Sightings Log
          </h3>
          <Link to="/sightings" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Logbook <ArrowRight size={14} />
          </Link>
        </div>
        
        <div>
          {recentSightings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-ink-muted-80)', margin: '0 0 16px 0' }}>You haven't recorded any aircraft sightings yet.</p>
              <Link to="/sightings" className="btn btn-primary btn-sm">Record Your First Spot</Link>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="custom-table" style={{ fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ background: 'transparent', paddingLeft: 0 }}>Registration</th>
                    <th style={{ background: 'transparent' }}>Airline</th>
                    <th style={{ background: 'transparent' }}>Aircraft Type</th>
                    <th style={{ background: 'transparent' }}>Airport</th>
                    <th style={{ background: 'transparent', paddingRight: 0 }}>Date Sighted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSightings.map((s) => (
                    <tr key={s.id}>
                      <td style={{ paddingLeft: 0 }}><span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '13px' }}>{s.registration}</span></td>
                      <td style={{ fontWeight: 600 }}>{s.airline}</td>
                      <td>{s.aircraft_type}</td>
                      <td><span className="badge badge-secondary">{s.airport}</span></td>
                      <td style={{ paddingRight: 0, color: 'var(--color-ink-muted-80)' }}>{formatDate(s.sighting_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
