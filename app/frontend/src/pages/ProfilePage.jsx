import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSightings } from '../context/SightingsContext';
import { User, Settings, Award, Calendar, FileText, Check, Plane } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { sightings } = useSightings();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [successMsg, setSuccessMsg] = useState('');

  const getSpotterRank = (count) => {
    if (count === 0) return { title: 'GROUND CREW', desc: 'No flights logged yet. Begin spotting!' };
    if (count < 3) return { title: 'NOVICE SPOTTER', desc: 'Starting your aircraft spotting adventure.' };
    if (count < 6) return { title: 'FIRST OFFICER', desc: 'Logging aircraft consistently. Good radar!' };
    return { title: 'CAPTAIN SPOTTER', desc: 'Highly experienced airframe logger. Veteran status.' };
  };

  const rank = getSpotterRank(sightings.length);

  const formatDate = (dateString) => {
    if (!dateString) return 'June 11, 2026';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault(); 
    setSuccessMsg('');
    if (name.trim()) {
      updateUserProfile({ name: name.trim(), email: email.trim() });
      setSuccessMsg('Profile updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div>
      {/* Title Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', margin: 0, color: 'var(--color-ink)' }}>
          User Profile
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--color-ink-muted-80)', margin: '4px 0 0 0' }}>
          Manage your personal spotter details and account options.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Left Column — Spotter Info Card + Rank */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Card */}
          <div className="store-utility-card" style={{ padding: '24px 16px', textAlign: 'center', display: 'block' }}>
            {/* Cert-seal avatar */}
            <div style={{
              width: '64px', 
              height: '64px', 
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 102, 204, 0.08)', 
              color: '#0066cc',
              fontFamily: 'var(--font-display)', 
              fontWeight: 600, 
              fontSize: '20px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px auto', 
              border: '1px solid rgba(0, 102, 204, 0.15)'
            }}>
              {getUserInitials()}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
              {user?.name}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted-80)', marginBottom: '16px' }}>
              {user?.email}
            </p>
            <div style={{ 
              borderTop: '1px solid var(--color-divider-soft)', 
              paddingTop: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              fontSize: '13px',
              color: 'var(--color-ink-muted-80)'
            }}>
              <Calendar size={14} /> Joined {formatDate(user?.joinedAt)}
            </div>
          </div>

          {/* Spotter Rank Card */}
          <div className="store-utility-card" style={{ padding: '24px 16px', display: 'block' }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '13px', 
              fontWeight: 600, 
              color: 'var(--color-ink-muted-80)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              borderBottom: '1px solid var(--color-divider-soft)',
              paddingBottom: '8px',
              marginBottom: '12px'
            }}>
              <Award size={16} /> Spotter Rank
            </h4>
            
            <span className="badge badge-warning" style={{ marginBottom: '8px', fontSize: '11px', display: 'inline-block' }}>
              {rank.title}
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-muted-80)', lineHeight: 1.4, margin: '0 0 12px 0' }}>
              {rank.desc}
            </p>
            
            <div style={{ 
              fontSize: '13px', 
              marginTop: '12px', 
              borderTop: '1px solid var(--color-divider-soft)', 
              paddingTop: '8px',
              color: 'var(--color-ink-muted-80)'
            }}>
              Logged spots: <strong style={{ color: 'var(--color-ink)' }}>{sightings.length}</strong>
            </div>
          </div>
        </div>

        {/* Right Column — Edit Forms + Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Personal Profile Form */}
          <div className="store-utility-card" style={{ display: 'block' }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '15px', 
              fontWeight: 600, 
              color: 'var(--color-ink)',
              borderBottom: '1px solid var(--color-divider-soft)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <User size={16} style={{ color: 'var(--color-primary)' }} /> Personal Information
            </h4>

            {successMsg && (
              <div className="error-banner mb-3" style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759' }}>
                <Check size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-name">Full Name</label>
                  <input id="profile-name" type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-email">Email Address</label>
                  <input id="profile-email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '4px' }}>Update Profile</button>
            </form>
          </div>

          {/* Settings Options */}
          <div className="store-utility-card" style={{ display: 'block' }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '15px', 
              fontWeight: 600, 
              color: 'var(--color-ink)',
              borderBottom: '1px solid var(--color-divider-soft)',
              paddingBottom: '12px',
              marginBottom: '16px'
            }}>
              <Settings size={16} style={{ color: 'var(--color-primary)' }} /> Account Settings
            </h4>

            <div style={{ 
              border: '1px solid var(--color-hairline)', 
              borderRadius: '11px',
              overflow: 'hidden'
            }}>
              {/* Option item 1 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px', 
                borderBottom: '1px solid var(--color-divider-soft)', 
                backgroundColor: 'var(--color-canvas)' 
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)' }}>Console Theme</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-ink-muted-48)' }}>Switch between dashboard visual stylesheets.</div>
                </div>
                <span className="badge badge-secondary" style={{ fontSize: '11px' }}>Apple Minimal</span>
              </div>
              
              {/* Option item 2 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px', 
                borderBottom: '1px solid var(--color-divider-soft)', 
                backgroundColor: 'var(--color-canvas)' 
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)' }}>Radar Alerts</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-ink-muted-48)' }}>Receive logs notifications when watched aircraft are spotted.</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>Active</span>
              </div>
              
              {/* Option item 3 */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px', 
                backgroundColor: 'var(--color-canvas)' 
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)' }}>Logbook Export</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-ink-muted-48)' }}>Backup your aircraft spotting database records to CSV.</div>
                </div>
                <button className="btn btn-pearl btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={13} /> Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
