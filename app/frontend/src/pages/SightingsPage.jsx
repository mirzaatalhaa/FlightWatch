import React, { useState } from 'react';
import { useSightings } from '../context/SightingsContext';
import { SUGGESTED_AIRLINES, SUGGESTED_AIRCRAFT, SUGGESTED_AIRPORTS } from '../data/mockData';
import Modal from '../components/Modal';
import { Search, Plus, Edit2, Trash2, AlertCircle, Plane } from 'lucide-react';

const SightingsPage = () => {
  const { sightings, addSighting, updateSighting, deleteSighting } = useSightings();

  const [searchQuery, setSearchQuery] = useState('');
  const [airlineFilter, setAirlineFilter] = useState('');
  const [airportFilter, setAirportFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSightingId, setSelectedSightingId] = useState(null);

  const [registration, setRegistration] = useState('');
  const [airline, setAirline] = useState('');
  const [aircraftType, setAircraftType] = useState('');
  const [airport, setAirport] = useState('');
  const [sightingDate, setSightingDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setRegistration(''); setAirline(''); setAircraftType(''); setAirport('');
    setSightingDate(new Date().toISOString().substring(0, 16));
    setNotes(''); setFormError(''); setSelectedSightingId(null);
  };

  const handleOpenAdd = () => { resetForm(); setModalMode('add'); setIsModalOpen(true); };

  const handleOpenEdit = (s) => {
    setFormError(''); setModalMode('edit'); setSelectedSightingId(s.id);
    setRegistration(s.registration); setAirline(s.airline);
    setAircraftType(s.aircraft_type); setAirport(s.airport);
    setSightingDate(new Date(s.sighting_date).toISOString().substring(0, 16));
    setNotes(s.notes || ''); setIsModalOpen(true);
  };

  const handleDelete = (id, reg) => {
    if (window.confirm(`Delete sighting log for aircraft tail ${reg}?`)) deleteSighting(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setFormError('');
    if (!registration.trim()) { setFormError('Registration tail number is required.'); return; }
    if (!airline.trim()) { setFormError('Airline operator is required.'); return; }
    if (!aircraftType.trim()) { setFormError('Aircraft type is required.'); return; }
    if (!airport.trim()) { setFormError('Airport code is required.'); return; }
    if (!sightingDate) { setFormError('Date and time of sighting is required.'); return; }

    const payload = {
      registration: registration.toUpperCase(), airline, aircraft_type: aircraftType,
      airport: airport.toUpperCase(), sighting_date: new Date(sightingDate).toISOString(), notes
    };

    if (modalMode === 'add') addSighting(payload);
    else updateSighting(selectedSightingId, payload);
    setIsModalOpen(false); resetForm();
  };

  const filteredSightings = sightings.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.registration.toLowerCase().includes(q) ||
      s.airline.toLowerCase().includes(q) || s.aircraft_type.toLowerCase().includes(q) ||
      s.airport.toLowerCase().includes(q) || (s.notes && s.notes.toLowerCase().includes(q));
    return matchesSearch && (airlineFilter === '' || s.airline === airlineFilter) && (airportFilter === '' || s.airport === airportFilter);
  });

  const loggedAirlines = [...new Set(sightings.map(s => s.airline))].sort();
  const loggedAirports = [...new Set(sightings.map(s => s.airport))].sort();

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', margin: 0, color: 'var(--color-ink)' }}>
            Aircraft Logbook
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-ink-muted-80)', margin: '4px 0 0 0' }}>
            Record, filter, and manage your personalized aircraft spotting logs.
          </p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Sighting
          </button>
        </div>
      </div>

      {/* Search & Filters (Pill layout) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr 1fr', 
        gap: '12px', 
        marginBottom: '20px', 
        padding: '16px', 
        backgroundColor: 'var(--color-surface-pearl)', 
        borderRadius: '18px',
        border: '1px solid var(--color-hairline)'
      }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            className="form-control form-control-pill" 
            placeholder="Search tail, airline, type, airport..."
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }} 
          />
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--color-ink-muted-48)' }} />
        </div>
        <select 
          className="form-control" 
          value={airlineFilter} 
          onChange={(e) => setAirlineFilter(e.target.value)}
          style={{ borderRadius: '9999px', paddingLeft: '20px' }}
        >
          <option value="">All Airlines</option>
          {loggedAirlines.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select 
          className="form-control" 
          value={airportFilter} 
          onChange={(e) => setAirportFilter(e.target.value)}
          style={{ borderRadius: '9999px', paddingLeft: '20px' }}
        >
          <option value="">All Airports</option>
          {loggedAirports.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Data Table */}
      {filteredSightings.length === 0 ? (
        <div className="store-utility-card" style={{ padding: '64px 32px', textAlign: 'center', display: 'block' }}>
          <Plane size={36} style={{ color: 'var(--color-ink-muted-48)', marginBottom: '16px', transform: 'rotate(-45deg)' }} />
          <p style={{ fontSize: '17px', color: 'var(--color-ink-muted-80)', marginBottom: '16px' }}>
            No sightings matches found. Adjust filters or register a new log.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearchQuery(''); setAirlineFilter(''); setAirportFilter(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Registration</th>
                <th>Airline Operator</th>
                <th>Aircraft Model</th>
                <th>Airport</th>
                <th>Sighting Date</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSightings.map((s) => (
                <tr key={s.id}>
                  <td>
                    <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      {s.registration}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{s.airline}</td>
                  <td>{s.aircraft_type}</td>
                  <td>
                    <span className="badge badge-secondary" style={{ fontSize: '12px' }}>
                      {s.airport}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-ink-muted-80)' }}>
                    {formatDate(s.sighting_date)}
                  </td>
                  <td 
                    style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-ink-muted-80)' }} 
                    title={s.notes}
                  >
                    {s.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        className="btn btn-pearl btn-sm" 
                        onClick={() => handleOpenEdit(s)} 
                        title="Edit Log"
                        style={{ padding: '6px', borderRadius: '6px' }}
                      >
                        <Edit2 size={13} style={{ color: 'var(--color-primary)' }} />
                      </button>
                      <button 
                        className="btn btn-pearl btn-sm" 
                        onClick={() => handleDelete(s.id, s.registration)} 
                        title="Delete Log"
                        style={{ padding: '6px', borderRadius: '6px' }}
                      >
                        <Trash2 size={13} style={{ color: '#ff3b30' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal Sheet */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? '✈ Log Sighting' : `✈ Edit Spot — ${registration}`}
        footer={<>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
            {modalMode === 'add' ? 'Save Sighting' : 'Save Changes'}
          </button>
        </>}
      >
        {formError && (
          <div className="error-banner mb-3">
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="aircraft-reg">Registration Tail *</label>
              <input 
                id="aircraft-reg" 
                type="text" 
                className="form-control" 
                placeholder="A6-EEV" 
                value={registration} 
                onChange={(e) => setRegistration(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="airport-code">Airport Code *</label>
              <input 
                id="airport-code" 
                type="text" 
                className="form-control" 
                placeholder="DXB" 
                list="airport-datalist" 
                value={airport} 
                onChange={(e) => setAirport(e.target.value)} 
                required 
              />
              <datalist id="airport-datalist">
                {SUGGESTED_AIRPORTS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="airline-name">Airline Operator *</label>
            <input 
              id="airline-name" 
              type="text" 
              className="form-control" 
              placeholder="Emirates" 
              list="airline-datalist" 
              value={airline} 
              onChange={(e) => setAirline(e.target.value)} 
              required 
            />
            <datalist id="airline-datalist">
              {SUGGESTED_AIRLINES.map(n => <option key={n} value={n} />)}
            </datalist>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="aircraft-model">Aircraft Type Model *</label>
            <input 
              id="aircraft-model" 
              type="text" 
              className="form-control" 
              placeholder="Airbus A380-800" 
              list="aircraft-datalist" 
              value={aircraftType} 
              onChange={(e) => setAircraftType(e.target.value)} 
              required 
            />
            <datalist id="aircraft-datalist">
              {SUGGESTED_AIRCRAFT.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sighting-time">Date & Time of Spot *</label>
            <input 
              id="sighting-time" 
              type="datetime-local" 
              className="form-control" 
              value={sightingDate} 
              onChange={(e) => setSightingDate(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sighting-notes">Sighting Notes (Optional)</label>
            <textarea 
              id="sighting-notes" 
              className="form-control" 
              rows="3" 
              placeholder="Detail observations (e.g. runway, livery, weather)..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SightingsPage;
