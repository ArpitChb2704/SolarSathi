import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddPlant from './pages/AddPlant'
import Profile from './pages/Profile'
import Chatbot from './pages/Chatbot'
import API from './config'

const pageTitles = {
  dashboard: 'Dashboard',
  add: 'Add Solar Plant',
  profile: 'My Profile',
  chat: 'AI Assistant',
}

function AppShell() {
  const { userId, logout } = useAuth()
  const [authPage, setAuthPage] = useState('login')
  const [page, setPage] = useState('dashboard')
  const [userName, setUserName] = useState('')
  const [alerts, setAlerts] = useState([])
  const [showAlerts, setShowAlerts] = useState(false)

  useEffect(() => {
    if (!userId) return
    fetch(`${API}/alerts/${userId}`)
      .then(r => r.json())
      .then(setAlerts)
      .catch(() => {})
  }, [userId, page])

  useEffect(() => {
    if (!userId) return
    fetch(`${API}/user/${userId}`)
      .then(r => r.json())
      .then(d => setUserName(d.name))
      .catch(() => {})
  }, [userId])

  if (!userId) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />
  }

  const navItems = [
    { id: 'dashboard', icon: '⚡', label: 'Dashboard' },
    { id: 'add', icon: '＋', label: 'Add Plant' },
    { id: 'profile', icon: '👤', label: 'My Profile' },
    { id: 'chat', icon: '💬', label: 'AI Assistant' },
  ]

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon"><img src="/logo.png" alt="Logo" height={120} width={120} /></div>
          <div className="brand-name">SolarSathi</div>
          <div className="brand-sub">Monitoring Platform</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">
              {userId && userId.name
                ? userId.name.charAt(0).toUpperCase()
                : String(userId).charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-label">Logged in as</div>
              <div className="user-id">{userName || `User #${userId}`}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main">
        <div className="topbar">
          <div className="page-title">{pageTitles[page]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="status-dot" />
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>Backend Connected</span>

            {/* Bell icon */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowAlerts(s => !s)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '8px 12px',
                  cursor: 'pointer', fontSize: 16,
                  position: 'relative',
                }}
              >
                🔔
                {alerts.length > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#ff5757', color: '#fff',
                    borderRadius: '50%', width: 18, height: 18,
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {alerts.length}
                  </span>
                )}
              </button>

              {showAlerts && (
                <div style={{
                  position: 'absolute', right: 0, top: 44,
                  width: 320, background: 'rgba(15,22,35,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  zIndex: 1000,
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                    🔔 Alerts {alerts.length > 0 && <span style={{ color: '#ff5757' }}>({alerts.length})</span>}
                  </div>
                  {alerts.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                      No alerts — all plants performing well ✅
                    </div>
                  ) : (
                    alerts.map(a => (
                      <div key={a.id} style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                      }}>
                        <span style={{ fontSize: 18 }}>{a.severity === 'critical' ? '🔴' : '🟡'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.4 }}>{a.message}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                            {new Date(a.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            fetch(`${API}/alerts/${a.id}/read`, { method: 'PATCH' })
                            setAlerts(prev => prev.filter(x => x.id !== a.id))
                          }}
                          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16 }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="page-content">
          {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
          {page === 'add' && <AddPlant />}
          {page === 'profile' && <Profile />}
          {page === 'chat' && <Chatbot userName={userName} />}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div style={{
        display: 'none',
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        background: 'rgba(10,14,23,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 0 20px',
        zIndex: 200,
      }} className="mobile-bottom-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 4px',
              color: page === item.id ? '#f5c842' : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: page === item.id ? 600 : 400,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
