import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useSightings } from '../context/SightingsContext';
import { useTime } from '../context/TimeContext';
import LockScreenTime from '../components/LockScreenTime';
import {
  Plane,
  Camera,
  BookOpen,
  BarChart3,
  Building2,
  PlaneTakeoff,
  User,
  Settings as SettingsIcon,
  AlertCircle,
  Eye,
  EyeOff,
  Wifi
} from 'lucide-react';
import a350Image from '../assets/a350.png';
import {
  SUGGESTED_AIRLINES,
  SUGGESTED_AIRCRAFT,
  SUGGESTED_AIRPORTS
} from '../data/mockData';

// App List Configuration with colorful gradients
const apps = [
  { name: 'Spotter', icon: <Camera size={26} /> },
  { name: 'Logbook', icon: <BookOpen size={26} /> },
  { name: 'Analytics', icon: <BarChart3 size={26} /> },
  { name: 'Aircraft', icon: <Plane size={26} style={{ transform: 'rotate(-45deg)' }} /> },
  { name: 'Airlines', icon: <Building2 size={26} /> },
  { name: 'Airports', icon: <PlaneTakeoff size={26} /> },
  { name: 'Profile', icon: <User size={26} /> },
  { name: 'Settings', icon: <SettingsIcon size={26} /> },
];

// Default window sizes for premium layout (e.g. Logbook starts wider to show all table columns)
const DEFAULT_WINDOW_SIZES = {
  Spotter: { w: 680, h: 540 },
  Logbook: { w: 900, h: 560 },
  Analytics: { w: 720, h: 520 },
  Aircraft: { w: 640, h: 480 },
  Airlines: { w: 640, h: 480 },
  Airports: { w: 640, h: 480 },
  Profile: { w: 600, h: 500 },
  Settings: { w: 600, h: 500 }
};

// Default centered window positions matching high-fidelity iPad layout
const DEFAULT_WINDOW_POSITIONS = {
  Spotter: { x: 172, y: 50 },
  Logbook: { x: 62, y: 50 },
  Analytics: { x: 152, y: 50 },
  Aircraft: { x: 192, y: 70 },
  Airlines: { x: 192, y: 70 },
  Airports: { x: 192, y: 70 },
  Profile: { x: 212, y: 70 },
  Settings: { x: 212, y: 70 }
};

const LandingPage = () => {
  const { user, login, register, updateUserProfile } = useAuth();
  useEffect(() => {
    setOpenApps([]);
    setMinimizedApps([]);
    setActiveApp(null);
    setClosingApps([]);
    setWindowSizes({});
    setWindowPositions({});
    setWindowDims({});
    setAuthMode('login');
  }, [user]);
  const { sightings, addSighting, deleteSighting, analytics } = useSightings();

  // OS Clock & Date State from global context
  const { currentTime, currentDate } = useTime();

  // Wallpaper state: 'a350', 'sunset', 'radar'
  const [wallpaper, setWallpaper] = useState('a350');

  // Theme state: 'light' or 'dark' (defaulting to 'dark')
  const [theme, setTheme] = useState(() => localStorage.getItem('os-theme') || 'dark');

  // Lock Screen/Auth states
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Window Manager states
  const [openApps, setOpenApps] = useState([]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [closingApps, setClosingApps] = useState([]);
  const [windowSizes, setWindowSizes] = useState({}); // { [appName]: 'normal' | 'fullscreen' }
  const [windowPositions, setWindowPositions] = useState({}); // { [appName]: { x, y } }
  const [windowDims, setWindowDims] = useState({}); // { [appName]: { w: 480, h: 360 } }

  // Dock slide-up & auto-hide states
  const dockRef = useRef(null);
  const cardRef = useRef(null);
  const nameFieldRef = useRef(null);
  const confirmFieldRef = useRef(null);
  const [dockHovered, setDockHovered] = useState(false);

  // iPadOS Stage Manager & Widget states
  const [stageManagerEnabled, setStageManagerEnabled] = useState(true);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState(0);

  // System sliders
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);

  // Multitasking dropdown per window
  const [openMultitaskMenu, setOpenMultitaskMenu] = useState(null);

  // Dock Context Menu state
  const [activeDockMenu, setActiveDockMenu] = useState(null); // { appName, x, y }

  // Clock update handled globally by TimeContext

  const hasFullscreenApp = openApps.some(appName =>
    windowSizes[appName] === 'fullscreen' && !minimizedApps.includes(appName)
  );

  useEffect(() => {
    if (!dockRef.current) return;

    if (hasFullscreenApp) {
      if (dockHovered) {
        gsap.to(dockRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        gsap.to(dockRef.current, {
          y: 80,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      }
    } else {
      gsap.to(dockRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }, [hasFullscreenApp, dockHovered]);

  // Spotlight global shortcut handler (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme synchronization effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('os-theme', theme);
  }, [theme]);

  // Wallpaper rendering config styles
  const getWallpaperStyle = (wpId) => {
    if (wpId === 'a350') {
      return { backgroundImage: `url(${a350Image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    } else if (wpId === 'sunset') {
      return { background: 'linear-gradient(135deg, #1e112a 0%, #3e1b3d 40%, #7e2d45 75%, #d56847 100%)' };
    } else if (wpId === 'radar') {
      return {
        background: 'radial-gradient(circle at center, #0a101d 0%, #04060b 100%)',
        backgroundImage: `
          radial-gradient(circle at center, transparent 30%, rgba(0, 240, 255, 0.03) 30%, rgba(0, 240, 255, 0.03) 31%, transparent 31%),
          radial-gradient(circle at center, transparent 60%, rgba(0, 240, 255, 0.03) 60%, rgba(0, 240, 255, 0.03) 61%, transparent 61%),
          linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px'
      };
    }
    return { backgroundImage: `url(${a350Image})` };
  };

  // Auth Submit Lock Screen
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);

    try {
      if (authMode === 'login') {
        if (!authEmail) throw new Error('Email is required.');
        if (!authPassword) throw new Error('Password is required.');
        await login(authEmail, authPassword);
      } else {
        if (!authName.trim()) throw new Error('Name is required.');
        if (!authEmail.trim()) throw new Error('Email is required.');
        if (authPassword.length < 6) throw new Error('Password must be at least 6 characters.');
        if (authPassword !== authConfirmPassword) throw new Error('Passwords do not match.');
        await register(authName.trim(), authEmail.trim(), authPassword);
      }
      // Reset auth form input states on success
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Transition auth mode smoothly with GSAP
  const handleSwitchAuthMode = (newMode) => {
    if (newMode === authMode) return;

    const isRegistering = newMode === 'register';

    if (!cardRef.current) {
      setAuthMode(newMode);
      setAuthError('');
      return;
    }

    // 1. Measure the card's current height before changes
    const originalCardHeight = cardRef.current.getBoundingClientRect().height;

    // 2. Lock the card height and overflow
    cardRef.current.style.height = `${originalCardHeight}px`;
    cardRef.current.style.overflow = 'hidden';

    // 3. Update React state immediately
    setAuthMode(newMode);
    setAuthError('');

    // 4. Trigger GSAP animations for internal fields
    gsap.to(nameFieldRef.current, {
      height: isRegistering ? 38 : 0,
      marginBottom: isRegistering ? 8 : 0,
      opacity: isRegistering ? 1 : 0,
      duration: 0.4,
      ease: 'power3.inOut'
    });

    gsap.to(confirmFieldRef.current, {
      height: isRegistering ? 38 : 0,
      marginBottom: isRegistering ? 8 : 0,
      opacity: isRegistering ? 1 : 0,
      duration: 0.4,
      ease: 'power3.inOut'
    });

    // 5. Measure new content height and animate card container
    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      // Temporarily clear inline height to measure natural height
      cardRef.current.style.height = 'auto';
      const targetCardHeight = cardRef.current.getBoundingClientRect().height;

      // Restore original height for GSAP transition start
      cardRef.current.style.height = `${originalCardHeight}px`;

      gsap.to(cardRef.current, {
        height: targetCardHeight,
        duration: 0.4,
        ease: 'power3.inOut',
        clearProps: 'height,overflow'
      });
    });
  };

  // Launch app or focus active app
  const launchApp = (appName) => {
    if (!openApps.includes(appName)) {
      setOpenApps(prev => [...prev, appName]);

      // Calculate offset based on number of open apps to cascade windows
      const offset = (openApps.length * 20) % 100;

      // Get the simulated screen width dynamically, defaulting to 976px
      const screenEl = document.querySelector('.os-tablet-screen');
      const screenWidth = screenEl ? screenEl.clientWidth : 976;

      const defaultW = DEFAULT_WINDOW_SIZES[appName]?.w || 680;
      const defaultPos = DEFAULT_WINDOW_POSITIONS[appName];

      // Center the window relative to the entire screen width
      const initialX = Math.max(16, (screenWidth - defaultW) / 2);
      const initialY = defaultPos ? defaultPos.y : 50;

      setWindowPositions(prev => ({
        ...prev,
        [appName]: {
          x: initialX + offset,
          y: initialY + offset
        }
      }));
    }

    if (minimizedApps.includes(appName)) {
      setMinimizedApps(prev => prev.filter(a => a !== appName));
    }

    setActiveApp(appName);
  };

  // Close app with smooth fade-out animation
  const closeApp = (appName) => {
    if (closingApps.includes(appName)) return;
    setClosingApps(prev => [...prev, appName]);

    setTimeout(() => {
      setOpenApps(prev => prev.filter(a => a !== appName));
      setMinimizedApps(prev => prev.filter(a => a !== appName));
      setClosingApps(prev => prev.filter(a => a !== appName));
      if (activeApp === appName) {
        const visible = openApps.filter(a => !minimizedApps.includes(a) && a !== appName);
        setActiveApp(visible.length > 0 ? visible[visible.length - 1] : null);
      }
    }, 200); // 200ms matches the transition duration in CSS
  };

  // Minimize app
  const minimizeApp = (appName) => {
    if (!minimizedApps.includes(appName)) {
      setMinimizedApps(prev => [...prev, appName]);
    }
    if (activeApp === appName) {
      const visible = openApps.filter(a => !minimizedApps.includes(a) && a !== appName);
      setActiveApp(visible.length > 0 ? visible[visible.length - 1] : null);
    }
  };

  // Toggle multitasking header menu
  const toggleMultitaskMenu = (appName, e) => {
    e.stopPropagation();
    setOpenMultitaskMenu(prev => prev === appName ? null : appName);
  };

  // Dock Click handler
  const handleDockClick = (appName) => {
    const isOpen = openApps.includes(appName);
    const isMinimized = minimizedApps.includes(appName);
    const isActive = activeApp === appName;

    if (!isOpen) {
      launchApp(appName);
    } else if (isMinimized) {
      setMinimizedApps(prev => prev.filter(a => a !== appName));
      setActiveApp(appName);
    } else if (isActive) {
      minimizeApp(appName);
    } else {
      setActiveApp(appName);
    }
  };

  // Stage Manager thumbnail click handler
  const handleStageClick = (appName) => {
    setActiveApp(appName);
  };

  // Dragging handler using Pointer Events (optimized with direct DOM updates for 60FPS dragging)
  const handlePointerDown = (appName, e) => {
    if (e.button !== 0) return; // Only left click
    if (windowSizes[appName] === 'fullscreen') return; // Fullscreen windows cannot be dragged

    setActiveApp(appName);
    setOpenMultitaskMenu(null); // Close active dots menus

    const defaultX = DEFAULT_WINDOW_POSITIONS[appName]?.x || 80;
    const defaultY = DEFAULT_WINDOW_POSITIONS[appName]?.y || 50;
    const startX = windowPositions[appName]?.x || defaultX;
    const startY = windowPositions[appName]?.y || defaultY;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const windowEl = document.querySelector(`[data-app-name="${appName}"]`);

    const handlePointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startClientX;
      const dy = moveEvent.clientY - startClientY;
      const newX = startX + dx;
      const newY = startY + dy;

      if (windowEl) {
        windowEl.style.left = `${newX}px`;
        windowEl.style.top = `${newY}px`;
      }
    };

    const handlePointerUp = (upEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const dx = upEvent.clientX - startClientX;
      const dy = upEvent.clientY - startClientY;
      const finalX = startX + dx;
      const finalY = startY + dy;

      setWindowPositions(prev => ({
        ...prev,
        [appName]: { x: finalX, y: finalY }
      }));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Resizing handler using Pointer Events (optimized with direct DOM updates for 60FPS resizing)
  const handleResizePointerDown = (appName, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.button !== 0) return; // Only left click

    setActiveApp(appName);
    setOpenMultitaskMenu(null); // Close active dots menus

    const defaultW = DEFAULT_WINDOW_SIZES[appName]?.w || 680;
    const defaultH = DEFAULT_WINDOW_SIZES[appName]?.h || 520;
    const currentW = windowDims[appName]?.w || defaultW;
    const currentH = windowDims[appName]?.h || defaultH;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const windowEl = document.querySelector(`[data-app-name="${appName}"]`);

    const handlePointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startClientX;
      const dy = moveEvent.clientY - startClientY;

      const newW = Math.max(280, currentW + dx);
      const newH = Math.max(200, currentH + dy);

      if (windowEl) {
        windowEl.style.width = `${newW}px`;
        windowEl.style.height = `${newH}px`;
      }
    };

    const handlePointerUp = (upEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);

      const dx = upEvent.clientX - startClientX;
      const dy = upEvent.clientY - startClientY;
      const finalW = Math.max(280, currentW + dx);
      const finalH = Math.max(200, currentH + dy);

      setWindowDims(prev => ({
        ...prev,
        [appName]: { w: finalW, h: finalH }
      }));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Spotlight search keyboard controls
  const filteredSearch = apps.filter(app =>
    app.name.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  const handleSpotlightKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (filteredSearch.length > 0) {
        const matchedApp = filteredSearch[selectedSpotlightIndex] || filteredSearch[0];
        launchApp(matchedApp.name);
        setShowSpotlight(false);
        setSpotlightQuery('');
      }
    } else if (e.key === 'Escape') {
      setShowSpotlight(false);
      setSpotlightQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSpotlightIndex(prev => (prev + 1) % Math.max(1, filteredSearch.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSpotlightIndex(prev => (prev - 1 + filteredSearch.length) % Math.max(1, filteredSearch.length));
    }
  };

  // Dock Context Menu handlers
  const handleDockContextMenu = (appName, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Find dock item coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const screenEl = e.currentTarget.closest('.os-tablet-screen');
    if (!screenEl) return;
    const screenRect = screenEl.getBoundingClientRect();

    // Align dock menu centrally right above the clicked icon
    const x = rect.left - screenRect.left + (rect.width / 2) - 82.5; // half of menu width (165px)
    const y = rect.top - screenRect.top - 125; // offset above the dock item

    setActiveDockMenu({ appName, x, y });
  };

  let longPressTimeout;
  const handleDockPointerDown = (appName, e) => {
    if (e.button !== 0) return; // Only left click / pointer down
    const rect = e.currentTarget.getBoundingClientRect();
    const screenEl = e.currentTarget.closest('.os-tablet-screen');
    if (!screenEl) return;
    const screenRect = screenEl.getBoundingClientRect();

    longPressTimeout = setTimeout(() => {
      const x = rect.left - screenRect.left + (rect.width / 2) - 82.5;
      const y = rect.top - screenRect.top - 125;
      setActiveDockMenu({ appName, x, y });
    }, 600); // 600ms hold
  };

  const handleDockPointerUp = () => {
    clearTimeout(longPressTimeout);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all sighting records?")) {
      localStorage.removeItem('flightwatch_sightings');
      window.location.reload();
    }
  };

  // Subview dispatcher
  const renderWindowContent = (appName) => {
    switch (appName) {
      case 'Spotter': return <SpotterView />;
      case 'Logbook': return <LogbookView />;
      case 'Analytics': return <AnalyticsView />;
      case 'Aircraft': return <AircraftView />;
      case 'Airlines': return <AirlinesView />;
      case 'Airports': return <AirportsView />;
      case 'Profile': return <ProfileView />;
      case 'Settings': return (
        <SettingsView
          theme={theme}
          setTheme={setTheme}
          wallpaper={wallpaper}
          setWallpaper={setWallpaper}
          handleResetData={handleResetData}
        />
      );
      default: return null;
    }
  };


  const lastSighting = sightings && sightings[0];

  // Stage Manager list of other background apps
  const stageApps = openApps.filter(appName => appName !== activeApp && !minimizedApps.includes(appName));

  return (
    <div className="os-tablet-container" onClick={() => { setShowControlCenter(false); setOpenMultitaskMenu(null); setActiveDockMenu(null); }}>
      {/* ── tablet hardware bezel wrapper ── */}
      <div className="os-tablet-device">
        {/* Hardware camera lens cutout */}
        <div className="os-tablet-camera"></div>

        {/* ── tablet screen inside bezels ── */}
        <div className="os-tablet-screen">
          {/* Wallpaper background image */}
          <div
            className="os-screen-wallpaper"
            style={getWallpaperStyle(wallpaper)}
          ></div>

          {/* Screen Brightness dimmer overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: `rgba(0, 0, 0, ${Math.max(0, 0.7 - (brightness / 100) * 0.7)})`,
            pointerEvents: 'none',
            zIndex: 100,
            borderRadius: '14px',
            transition: 'background-color 0.1s ease'
          }} />

          {/* Dark overlay for text readability */}
          <div className="os-screen-overlay"></div>

          {/* ── tablet OS Screen Content ── */}
          <div className="os-screen-content">

            {/* Top Status Bar of the OS */}
            <header className="os-status-bar" style={{ zIndex: 45, display: hasFullscreenApp ? 'none' : 'flex' }}>
              {/* Left: Clock & FlightWatch Branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 'bold' }}>✈ FlightWatch</span>
                <span style={{ opacity: 0.5 }}>|</span>
                <span>{currentTime}</span>
              </div>

              {/* Right: Status Icons (Clicking reveals Control Center) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowControlCenter(prev => !prev);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.75)',
                  cursor: 'pointer',
                  padding: '0',
                  outline: 'none'
                }}
                className="os-status-right"
                title="Control Center"
              >
                {airplaneMode && <Plane size={11} style={{ transform: 'rotate(-45deg)', opacity: 0.9, color: '#007aff' }} />}
              </button>
            </header>

            {/* Apple Translucent Control Center */}
            {showControlCenter && (
              <div className="ipados-control-center" onClick={e => e.stopPropagation()}>
                <div className="ipados-cc-grid">
                  {/* Connectivity */}
                  <div className="ipados-cc-card">
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>Connectivity</span>
                    <div className="ipados-cc-buttons">
                      <button
                        className={`ipados-cc-btn ${wifiEnabled && !airplaneMode ? 'active' : ''}`}
                        onClick={() => setWifiEnabled(prev => !prev)}
                        disabled={airplaneMode}
                        title="Wi-Fi Toggle"
                      >
                        <Wifi size={16} />
                      </button>
                      <button
                        className={`ipados-cc-btn ${airplaneMode ? 'active' : ''}`}
                        onClick={() => {
                          setAirplaneMode(prev => {
                            const next = !prev;
                            if (next) setWifiEnabled(false);
                            return next;
                          });
                        }}
                        title="Airplane Mode"
                      >
                        <Plane size={16} style={{ transform: 'rotate(-45deg)' }} />
                      </button>
                    </div>
                  </div>

                  {/* Stage Manager Toggle */}
                  <div className="ipados-cc-card">
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 'bold' }}>Multitask</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', justifyContent: 'center' }}>
                      <button
                        className="hud-btn"
                        style={{
                          fontSize: '9px',
                          padding: '6px 2px',
                          textTransform: 'none',
                          width: '100%',
                          borderRadius: '8px',
                          backgroundColor: stageManagerEnabled ? '#007aff' : 'rgba(255,255,255,0.06)',
                          color: '#ffffff',
                          border: stageManagerEnabled ? 'none' : '1px solid rgba(255,255,255,0.1)'
                        }}
                        onClick={() => setStageManagerEnabled(prev => !prev)}
                      >
                        Stage Mgr: {stageManagerEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Silders Panel */}
                <div className="ipados-cc-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>BRIGHTNESS</span>
                      <span>{brightness}%</span>
                    </div>
                    <div className="ipados-slider-container">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={brightness}
                        onChange={e => setBrightness(Number(e.target.value))}
                        className="ipados-cc-slider"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>VOLUME</span>
                      <span>{volume}%</span>
                    </div>
                    <div className="ipados-slider-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        className="ipados-cc-slider"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spotlight Search Dialog Overlay */}
            {showSpotlight && (
              <div className="ipados-spotlight-overlay" onClick={() => setShowSpotlight(false)}>
                <div className="ipados-spotlight-box" onClick={e => e.stopPropagation()}>
                  <div className="ipados-spotlight-searchrow">
                    <span>🔍</span>
                    <input
                      type="text"
                      className="ipados-spotlight-input"
                      placeholder="Search FlightWatch OS..."
                      value={spotlightQuery}
                      onChange={e => {
                        setSpotlightQuery(e.target.value);
                        setSelectedSpotlightIndex(0);
                      }}
                      onKeyDown={handleSpotlightKeyDown}
                      autoFocus
                    />
                  </div>

                  {filteredSearch.length > 0 && (
                    <div className="ipados-spotlight-results">
                      {filteredSearch.map((app, index) => (
                        <button
                          key={app.name}
                          className={`ipados-spotlight-result-item ${index === selectedSpotlightIndex ? 'selected' : ''}`}
                          onClick={() => {
                            launchApp(app.name);
                            setShowSpotlight(false);
                            setSpotlightQuery('');
                          }}
                        >
                          <div style={{ transform: 'scale(0.7)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {app.icon}
                          </div>
                          <span>{app.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* UN-AUTHENTICATED LOCK SCREEN */}
            {!user ? (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 50
              }}>

                {/* Top: Time & Date (Using global LockScreenTime component) - Absolutely Positioned */}
                <div style={{
                  position: 'absolute',
                  top: '80px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <LockScreenTime align="center" />
                </div>

                {/* Bottom: Frosted sign-in panel - Absolutely Positioned below the clock */}
                <div 
                  ref={cardRef}
                  style={{
                    position: 'absolute',
                    top: '230px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    maxWidth: '340px',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '20px 24px 16px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                    boxSizing: 'border-box'
                  }}
                >

                  {/* Title */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#ffffff',
                      letterSpacing: '-0.3px',
                      textShadow: '0 1px 6px rgba(0,0,0,0.2)'
                    }}>
                      {authMode === 'login' ? 'Welcome back' : 'Create account'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '2px'
                    }}>
                      {authMode === 'login' ? 'Sign in to FlightWatch OS' : 'Register as a new operator'}
                    </div>
                  </div>

                  {authError && (
                    <div style={{
                      marginBottom: '10px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255,59,48,0.25)',
                      border: '1px solid rgba(255,59,48,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <AlertCircle size={12} style={{ color: '#ff6b60', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: '#ff9d97' }}>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    {/* Full Name Input wrapper */}
                    <div
                      ref={nameFieldRef}
                      style={{
                        height: authMode === 'register' ? '38px' : '0px',
                        opacity: authMode === 'register' ? 1 : 0,
                        marginBottom: authMode === 'register' ? '8px' : '0px',
                        overflow: 'hidden'
                      }}
                    >
                      <input
                        type="text"
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        disabled={authSubmitting}
                        placeholder="Your full name"
                        required={authMode === 'register'}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#ffffff',
                          fontSize: '14px',
                          padding: '0 14px',
                          outline: 'none',
                          fontFamily: 'var(--font-ui)',
                          boxSizing: 'border-box',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        disabled={authSubmitting}
                        placeholder="Email address"
                        required
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#ffffff',
                          fontSize: '14px',
                          padding: '0 14px',
                          outline: 'none',
                          fontFamily: 'var(--font-ui)',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ position: 'relative', marginBottom: '8px' }}>
                      <input
                        type={showAuthPassword ? 'text' : 'password'}
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        disabled={authSubmitting}
                        placeholder="Password"
                        required
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#ffffff',
                          fontSize: '14px',
                          padding: '0 40px 0 14px',
                          outline: 'none',
                          fontFamily: 'var(--font-ui)',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        tabIndex="-1"
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showAuthPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    {/* Confirm Password Input wrapper */}
                    <div
                      ref={confirmFieldRef}
                      style={{
                        height: authMode === 'register' ? '38px' : '0px',
                        opacity: authMode === 'register' ? 1 : 0,
                        marginBottom: authMode === 'register' ? '8px' : '0px',
                        overflow: 'hidden'
                      }}
                    >
                      <input
                        type="password"
                        value={authConfirmPassword}
                        onChange={e => setAuthConfirmPassword(e.target.value)}
                        disabled={authSubmitting}
                        placeholder="Confirm password"
                        required={authMode === 'register'}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'rgba(255,255,255,0.12)',
                          color: '#ffffff',
                          fontSize: '14px',
                          padding: '0 14px',
                          outline: 'none',
                          fontFamily: 'var(--font-ui)',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '4px' }}>
                      <button
                        type="submit"
                        disabled={authSubmitting}
                        style={{
                          width: '100%',
                          height: '38px',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#007aff',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: '600',
                          fontFamily: 'var(--font-ui)',
                          cursor: authSubmitting ? 'not-allowed' : 'pointer',
                          opacity: authSubmitting ? 0.7 : 1,
                          transition: 'opacity 0.2s, transform 0.1s',
                          letterSpacing: '-0.2px'
                        }}
                      >
                        {authSubmitting ? 'Verifying…' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                      </button>
                    </div>
                  </form>

                  <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    {authMode === 'login' ? (
                      <span>
                        No account?{' '}
                        <button
                          onClick={() => handleSwitchAuthMode('register')}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0, fontWeight: '500', textDecoration: 'underline', fontSize: '12px' }}
                        >
                          Register here
                        </button>
                      </span>
                    ) : (
                      <span>
                        Already registered?{' '}
                        <button
                          onClick={() => handleSwitchAuthMode('login')}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0, fontWeight: '500', textDecoration: 'underline', fontSize: '12px' }}
                        >
                          Sign in
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* AUTHENTICATED DESKTOP HOME SCREEN */
              <>
                {/* Stage Manager Left Workspace Rail */}
                {stageManagerEnabled && stageApps.length > 0 && (
                  <div className="ipados-stage-rail">
                    {stageApps.map((appName) => {
                      const appIconObj = apps.find(a => a.name === appName);
                      return (
                        <button
                          key={appName}
                          className={`ipados-stage-thumbnail ${activeApp === appName ? 'is-active' : ''}`}
                          onClick={() => handleStageClick(appName)}
                          title={`Switch to ${appName}`}
                          aria-label={`Switch to ${appName}`}
                        >
                          <div style={{ transform: 'scale(0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {appIconObj?.icon}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Main Desktop Screen Area (Centered Grid Layout) */}
                <main className="os-main-pane" style={{ zIndex: 10, paddingLeft: stageManagerEnabled ? '64px' : '0' }}>
                  {/* Home Screen App Icons Grid with squircle styling */}
                  <div className="os-app-grid">
                    {apps.map((app) => (
                      <button
                        key={app.name}
                        className="os-app-item"
                        onClick={() => launchApp(app.name)}
                        aria-label={`Launch ${app.name} Application`}
                      >
                        <div className={`os-app-icon-plate ipados-squircle icon-${app.name.toLowerCase()} ${openApps.includes(app.name) ? 'is-open' : ''} ${activeApp === app.name ? 'is-active' : ''}`}>
                          {app.icon}
                        </div>
                        <span className="os-app-label">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </main>

                {/* DESKTOP DRAGGABLE WINDOWS RENDERING GRID */}
                {openApps.map(appName => {
                  const isMinimized = minimizedApps.includes(appName);
                  if (isMinimized) return null;

                  const isFocused = activeApp === appName;
                  const isFullscreen = windowSizes[appName] === 'fullscreen';

                  const defaultX = DEFAULT_WINDOW_POSITIONS[appName]?.x || 80;
                  const defaultY = DEFAULT_WINDOW_POSITIONS[appName]?.y || 50;
                  const pos = windowPositions[appName] || { x: defaultX, y: defaultY };
                  const isClosing = closingApps.includes(appName);

                  const defaultW = DEFAULT_WINDOW_SIZES[appName]?.w || 680;
                  const defaultH = DEFAULT_WINDOW_SIZES[appName]?.h || 520;

                  return (
                    <div
                      key={appName}
                      data-app-name={appName}
                      className={`os-window ipados-style ${isFullscreen ? 'is-fullscreen' : ''} ${isClosing ? 'is-closing' : ''}`}
                      style={{
                        zIndex: isFocused ? 35 : 20,
                        left: isFullscreen ? 0 : `${pos.x}px`,
                        top: isFullscreen ? 0 : `${pos.y}px`,
                        width: isFullscreen ? '100%' : `${windowDims[appName]?.w || defaultW}px`,
                        height: isFullscreen ? '100%' : 'fit-content',
                        maxHeight: isFullscreen ? '100%' : 'calc(100% - 80px)',
                        maxWidth: isFullscreen ? '100%' : 'calc(100% - 32px)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onClick={() => {
                        setActiveApp(appName);
                        setOpenMultitaskMenu(null);
                      }}
                    >
                      <div
                        className="ipados-window-header"
                        onPointerDown={(e) => handlePointerDown(appName, e)}
                      >
                        {/* macOS Traffic Light Controls */}
                        <div className="ipados-window-controls" onClick={e => e.stopPropagation()}>
                          <button
                            className="ipados-win-dot close"
                            onClick={() => closeApp(appName)}
                            title="Close"
                          />
                          <button
                            className="ipados-win-dot minimize"
                            onClick={() => minimizeApp(appName)}
                            title="Minimize"
                          />
                          <button
                            className="ipados-win-dot maximize"
                            onClick={() => {
                              setWindowSizes(prev => ({
                                ...prev,
                                [appName]: windowSizes[appName] === 'fullscreen' ? 'normal' : 'fullscreen'
                              }));
                            }}
                            title="Fullscreen"
                          />
                        </div>

                        {/* Centered Window Title */}
                        <div className="ipados-window-title">
                          {appName}
                        </div>
                      </div>

                      <div className="os-window-body">
                        {renderWindowContent(appName)}
                      </div>

                      {/* Visual Resize Handle indicator */}
                      {!isFullscreen && (
                        <div
                          className="ipados-resize-handle"
                          onPointerDown={(e) => handleResizePointerDown(appName, e)}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Bottom Hover Zone to trigger Dock slide-up in fullscreen mode */}
                {hasFullscreenApp && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '60px',
                      zIndex: 55,
                      background: 'transparent',
                      pointerEvents: 'auto'
                    }}
                    onMouseEnter={() => setDockHovered(true)}
                    onMouseLeave={() => setDockHovered(false)}
                  />
                )}

                {/* Bottom Translucent Floating Dock */}
                <div
                  className="os-dock-container"
                  style={{
                    zIndex: 55,
                    position: 'absolute',
                    bottom: 0,
                    paddingBottom: '10px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: (hasFullscreenApp && !dockHovered) ? 'none' : 'auto'
                  }}
                  onMouseEnter={() => setDockHovered(true)}
                  onMouseLeave={() => setDockHovered(false)}
                >
                  <div ref={dockRef} className="os-dock ipados-dock">
                    {[
                      { name: 'Spotter', icon: <Camera size={22} /> },
                      { name: 'Logbook', icon: <BookOpen size={22} /> },
                      { name: 'Analytics', icon: <BarChart3 size={22} /> }
                    ].map(dockApp => {
                      const isOpen = openApps.includes(dockApp.name);
                      const isActive = activeApp === dockApp.name;
                      return (
                        <button
                          key={dockApp.name}
                          className={`os-dock-item ipados-squircle icon-${dockApp.name.toLowerCase()} ${isOpen ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
                          onClick={() => handleDockClick(dockApp.name)}
                          onContextMenu={(e) => handleDockContextMenu(dockApp.name, e)}
                          onPointerDown={(e) => handleDockPointerDown(dockApp.name, e)}
                          onPointerUp={handleDockPointerUp}
                          onPointerLeave={handleDockPointerUp}
                          style={{ position: 'relative' }}
                          title={`Launch ${dockApp.name}`}
                          aria-label={`Launch ${dockApp.name}`}
                        >
                          {dockApp.icon}
                          {isOpen && <span className="os-dock-dot" />}
                        </button>
                      );
                    })}
                    <div className="ipados-dock-divider"></div>
                    {[
                      { name: 'Profile', icon: <User size={22} /> }
                    ].map(dockApp => {
                      const isOpen = openApps.includes(dockApp.name);
                      const isActive = activeApp === dockApp.name;
                      return (
                        <button
                          key={dockApp.name}
                          className={`os-dock-item ipados-squircle icon-${dockApp.name.toLowerCase()} ${isOpen ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
                          onClick={() => handleDockClick(dockApp.name)}
                          onContextMenu={(e) => handleDockContextMenu(dockApp.name, e)}
                          onPointerDown={(e) => handleDockPointerDown(dockApp.name, e)}
                          onPointerUp={handleDockPointerUp}
                          onPointerLeave={handleDockPointerUp}
                          style={{ position: 'relative' }}
                          title={`Launch ${dockApp.name}`}
                          aria-label={`Launch ${dockApp.name}`}
                        >
                          {dockApp.icon}
                          {isOpen && <span className="os-dock-dot" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Floating macOS-style Dock Context Menu */}
                {activeDockMenu && (
                  <div
                    className="ipados-dock-menu"
                    style={{
                      left: `${activeDockMenu.x}px`,
                      top: `${activeDockMenu.y}px`
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', padding: '2px 8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {activeDockMenu.appName}
                    </div>

                    <div className="ipados-dock-menu-divider" />

                    {activeDockMenu.appName === 'Spotter' && (
                      <button className="ipados-dock-menu-item" onClick={() => { launchApp('Spotter'); setActiveDockMenu(null); }}>
                        <span>Quick Log Sighting</span>
                        <span>📷</span>
                      </button>
                    )}

                    {activeDockMenu.appName === 'Logbook' && (
                      <button className="ipados-dock-menu-item" onClick={() => { launchApp('Logbook'); setActiveDockMenu(null); }}>
                        <span>View Logbook Ledger</span>
                        <span>📖</span>
                      </button>
                    )}

                    {activeDockMenu.appName === 'Analytics' && (
                      <button className="ipados-dock-menu-item" onClick={() => { launchApp('Analytics'); setActiveDockMenu(null); }}>
                        <span>Runway Radar</span>
                        <span>📊</span>
                      </button>
                    )}

                    {activeDockMenu.appName === 'Profile' && (
                      <button className="ipados-dock-menu-item" onClick={() => { launchApp('Profile'); setActiveDockMenu(null); }}>
                        <span>View Spotter Ranks</span>
                        <span>👤</span>
                      </button>
                    )}

                    {openApps.includes(activeDockMenu.appName) ? (
                      <>
                        <button
                          className="ipados-dock-menu-item"
                          onClick={() => {
                            if (minimizedApps.includes(activeDockMenu.appName)) {
                              setMinimizedApps(prev => prev.filter(a => a !== activeDockMenu.appName));
                              setActiveApp(activeDockMenu.appName);
                            } else {
                              minimizeApp(activeDockMenu.appName);
                            }
                            setActiveDockMenu(null);
                          }}
                        >
                          <span>{minimizedApps.includes(activeDockMenu.appName) ? 'Show Window' : 'Minimize'}</span>
                          <span>{minimizedApps.includes(activeDockMenu.appName) ? '↗' : '↘'}</span>
                        </button>

                        <button
                          className="ipados-dock-menu-item"
                          onClick={() => { closeApp(activeDockMenu.appName); setActiveDockMenu(null); }}
                          style={{ color: '#ff453a' }}
                        >
                          <span>Quit Application</span>
                          <span>×</span>
                        </button>
                      </>
                    ) : (
                      <button
                        className="ipados-dock-menu-item"
                        onClick={() => { launchApp(activeDockMenu.appName); setActiveDockMenu(null); }}
                      >
                        <span>Open New Window</span>
                        <span>＋</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// SUBVIEWS FOR EACH APP WINDOW (Extracted from inside LandingPage to prevent unmounting/remounting)

// 1. Spotter view
const SpotterView = () => {
  const { addSighting } = useSightings();
  const [reg, setReg] = useState('');
  const [airline, setAirline] = useState('');
  const [type, setType] = useState('');
  const [airport, setAirport] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reg || !airline || !type || !airport) return;
    setError('');

    try {
      const result = await addSighting({
        registration: reg,
        airline,
        aircraft_type: type,
        airport,
        sighting_date: new Date(date).toISOString(),
        notes
      });

      if (result) {
        setSuccess(true);
        setReg('');
        setAirline('');
        setType('');
        setAirport('');
        setNotes('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to log sighting. Ensure backend server and PostgreSQL database are running.');
      }
    } catch (err) {
      setError('Connection error: Failed to reach API server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {success && (
        <div style={{ color: 'var(--color-primary)', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
          ✓ Sighting logged securely in ledger
        </div>
      )}
      {error && (
        <div style={{ color: '#ff453a', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
          ⚠ {error}
        </div>
      )}

      <div className="ribbon-card">
        <div className="ribbon-card-title">New Sighting Record</div>
        <div className="ribbon-card-body salmon" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label className="hud-label">REGISTRATION NUMBER</label>
            <input
              type="text"
              className="hud-input"
              value={reg}
              onChange={e => setReg(e.target.value)}
              placeholder="e.g. A6-EQB"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="hud-label">AIRLINE OPERATOR</label>
              <input
                type="text"
                className="hud-input"
                value={airline}
                onChange={e => setAirline(e.target.value)}
                placeholder="e.g. Emirates"
                list="airlines-list"
                required
              />
              <datalist id="airlines-list">
                {SUGGESTED_AIRLINES.map(a => <option key={a} value={a} />)}
              </datalist>
            </div>
            <div>
              <label className="hud-label">AIRCRAFT TYPE</label>
              <input
                type="text"
                className="hud-input"
                value={type}
                onChange={e => setType(e.target.value)}
                placeholder="e.g. Airbus A380-800"
                list="aircraft-list"
                required
              />
              <datalist id="aircraft-list">
                {SUGGESTED_AIRCRAFT.map(a => <option key={a} value={a} />)}
              </datalist>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="hud-label">AIRPORT IATA</label>
              <input
                type="text"
                className="hud-input"
                value={airport}
                onChange={e => setAirport(e.target.value.toUpperCase())}
                placeholder="e.g. DXB"
                maxLength={4}
                list="airports-list"
                required
              />
              <datalist id="airports-list">
                {SUGGESTED_AIRPORTS.map(a => <option key={a} value={a} />)}
              </datalist>
            </div>
            <div>
              <label className="hud-label">SIGHTING TIME</label>
              <input
                type="datetime-local"
                className="hud-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="hud-label">NOTES</label>
            <textarea
              className="hud-input hud-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter runway, cruising details, flight number, weather notes..."
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="hud-btn btn-primary"
        style={{ height: '38px' }}
      >
        Add Sighting to Log
      </button>
    </form>
  );
};

// 2. Logbook view
const LogbookView = () => {
  const { sightings, deleteSighting } = useSightings();
  const [search, setSearch] = useState('');

  const filtered = sightings.filter(s => {
    const q = search.toLowerCase();
    return (
      s.registration.toLowerCase().includes(q) ||
      s.airline.toLowerCase().includes(q) ||
      s.aircraft_type.toLowerCase().includes(q) ||
      s.airport.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q))
    );
  });

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
      <div className="ribbon-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
        <div className="ribbon-card-title">Sighting Logbook Ledger</div>
        <div className="ribbon-card-body peach" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
          <div>
            <input
              type="text"
              className="hud-input"
              placeholder="Search registrations, airlines, airport hubs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="table-container" style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#ffffffff', fontStyle: 'italic', fontSize: '12px' }}>
                {sightings.length === 0 ? "No sightings in logbook yet." : "No matches found."}
              </div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reg</th>
                    <th>Airline</th>
                    <th>Aircraft</th>
                    <th>Airport</th>
                    <th style={{ width: '30%' }}>Notes</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(s.sighting_date)}</td>
                      <td style={{ fontWeight: 'bold' }}>{s.registration}</td>
                      <td>{s.airline}</td>
                      <td>{s.aircraft_type}</td>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{s.airport}</td>
                      <td style={{ fontSize: '12px' }}>{s.notes}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="hud-btn btn-danger btn-sm"
                          onClick={() => deleteSighting(s.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Analytics view
const AnalyticsView = () => {
  const { sightings, analytics } = useSightings();

  // Top Airlines
  const airlineCounts = {};
  sightings.forEach(s => {
    airlineCounts[s.airline] = (airlineCounts[s.airline] || 0) + 1;
  });
  const topAirlines = Object.entries(airlineCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Top Aircraft
  const aircraftCounts = {};
  sightings.forEach(s => {
    aircraftCounts[s.aircraft_type] = (aircraftCounts[s.aircraft_type] || 0) + 1;
  });
  const topAircraft = Object.entries(aircraftCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxCount = Math.max(...Object.values(airlineCounts), ...Object.values(aircraftCounts), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* KPI Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { label: 'Total spots', val: analytics.totalSightings, tint: 'periwinkle' },
          { label: 'Aircraft', val: analytics.uniqueAircraft, tint: 'steel' },
          { label: 'Airlines', val: analytics.uniqueAirlines, tint: 'sky' },
          { label: 'Airports', val: analytics.airportsVisited, tint: 'lime' }
        ].map(c => (
          <div key={c.label} className="ribbon-card" style={{ textAlign: 'center', marginBottom: 0 }}>
            <div className="ribbon-card-title" style={{ fontSize: '9px', padding: '3px' }}>{c.label}</div>
            <div className={`ribbon-card-body ${c.tint}`} style={{ padding: '8px 4px', fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>
              {c.val}
            </div>
          </div>
        ))}
      </div>

      {/* Horizontal Bar Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Airlines */}
        <div className="ribbon-card" style={{ marginBottom: 0 }}>
          <div className="ribbon-card-title">Top Operators</div>
          <div className="ribbon-card-body steel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topAirlines.length === 0 ? (
              <span style={{ fontSize: '11px', fontStyle: 'italic' }}>No data in ledger.</span>
            ) : (
              topAirlines.map(([name, count]) => (
                <div key={name} style={{ fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{name}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#ffffff', border: '1px solid #000000', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Aircraft */}
        <div className="ribbon-card" style={{ marginBottom: 0 }}>
          <div className="ribbon-card-title">Top Aircraft Types</div>
          <div className="ribbon-card-body steel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topAircraft.length === 0 ? (
              <span style={{ fontSize: '11px', fontStyle: 'italic' }}>No data in ledger.</span>
            ) : (
              topAircraft.map(([name, count]) => (
                <div key={name} style={{ fontSize: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80%' }}>{name}</span>
                    <span>{count}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#ffffff', border: '1px solid #000000', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / maxCount) * 100}%`, height: '100%', backgroundColor: 'var(--color-tint-olive)' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Aircraft catalog view
const AircraftView = () => {
  const [selected, setSelected] = useState('a380');

  const aircraftList = {
    a380: {
      name: "Airbus A380-800",
      description: "The double-deck superjumbo. Designed to tackle airport capacity constraints by stacking passenger space across two full decks.",
      wingspan: "79.75 m (261 ft 8 in)",
      length: "72.72 m (238 ft 7 in)",
      height: "24.09 m (79 ft 0 in)",
      mtow: "575,000 kg",
      cruiseSpeed: "Mach 0.85 (903 km/h)",
      range: "15,200 km",
      seating: "525 typical",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="80" stroke="var(--color-muted-blue)" strokeWidth="1.5" fill="none">
          <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="2,2" opacity="0.3" />
          <path d="M50,12 C47.5,20 47.5,80 47.5,83 L52.5,83 C52.5,80 52.5,20 50,12 Z" />
          <path d="M47.5,38 L10,55 L12,59 L47.5,52" />
          <path d="M52.5,38 L90,55 L88,59 L52.5,52" />
          <rect x="22" y="50" width="3" height="6" rx="1" stroke="var(--color-muted-blue)" />
          <rect x="32" y="47" width="3" height="6" rx="1" stroke="var(--color-muted-blue)" />
          <rect x="75" y="50" width="3" height="6" rx="1" stroke="var(--color-muted-blue)" />
          <rect x="65" y="47" width="3" height="6" rx="1" stroke="var(--color-muted-blue)" />
          <path d="M48.5,75 L35,80 L35,82 L48.5,81" />
          <path d="M51.5,75 L65,80 L65,82 L51.5,81" />
        </svg>
      )
    },
    b777: {
      name: "Boeing 777-300ER",
      description: "The world's largest twinjet. Backbone of long-haul aviation, known for massive GE90-115B engines and folding wing configurations on newer models.",
      wingspan: "64.80 m (212 ft 7 in)",
      length: "73.86 m (242 ft 4 in)",
      height: "18.50 m (60 ft 8 in)",
      mtow: "351,530 kg",
      cruiseSpeed: "Mach 0.84 (892 km/h)",
      range: "13,650 km",
      seating: "396 typical",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="80" stroke="var(--color-muted-blue)" strokeWidth="1.5" fill="none">
          <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="2,2" opacity="0.3" />
          <path d="M50,10 C48.5,15 48.5,80 48.5,85 L51.5,85 C51.5,80 51.5,15 50,10 Z" />
          <path d="M48.5,42 L12,56 L13,59 L48.5,50" />
          <path d="M51.5,42 L88,56 L87,59 L51.5,50" />
          <rect x="28" y="48" width="4" height="8" rx="1.5" stroke="var(--color-muted-blue)" />
          <rect x="68" y="48" width="4" height="8" rx="1.5" stroke="var(--color-muted-blue)" />
          <path d="M48.5,78 L32,83 L32,85 L48.5,83" />
          <path d="M51.5,78 L68,83 L68,85 L51.5,83" />
        </svg>
      )
    },
    concorde: {
      name: "Aérospatiale/BAC Concorde",
      description: "Supersonic icon. Operated passenger flights at Mach 2.04 until retiring in 2003. Famously crossed the Atlantic in under 3.5 hours.",
      wingspan: "25.60 m (84 ft 0 in)",
      length: "61.66 m (202 ft 4 in)",
      height: "12.20 m (40 ft 0 in)",
      mtow: "185,070 kg",
      cruiseSpeed: "Mach 2.04 (2,179 km/h)",
      range: "7,222 km",
      seating: "92 to 128",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="80" stroke="var(--color-muted-blue)" strokeWidth="1.5" fill="none">
          <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="2,2" opacity="0.3" />
          <path d="M50,8 L51.5,18 L51.5,75 L54,82 L50,85 L46,82 L48.5,75 L48.5,18 Z" />
          <path d="M48.5,35 L15,80 L48.5,80" />
          <path d="M51.5,35 L85,80 L51.5,80" />
          <path d="M49,75 L49,85 L51,85 L51,75" stroke="var(--color-muted-blue)" />
        </svg>
      )
    }
  };

  const current = aircraftList[selected];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Models</span>
        {Object.entries(aircraftList).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              textAlign: 'left',
              background: selected === key ? 'rgba(92, 118, 141, 0.15)' : 'none',
              border: selected === key ? '1px solid rgba(92, 118, 141, 0.35)' : '1px solid transparent',
              borderRadius: '6px',
              color: selected === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
              padding: '4px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              fontWeight: selected === key ? 'bold' : 'normal',
              outline: 'none'
            }}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Details */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', color: '#ffffff' }}>{current.name}</h4>
            <span style={{ fontSize: '8px', color: 'rgba(0,240,255,0.6)', textTransform: 'uppercase' }}>Blueprint Spec</span>
          </div>
          <span style={{ fontSize: '9px', color: 'var(--color-muted-orange)', border: '1px solid var(--color-muted-orange)', padding: '1px 4px', borderRadius: '3px', textTransform: 'uppercase' }}>
            {selected === 'concorde' ? 'Supersonic' : 'Widebody'}
          </span>
        </div>

        <div style={{
          backgroundColor: '#1c1c1e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '6px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {current.svg}
        </div>

        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.35 }}>
          {current.description}
        </p>

        <div className="ipados-list-group" style={{ fontSize: '10px' }}>
          {[
            { label: "Wingspan", val: current.wingspan },
            { label: "Length", val: current.length },
            { label: "Height", val: current.height },
            { label: "MTOW", val: current.mtow },
            { label: "Cruise Speed", val: current.cruiseSpeed },
            { label: "Range", val: current.range },
            { label: "Seating", val: current.seating }
          ].map(s => (
            <div key={s.label} className="ipados-list-row">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
              <span style={{ fontWeight: 'bold', color: '#ffffff', textAlign: 'right' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Airlines View
const AirlinesView = () => {
  const [selected, setSelected] = useState('EK');

  const airlinesData = {
    EK: {
      name: "Emirates",
      iata: "EK",
      icao: "UAE",
      callsign: "EMIRATES",
      founded: 1985,
      hub: "Dubai Int'l (DXB)",
      fleetSize: 262,
      fleetSummary: "A380-800, B777-300ER, B777-LR",
      description: "Based in Dubai, UAE. Emirates is the world's largest operator of the Airbus A380 superjumbo, serving as a key global aviation hub connector."
    },
    UA: {
      name: "United Airlines",
      iata: "UA",
      icao: "UAL",
      callsign: "UNITED",
      founded: 1926,
      hub: "Chicago O'Hare (ORD)",
      fleetSize: 945,
      fleetSummary: "B737, B757, B767, B777, B787, A320",
      description: "A major US carrier headquartered in Chicago. United operates a massive domestic and international network, boasting hubs across the US continent."
    },
    LH: {
      name: "Lufthansa",
      iata: "LH",
      icao: "DLH",
      callsign: "LUFTHANSA",
      founded: 1953,
      hub: "Frankfurt (FRA), Munich (MUC)",
      fleetSize: 328,
      fleetSummary: "A320, A350, A380, B747-8, B787",
      description: "Flag carrier of Germany. It is one of the founding members of Star Alliance and is famous for operating the Boeing 747-8 passenger fleet."
    },
    SQ: {
      name: "Singapore Airlines",
      iata: "SQ",
      icao: "SIA",
      callsign: "SINGAPORE",
      founded: 1947,
      hub: "Singapore Changi (SIN)",
      fleetSize: 154,
      fleetSummary: "A350-900, A380-800, B777-300ER, B787-10",
      description: "Regarded as one of the world's premier airlines, renowned for outstanding service standards. Launches the longest direct routes globally."
    }
  };

  const current = airlinesData[selected];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Carriers</span>
        {Object.entries(airlinesData).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              textAlign: 'left',
              background: selected === key ? 'rgba(92, 118, 141, 0.15)' : 'none',
              border: selected === key ? '1px solid rgba(92, 118, 141, 0.35)' : '1px solid transparent',
              borderRadius: '6px',
              color: selected === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
              padding: '4px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              fontWeight: selected === key ? 'bold' : 'normal',
              outline: 'none'
            }}
          >
            {value.name}
          </button>
        ))}
      </div>

      {/* Details */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '13px', color: '#ffffff' }}>{current.name}</h4>
          <span style={{ fontSize: '8px', color: 'rgba(0,240,255,0.6)', textTransform: 'uppercase' }}>Registry details</span>
        </div>

        <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.35 }}>
          {current.description}
        </p>

        <div className="ipados-list-group" style={{ fontSize: '10px' }}>
          {[
            { label: "Call Sign", val: current.callsign, highlight: true },
            { label: "IATA / ICAO", val: `${current.iata} / ${current.icao}` },
            { label: "Founded", val: current.founded },
            { label: "Main Hub", val: current.hub },
            { label: "Fleet size", val: current.fleetSize },
            { label: "Key models", val: current.fleetSummary }
          ].map(s => (
            <div key={s.label} className="ipados-list-row">
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
              <span style={{ fontWeight: 'bold', color: s.highlight ? 'var(--color-muted-orange)' : '#ffffff', textAlign: 'right' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Airports View
const AirportsView = () => {
  const [selected, setSelected] = useState('DXB');

  const airportsData = {
    DXB: {
      name: "Dubai International Airport",
      city: "Dubai, UAE",
      elevation: "62 ft / 19 m",
      runways: "12L/30R (14,599 ft), 12R/30L (14,196 ft)",
      freq: "ATIS: 131.7, TWR: 118.75, GND: 121.9, DEL: 120.35",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="70" stroke="var(--color-muted-blue)" strokeWidth="2" fill="none">
          <line x1="10" y1="35" x2="90" y2="35" />
          <line x1="10" y1="65" x2="90" y2="65" />
          <text x="12" y="28" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">12L</text>
          <text x="80" y="28" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">30R</text>
          <text x="12" y="77" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">12R</text>
          <text x="80" y="77" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">30L</text>
        </svg>
      )
    },
    JFK: {
      name: "John F. Kennedy Int'l",
      city: "New York, USA",
      elevation: "13 ft / 4 m",
      runways: "04L/22R (12,079 ft), 13L/31R (10,000 ft), 13R/31L (14,511 ft)",
      freq: "ATIS: 128.72, TWR: 119.1, GND: 121.9, DEL: 135.05",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="70" stroke="var(--color-muted-blue)" strokeWidth="2" fill="none">
          <line x1="10" y1="30" x2="90" y2="70" />
          <line x1="20" y1="40" x2="80" y2="70" strokeWidth="1.5" opacity="0.6" />
          <line x1="30" y1="90" x2="70" y2="10" />
          <line x1="40" y1="90" x2="80" y2="10" strokeWidth="1.5" opacity="0.6" />
          <text x="80" y="78" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">13/31</text>
          <text x="75" y="18" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">04/22</text>
        </svg>
      )
    },
    LHR: {
      name: "London Heathrow Airport",
      city: "London, UK",
      elevation: "83 ft / 25 m",
      runways: "09L/27R (12,795 ft), 09R/27L (12,008 ft)",
      freq: "ATIS: 128.07, TWR: 118.5, GND: 121.85, DEL: 121.97",
      svg: (
        <svg viewBox="0 0 100 100" width="100%" height="70" stroke="var(--color-muted-blue)" strokeWidth="2" fill="none">
          <line x1="10" y1="30" x2="90" y2="30" />
          <line x1="10" y1="70" x2="90" y2="70" />
          <rect x="38" y="42" width="24" height="16" fill="rgba(92, 118, 141, 0.05)" stroke="rgba(92, 118, 141, 0.3)" strokeWidth="1" />
          <text x="12" y="25" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">09L</text>
          <text x="80" y="25" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">27R</text>
          <text x="12" y="82" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">09R</text>
          <text x="80" y="82" fill="var(--color-muted-orange)" fontSize="7" fontWeight="bold">27L</text>
        </svg>
      )
    }
  };

  const current = airportsData[selected];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>Hubs</span>
        {Object.entries(airportsData).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              textAlign: 'left',
              background: selected === key ? 'rgba(92, 118, 141, 0.15)' : 'none',
              border: selected === key ? '1px solid rgba(92, 118, 141, 0.35)' : '1px solid transparent',
              borderRadius: '6px',
              color: selected === key ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
              padding: '4px 6px',
              fontSize: '10px',
              cursor: 'pointer',
              fontWeight: selected === key ? 'bold' : 'normal',
              outline: 'none'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Details */}
      <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '13px', color: '#ffffff' }}>{current.name}</h4>
          <span style={{ fontSize: '8px', color: 'rgba(0,240,255,0.6)', textTransform: 'uppercase' }}>{current.city}</span>
        </div>

        <div style={{
          backgroundColor: '#1c1c1e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '6px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {current.svg}
        </div>

        <div className="ipados-list-group" style={{ fontSize: '10px' }}>
          {[
            { label: "Elevation", val: current.elevation },
            { label: "Runway Details", val: current.runways },
            { label: "Radio Comms (MHz)", val: current.freq }
          ].map(s => (
            <div key={s.label} className="ipados-list-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', textTransform: 'uppercase' }}>{s.label}</span>
              <span style={{ fontWeight: 'bold', color: '#ffffff' }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Profile View
const ProfileView = () => {
  const { user, updateUserProfile } = useAuth();
  const { sightings } = useSightings();
  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const numSpots = sightings.length;
  let rank = "Novice Spotter";
  let rankColor = "#a5b8c0";
  if (numSpots > 10) {
    rank = "Aviation Legend";
    rankColor = "#8a6f9f";
  } else if (numSpots >= 6) {
    rank = "Captain Spotter";
    rankColor = "var(--color-muted-blue)";
  } else if (numSpots >= 3) {
    rank = "First Officer Spotter";
    rankColor = "var(--color-muted-orange)";
  }

  const uniqueAirports = new Set(sightings.map(s => s.airport));
  const hasGiant = sightings.some(s => s.aircraft_type.toLowerCase().includes('a380') || s.aircraft_type.toLowerCase().includes('747'));

  const achievements = [];
  if (uniqueAirports.size >= 3) achievements.push({ title: "International Observer", desc: "Logged sightings at 3+ airport hubs." });
  if (hasGiant) achievements.push({ title: "Heavy Metal Collector", desc: "Spotted superjumbo (A380 or 747)." });
  if (numSpots >= 5) achievements.push({ title: "Dedicated Aviator", desc: "Logged 5+ sightings in active ledger." });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserProfile({ name });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', height: '100%' }}>
      {/* Rank Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: rankColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '15px'
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '12px', color: '#ffffff' }}>{user?.name}</h4>
          <span style={{ fontSize: '9px', color: rankColor, fontWeight: 'bold', textTransform: 'uppercase' }}>{rank}</span>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Joined {new Date(user?.joinedAt || Date.now()).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Update Profile */}
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>DISPLAY NAME</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="hud-input"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', height: '34px', fontSize: '13px' }}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <button type="submit" className="hud-btn" style={{ padding: '0 12px', fontSize: '10px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', textTransform: 'none', fontWeight: 'bold' }}>
            Update
          </button>
        </div>
        {success && <span style={{ color: 'var(--color-muted-green)', fontSize: '9px' }}>✓ Profile name updated in registry.</span>}
      </form>

      {/* Achievements list */}
      <div>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>UNLOCKED BADGES</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          {achievements.length === 0 ? (
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No achievements unlocked yet. Log sightings to earn badges.</span>
          ) : (
            achievements.map(a => (
              <div key={a.title} className="ipados-card" style={{ borderLeft: '3px solid var(--color-muted-orange)', borderRadius: '0 10px 10px 0', padding: '6px 8px', fontSize: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{a.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px' }}>{a.desc}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 8. Settings view
const SettingsView = ({ theme, setTheme, wallpaper, setWallpaper, handleResetData }) => {
  const { logout } = useAuth();
  const [cpu, setCpu] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 20) + 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', height: '100%', fontSize: '11px' }}>
      {/* Wallpapers */}
      <div>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Wallpaper</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { id: 'a350', name: 'Dawn A350' },
            { id: 'sunset', name: 'Sol Sunset' },
            { id: 'radar', name: 'Radar Grid' }
          ].map(wp => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              style={{
                padding: '6px 2px',
                fontSize: '9px',
                background: wallpaper === wp.id ? 'rgba(92, 118, 141, 0.15)' : 'rgba(255,255,255,0.04)',
                border: wallpaper === wp.id ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: wallpaper === wp.id ? 'bold' : 'normal'
              }}
            >
              {wp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Appearance</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {[
            { id: 'light', name: 'Light' },
            { id: 'dark', name: 'Dark' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              style={{
                padding: '6px 2px',
                fontSize: '9px',
                background: theme === t.id ? 'rgba(92, 118, 141, 0.15)' : 'rgba(255,255,255,0.04)',
                border: theme === t.id ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: theme === t.id ? 'bold' : 'normal'
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div>
        <span className="hud-label" style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>System Diagnostics</span>
        <div className="ipados-list-group" style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>
          <div className="ipados-list-row">
            <span>OS KERNEL</span>
            <span style={{ color: 'var(--color-muted-blue)' }}>iPadOS_v18.4-MOCK</span>
          </div>
          <div className="ipados-list-row">
            <span>CPU LOAD</span>
            <span style={{ color: cpu > 20 ? 'var(--color-muted-orange)' : 'var(--color-muted-green)' }}>{cpu}%</span>
          </div>
          <div className="ipados-list-row">
            <span>SYSTEM MEMORY</span>
            <span style={{ color: 'var(--color-muted-blue)' }}>148.5 KB / 1024.0 KB</span>
          </div>
          <div className="ipados-list-row">
            <span>DB CLOUD SYNC</span>
            <span style={{ color: 'var(--color-muted-green)' }}>SUCCESSFUL</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
        <button
          onClick={handleResetData}
          className="hud-btn"
          style={{ width: '100%', fontSize: '10px', padding: '6px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', textTransform: 'none' }}
        >
          Reset Sighting Data
        </button>
        <button
          onClick={() => logout()}
          className="hud-btn"
          style={{ width: '100%', fontSize: '10px', padding: '6px', backgroundColor: 'rgba(179, 92, 92, 0.1)', border: '1px solid var(--color-muted-red)', color: 'var(--color-muted-red)', borderRadius: '8px', textTransform: 'none' }}
        >
          Sign Out / Lock Console
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
